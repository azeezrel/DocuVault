import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  DocumentItem,
  DocumentCategory,
  ChatMessage,
  ShareLink,
  LifeDeadline,
  VaultHealthStatus,
  DuplicateWarning,
} from '../types';

const PREDEFINED_IDS = new Set([
  'doc-edu-az400',
  'doc-edu-bsc',
  'doc-car-employment',
  'doc-car-aws',
  'doc-fin-tax',
  'doc-fin-stmt',
  'doc-ins-health',
  'doc-ins-motor',
  'doc-pers-passport',
  'doc-pers-id',
  'doc-prop-lease',
  'doc-veh-v5c',
  'doc-hea-report',
  'doc-leg-will',
]);

const PREDEFINED_NAMES = new Set([
  'AZ-400-Certificate.pdf',
  'BSc_Degree_Certificate.pdf',
  'Employment_Agreement_Google.pdf',
  'AWS_Solutions_Architect_Assoc.pdf',
  'Tax_Return_FY2025_P60.pdf',
  'Chase_Checking_Statement_Jan2026.pdf',
  'Bupa_Global_Health_Policy_2026.pdf',
  'Admiral_Car_Insurance_Policy.pdf',
  'Biometric_Passport_Main.pdf',
  'National_ID_Card.pdf',
  'Tenancy_Agreement_Lease_2026.pdf',
  'Vehicle_V5C_Registration.pdf',
  'Comprehensive_Health_Report_2026.pdf',
  'Last_Will_and_Testament_Signed.pdf',
]);

export const isPredefinedDocument = (doc: { id?: string; name?: string; title?: string }): boolean => {
  if (!doc) return false;
  if (doc.id && PREDEFINED_IDS.has(doc.id)) return true;
  if (doc.name && PREDEFINED_NAMES.has(doc.name)) return true;
  if (
    doc.id &&
    /^(doc-edu-|doc-car-|doc-fin-|doc-ins-|doc-pers-|doc-prop-|doc-veh-|doc-hea-|doc-leg-)/.test(
      doc.id
    )
  ) {
    return true;
  }
  return false;
};

interface VaultContextType {
  documents: DocumentItem[];
  selectedCategory: DocumentCategory | 'All' | 'Favorites' | 'Recent';
  setSelectedCategory: (cat: DocumentCategory | 'All' | 'Favorites' | 'Recent') => void;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedDocForView: DocumentItem | null;
  setSelectedDocForView: (doc: DocumentItem | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  docToShare: DocumentItem | null;
  setDocToShare: (doc: DocumentItem | null) => void;
  shareLinks: ShareLink[];
  chatHistory: ChatMessage[];
  addDocument: (doc: DocumentItem) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  permanentDeleteDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  createShareLink: (
    docId: string,
    recipientEmail: string,
    permission: 'view' | 'download',
    durationDays: number
  ) => ShareLink;
  revokeShareLink: (linkId: string) => void;
  deadlines: LifeDeadline[];
  addDeadline: (deadline: LifeDeadline) => void;
  removeDeadline: (id: string) => void;
  categoriesWithCounts: { category: DocumentCategory; count: number }[];
  attentionCounts: {
    expiring: number;
    expired: number;
    review: number;
    missingDates: number;
  };
  vaultHealth: VaultHealthStatus;
  checkDuplicate: (fileName: string, contentHash?: string) => DuplicateWarning | null;
  verifyDocument: (id: string) => void;
  executeRecommendedAction: (docId: string, actionId: string) => void;
  recycleBinDocuments: DocumentItem[];
  emptyRecycleBin: () => void;
  clearAllDocuments: () => void;
  uploadTargetCategory: DocumentCategory | null;
  setUploadTargetCategory: (cat: DocumentCategory | null) => void;
  openUploadModal: (targetCategory?: DocumentCategory) => void;
}

const STORAGE_KEY = 'lifevault_documents_prod_v1';
const SHARE_STORAGE_KEY = 'lifevault_shares_prod_v1';
const CHAT_STORAGE_KEY = 'lifevault_chat_prod_v1';

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only maintain user uploaded documents; purge any predefined/sample documents
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const userOnly = parsed.filter((d: DocumentItem) => !isPredefinedDocument(d));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly));
          return userOnly;
        }
      }
    } catch (e) {
      console.error('Failed reading from localStorage', e);
    }
    return [];
  });

  const [shareLinks, setShareLinks] = useState<ShareLink[]>(() => {
    try {
      const saved = localStorage.getItem(SHARE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to **DocuMind AI**. I am your personal document assistant and document intelligence engine.\n\nYou can upload any of your personal documents (Identity, Passports, Contracts, Insurance, Certificates, Receipts, etc.). Ask me questions anytime to extract dates, key terms, obligations, or summarized records.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All' | 'Favorites' | 'Recent'>('All');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        if (path === '/admin' || window.location.hash === '#admin') return 'admin';
        const savedAuth = localStorage.getItem('lifevault_auth_prod_v1');
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          if (parsed?.currentUser?.role === 'admin') {
            return 'admin';
          }
        }
      }
    } catch {}
    return 'home';
  });
  const [selectedDocForView, setSelectedDocForView] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetCategory, setUploadTargetCategory] = useState<DocumentCategory | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [docToShare, setDocToShare] = useState<DocumentItem | null>(null);
  const [customDeadlines, setCustomDeadlines] = useState<LifeDeadline[]>([]);

  const openUploadModal = (targetCategory?: DocumentCategory) => {
    setUploadTargetCategory(targetCategory || null);
    setIsUploadModalOpen(true);
  };

  const addDeadline = (deadline: LifeDeadline) => {
    setCustomDeadlines((prev) => [deadline, ...prev]);
  };

  const removeDeadline = (id: string) => {
    setCustomDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shareLinks));
    } catch {}
  }, [shareLinks]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    } catch {}
  }, [chatHistory]);

  const addDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isDeleted: true, deletedAt: new Date().toISOString() } : d))
    );
  };

  const permanentDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const restoreDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isDeleted: false, deletedAt: undefined } : d))
    );
  };

  const toggleFavorite = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  const verifyDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          verifiedByHuman: true,
          aiConfidence: Math.max(d.aiConfidence || 92, 95),
          confidenceWarning: null,
          status: d.status === 'NEEDS_REVIEW' ? 'VALID' : d.status,
        };
      })
    );
  };

  const executeRecommendedAction = (docId: string, actionId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const updatedActions = (d.recommendedActions || []).map((act) =>
          act.id === actionId ? { ...act, executed: true } : act
        );
        return {
          ...d,
          recommendedActions: updatedActions,
          reminderCreated: true,
        };
      })
    );
  };

  const checkDuplicate = (fileName: string, contentHash?: string): DuplicateWarning | null => {
    const activeDocs = documents.filter((d) => !d.isDeleted);

    // 1. Exact hash check
    if (contentHash) {
      const exactHash = activeDocs.find((d) => d.contentHash && d.contentHash === contentHash);
      if (exactHash) {
        return {
          existingDoc: exactHash,
          matchType: 'exact_hash',
          similarityScore: 100,
          reason: `Exact digital hash duplicate of "${exactHash.title}".`,
        };
      }
    }

    // 2. Exact filename match
    const exactName = activeDocs.find((d) => d.name.toLowerCase() === fileName.toLowerCase());
    if (exactName) {
      return {
        existingDoc: exactName,
        matchType: 'exact_hash',
        similarityScore: 100,
        reason: `Identical file name already exists in vault: "${exactName.title}".`,
      };
    }

    // 3. Semantic similarity calculation
    const cleanCurrent = fileName.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/g, '');
    for (const doc of activeDocs) {
      const cleanDoc = doc.name.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/g, '');
      if (cleanCurrent === cleanDoc) {
        return {
          existingDoc: doc,
          matchType: 'semantic_similarity',
          similarityScore: 98,
          reason: `File "${fileName}" appears identical to "${doc.name}" in ${doc.folder}.`,
        };
      }

      // Check for partial or high similarity (e.g., Insurance_2026 vs Insurance_Policy)
      if (
        (cleanCurrent.length >= 4 && cleanDoc.includes(cleanCurrent)) ||
        (cleanDoc.length >= 4 && cleanCurrent.includes(cleanDoc))
      ) {
        return {
          existingDoc: doc,
          matchType: 'semantic_similarity',
          similarityScore: 82,
          reason: `High semantic similarity between "${fileName}" and existing document "${doc.name}" in ${doc.folder}.`,
        };
      }
    }

    return null;
  };

  const clearAllDocuments = () => {
    setDocuments([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const emptyRecycleBin = () => {
    setDocuments((prev) => prev.filter((d) => !d.isDeleted));
  };

  const recycleBinDocuments = useMemo(() => {
    return documents.filter((d) => d.isDeleted);
  }, [documents]);

  const createShareLink = (
    docId: string,
    recipientEmail: string,
    permission: 'view' | 'download',
    durationDays: number
  ): ShareLink => {
    const doc = documents.find((d) => d.id === docId);
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + durationDays);

    const newLink: ShareLink = {
      id: 'share-' + Math.random().toString(36).substring(2, 9),
      documentId: docId,
      documentTitle: doc ? doc.title : 'Document',
      recipientEmail,
      permission,
      createdAt: new Date().toISOString(),
      expiresAt: expDate.toISOString(),
      viewCount: 0,
      active: true,
      downloadAllowed: permission === 'download',
    };

    setShareLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  const revokeShareLink = (linkId: string) => {
    setShareLinks((prev) => prev.map((l) => (l.id === linkId ? { ...l, active: false } : l)));
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory((prev) => [...prev, newMsg]);
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  // Derive dynamic categories with counts matching hierarchical taxonomy
  const categoriesWithCounts = useMemo(() => {
    const activeDocs = documents.filter((d) => !d.isDeleted);
    const allCategories: DocumentCategory[] = [
      'Personal',
      'Education',
      'Career',
      'Finance',
      'Insurance',
      'Property',
      'Vehicles',
      'Family',
      'Legal',
    ];

    return allCategories.map((category) => {
      const count = activeDocs.filter((d) => d.category === category).length;
      return { category, count };
    });
  }, [documents]);

  // Derive dynamic deadlines and event reminders from active documents (Multi-Event Extraction)
  const deadlines = useMemo<LifeDeadline[]>(() => {
    const activeDocs = documents.filter((d) => !d.isDeleted);
    const generated: LifeDeadline[] = [];

    activeDocs.forEach((doc) => {
      // 1. If document has detectedEvents (from AI event extraction), register each event!
      if (doc.detectedEvents && doc.detectedEvents.length > 0) {
        doc.detectedEvents.forEach((evt) => {
          if (!evt.date) return;
          const exp = new Date(evt.date);
          const now = new Date();
          const diffDays = Math.ceil((new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / (1000 * 60 * 60 * 24));
          
          let priority: 'high' | 'medium' | 'low' = 'low';
          if (diffDays < 0 || diffDays <= 30) priority = 'high';
          else if (diffDays <= 90) priority = 'medium';

          generated.push({
            id: `dl-${doc.id}-${evt.id}`,
            documentId: doc.id,
            documentTitle: doc.title,
            eventId: evt.id,
            title: `${doc.title} — ${evt.title}`,
            date: evt.date,
            daysRemaining: diffDays,
            eventType: evt.eventType,
            urgency: priority,
            priority,
            actionRequired:
              diffDays < 0
                ? `${evt.title} past date (${Math.abs(diffDays)} days ago)`
                : diffDays <= 30
                ? `Urgent: ${evt.title} due in ${diffDays} days`
                : `Reminder: ${diffDays} days remaining`,
            category: doc.category,
            reminderScheduleDays: doc.reminderSchedules || [90, 30, 7, 1],
          });
        });
      } else if (doc.eventDate || doc.expiryDate) {
        const targetDateStr = doc.eventDate || doc.expiryDate;
        if (!targetDateStr) return;
        const exp = new Date(targetDateStr);
        const now = new Date();
        const diffDays = Math.ceil((new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / (1000 * 60 * 60 * 24));

        let priority: 'high' | 'medium' | 'low' = 'low';
        if (diffDays < 0 || diffDays <= 30) priority = 'high';
        else if (diffDays <= 90) priority = 'medium';

        const eventLabel =
          doc.eventType === 'renewal'
            ? 'Renewal'
            : doc.eventType === 'payment_due'
            ? 'Payment Due'
            : doc.eventType === 'notice_deadline'
            ? 'Notice Deadline'
            : doc.eventType === 'filing_deadline'
            ? 'Filing Deadline'
            : 'Expiration';

        generated.push({
          id: 'dl-' + doc.id,
          documentId: doc.id,
          documentTitle: doc.title,
          title: `${doc.title} ${eventLabel}`,
          date: targetDateStr,
          daysRemaining: diffDays,
          eventType: doc.eventType || 'expiration',
          urgency: priority,
          priority,
          actionRequired:
            diffDays < 0
              ? `${eventLabel} overdue - Action required`
              : diffDays <= 30
              ? `Urgent: Due in ${diffDays} days`
              : `Scheduled reminder: ${diffDays} days remaining`,
          category: doc.category,
          reminderScheduleDays: doc.reminderSchedules || [90, 30, 7, 1],
        });
      }
    });

    return [...generated, ...customDeadlines].sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [documents, customDeadlines]);

  // Derive attention status counts accurately
  const attentionCounts = useMemo(() => {
    const activeDocs = documents.filter((d) => !d.isDeleted);
    let expired = 0;
    let expiring = 0;
    let review = 0;
    let missingDates = 0;

    activeDocs.forEach((doc) => {
      if (doc.status === 'EXPIRED') expired++;
      else if (doc.status === 'EXPIRING_SOON') expiring++;
      else if (doc.status === 'NEEDS_REVIEW') review++;

      const dateToCheck = doc.eventDate || doc.expiryDate;
      if (!dateToCheck && doc.status !== 'NO_EXPIRATION') {
        missingDates++;
      } else if (dateToCheck && doc.status !== 'EXPIRED' && doc.status !== 'EXPIRING_SOON' && doc.status !== 'NEEDS_REVIEW') {
        const exp = new Date(dateToCheck);
        const now = new Date();
        const diffDays = Math.ceil((new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) expired++;
        else if (diffDays <= 90) expiring++;
      }
    });

    return { expired, expiring, review, missingDates };
  }, [documents]);

  // Overall Vault Health Status (Concept #11: Comprehensive Document Health)
  const vaultHealth = useMemo<VaultHealthStatus>(() => {
    const activeDocs = documents.filter((d) => !d.isDeleted);
    if (activeDocs.length === 0) {
      return {
        score: 100,
        totalDocuments: 0,
        expiredCount: 0,
        expiringSoonCount: 0,
        needsReviewCount: 0,
        missingMetadataCount: 0,
        possibleDuplicatesCount: 0,
        uncategorizedCount: 0,
        categorizationRate: 100,
        upcomingRenewalsHandled: 100,
        missingDatesCount: 0,
        unreviewedCount: 0,
        securityRating: 'A+',
      };
    }

    let expired = 0;
    let expiring = 0;
    let review = 0;
    let missingMetadata = 0;
    let uncategorized = 0;
    let possibleDuplicates = 0;

    const namesSeen = new Set<string>();

    activeDocs.forEach((doc) => {
      // Expiration check
      const dateToCheck = doc.eventDate || doc.expiryDate;
      if (doc.status === 'EXPIRED') {
        expired++;
      } else if (doc.status === 'EXPIRING_SOON') {
        expiring++;
      } else if (doc.status === 'NEEDS_REVIEW' || (!doc.verifiedByHuman && (doc.aiConfidence || 100) < 75)) {
        review++;
      } else if (dateToCheck && doc.status !== 'NO_EXPIRATION') {
        const exp = new Date(dateToCheck);
        const now = new Date();
        const diff = Math.ceil((new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) expired++;
        else if (diff <= 90) expiring++;
      }

      // Missing metadata check
      const isMissingMeta =
        !doc.documentNumber ||
        doc.documentNumber === 'N/A' ||
        !doc.issueDate ||
        !doc.owner;
      if (isMissingMeta) {
        missingMetadata++;
      }

      // Uncategorized check
      if (!doc.folder || doc.folder === 'Unassigned' || !doc.category) {
        uncategorized++;
      }

      // Duplicate check
      const clean = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (namesSeen.has(clean)) {
        possibleDuplicates++;
      } else {
        namesSeen.add(clean);
      }
    });

    const categorized = activeDocs.filter((d) => d.category && d.folder && d.folder !== 'Unassigned').length;
    const catRate = Math.round((categorized / activeDocs.length) * 100);

    const score = Math.max(
      30,
      Math.min(
        100,
        100 -
          expired * 15 -
          expiring * 5 -
          review * 10 -
          missingMetadata * 4 -
          possibleDuplicates * 5
      )
    );

    let securityRating: 'A+' | 'A' | 'B' | 'C' = 'A+';
    if (score < 60) securityRating = 'C';
    else if (score < 80) securityRating = 'B';
    else if (score < 95) securityRating = 'A';

    return {
      score,
      totalDocuments: activeDocs.length,
      expiredCount: expired,
      expiringSoonCount: expiring,
      needsReviewCount: review,
      missingMetadataCount: missingMetadata,
      possibleDuplicatesCount: possibleDuplicates,
      uncategorizedCount: uncategorized,
      categorizationRate: catRate,
      upcomingRenewalsHandled: expiring === 0 ? 100 : Math.max(30, 100 - expiring * 15),
      missingDatesCount: attentionCounts.missingDates,
      unreviewedCount: review,
      securityRating,
    };
  }, [documents, attentionCounts]);

  return (
    <VaultContext.Provider
      value={{
        documents,
        selectedCategory,
        setSelectedCategory,
        selectedFolder,
        setSelectedFolder,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        selectedDocForView,
        setSelectedDocForView,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        docToShare,
        setDocToShare,
        shareLinks,
        chatHistory,
        addDocument,
        updateDocument,
        deleteDocument,
        permanentDeleteDocument,
        restoreDocument,
        toggleFavorite,
        verifyDocument,
        executeRecommendedAction,
        checkDuplicate,
        addChatMessage,
        clearChat,
        createShareLink,
        revokeShareLink,
        deadlines,
        addDeadline,
        removeDeadline,
        categoriesWithCounts,
        attentionCounts,
        vaultHealth,
        recycleBinDocuments,
        emptyRecycleBin,
        clearAllDocuments,
        uploadTargetCategory,
        setUploadTargetCategory,
        openUploadModal,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
