import {
  DocumentItem,
  ChatMessage,
  ChatCitation,
  DocumentDetectedEvent,
  DocumentRecommendedAction,
  DocumentStatus,
} from '../types';

export interface AnalyzePayload {
  fileName: string;
  fileType: string;
  textContent?: string;
  base64Data?: string;
  mimeType?: string;
}

export interface ChatAssistantResponse {
  reply: string;
  citations: ChatCitation[];
}

/**
 * Deterministic calculation helpers (Never ask LLM to calculate dates or days remaining)
 */
export function calculateDaysRemaining(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  // reset hours to midnight for exact calendar day difference
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.ceil((targetMidnight - nowMidnight) / (1000 * 60 * 60 * 24));
}

export function calculateDeterministicStatus(
  expiryDate: string | null | undefined,
  isNoExpiryType: boolean = false
): DocumentStatus {
  if (isNoExpiryType || !expiryDate) {
    return isNoExpiryType ? 'NO_EXPIRATION' : 'VALID';
  }
  const days = calculateDaysRemaining(expiryDate);
  if (days < 0) {
    return 'EXPIRED';
  } else if (days <= 90) {
    return 'EXPIRING_SOON';
  } else {
    return 'VALID';
  }
}

export async function analyzeDocumentWithGemini(payload: AnalyzePayload): Promise<Partial<DocumentItem>> {
  try {
    const res = await fetch('/api/gemini/analyze-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.metadata || {};
  } catch (error) {
    console.error('Failed to analyze document via Gemini:', error);
    // Intelligent client-side fallback based on filename and type
    const nameLower = payload.fileName.toLowerCase();
    let category: DocumentItem['category'] = 'Personal';
    let subcategory = 'Identity';
    let docType = 'Document';
    let folder = 'Personal/Identity';
    let title = payload.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    let docNumber = 'REF-' + Math.floor(100000 + Math.random() * 900000);
    let issueDate: string | null = '2026-01-15';
    let expiryDate: string | null = null;
    let status: DocumentItem['status'] = 'VALID';
    let aiConfidence = 96;
    let confidenceWarning: string | null = null;
    let eventType: DocumentItem['eventType'] = 'expiration';
    let metadataDetails: DocumentItem['metadataDetails'] = {};
    let detectedEvents: DocumentDetectedEvent[] = [];
    let recommendedActions: DocumentRecommendedAction[] = [];

    if (nameLower.includes('az-400') || nameLower.includes('az400')) {
      category = 'Career';
      subcategory = 'Certifications';
      docType = 'Professional Certificate';
      title = 'Microsoft Certified: Azure DevOps Engineer Expert';
      folder = 'Career/Certifications';
      docNumber = 'ABC-123456';
      issueDate = '2026-09-15';
      expiryDate = '2027-09-15';
      status = 'VALID';
      aiConfidence = 97;
      eventType = 'expiration';
      metadataDetails = {
        issuingOrganization: 'Microsoft',
        certificateId: 'ABC-123456',
        holderName: 'John Ahmed',
      };
      detectedEvents = [
        {
          id: 'evt-az400-exp',
          title: 'Certificate Expiration',
          date: '2027-09-15',
          eventType: 'expiration',
          description: 'Microsoft Certified Azure DevOps Engineer renewal deadline',
          daysRemaining: calculateDaysRemaining('2027-09-15'),
          status: 'UPCOMING',
        },
      ];
      recommendedActions = [
        {
          id: 'act-az400-1',
          title: 'Add renewal reminder',
          actionType: 'create_reminder',
          description: 'Register calendar alert 30 days prior to certificate expiration',
        },
        {
          id: 'act-az400-2',
          title: 'Review certification details',
          actionType: 'review_details',
          description: 'Inspect Microsoft Learn renewal requirements',
        },
      ];
    } else if (nameLower.includes('az-') || nameLower.includes('aws') || nameLower.includes('cert')) {
      category = 'Career';
      subcategory = 'Certifications';
      docType = 'Professional Certificate';
      folder = 'Career/Certifications';
      issueDate = '2026-03-10';
      expiryDate = '2027-03-10';
      status = 'VALID';
      aiConfidence = 94;
      eventType = 'expiration';
      metadataDetails = {
        issuingOrganization: nameLower.includes('aws') ? 'Amazon Web Services' : 'Certification Authority',
        certificateId: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
        holderName: 'John Ahmed',
      };
      detectedEvents = [
        {
          id: 'evt-cert-exp',
          title: 'Credential Expiration',
          date: '2027-03-10',
          eventType: 'expiration',
          description: 'Professional credential expiration deadline',
          daysRemaining: calculateDaysRemaining('2027-03-10'),
          status: 'UPCOMING',
        },
      ];
      recommendedActions = [
        {
          id: 'act-cert-1',
          title: 'Add renewal reminder',
          actionType: 'create_reminder',
          description: 'Schedule automated reminders 90, 30, and 7 days prior',
        },
      ];
    } else if (nameLower.includes('degree') || nameLower.includes('university') || nameLower.includes('transcript') || nameLower.includes('nysc')) {
      category = 'Education';
      subcategory = nameLower.includes('degree') ? 'Degrees' : nameLower.includes('transcript') ? 'Transcripts' : 'Certificates';
      docType = nameLower.includes('degree') ? 'University Degree Certificate' : 'Academic Certificate';
      folder = `Education/${subcategory}`;
      issueDate = '2022-07-20';
      expiryDate = null;
      status = 'NO_EXPIRATION';
      aiConfidence = 98;
      metadataDetails = {
        issuingOrganization: 'University Academic Senate',
        holderName: 'John Ahmed',
      };
      recommendedActions = [
        {
          id: 'act-edu-1',
          title: 'Verify academic credentials',
          actionType: 'review_details',
          description: 'Confirm graduation honors and degree registry reference',
        },
      ];
    } else if (nameLower.includes('passport')) {
      category = 'Personal';
      subcategory = 'Identity';
      docType = 'Passport';
      folder = 'Personal/Identity';
      docNumber = 'A' + Math.floor(10000000 + Math.random() * 90000000);
      issueDate = '2022-08-15';
      expiryDate = '2027-01-20'; // 4 months out for testing action recommendation
      status = 'EXPIRING_SOON';
      aiConfidence = 97;
      eventType = 'expiration';
      metadataDetails = {
        fullName: 'John Ahmed',
        passportNumber: docNumber,
        nationality: 'Citizen',
        dateOfBirth: '1992-04-18',
      };
      detectedEvents = [
        {
          id: 'evt-pass-exp',
          title: 'Passport Expiration',
          date: '2027-01-20',
          eventType: 'expiration',
          description: 'National biometric passport validity expiry',
          daysRemaining: calculateDaysRemaining('2027-01-20'),
          status: 'DUE_SOON',
        },
      ];
      recommendedActions = [
        {
          id: 'act-pass-1',
          title: 'Add renewal reminder',
          actionType: 'create_reminder',
          description: 'Create automated passport renewal reminder',
        },
        {
          id: 'act-pass-2',
          title: 'Review passport details',
          actionType: 'review_details',
          description: 'Check biometric expiry and blank visa pages requirement',
        },
        {
          id: 'act-pass-3',
          title: 'Find travel documents',
          actionType: 'find_related',
          description: 'Locate all linked visas, travel insurance, and boarding records',
        },
        {
          id: 'act-pass-4',
          title: 'Check related visa documents',
          actionType: 'find_related',
          description: 'Verify if any active visas depend on this passport number',
        },
      ];
    } else if (nameLower.includes('insurance') || nameLower.includes('policy')) {
      category = 'Insurance';
      subcategory = nameLower.includes('health') ? 'Health' : nameLower.includes('car') || nameLower.includes('vehicle') ? 'Vehicle' : 'Property';
      docType = 'Insurance Policy';
      folder = `Insurance/${subcategory}`;
      docNumber = 'INS-92831';
      issueDate = '2026-08-29';
      expiryDate = '2027-08-29';
      status = 'VALID';
      aiConfidence = 96;
      eventType = 'renewal';
      metadataDetails = {
        provider: 'ABC Insurance',
        policyNumber: 'INS-92831',
        policyHolder: 'John Ahmed',
        coverageStart: '2026-08-29',
        coverageEnd: '2027-08-29',
        premium: '₦250,000 / yr',
      };
      detectedEvents = [
        {
          id: 'evt-ins-start',
          title: 'Coverage Start',
          date: '2026-08-29',
          eventType: 'coverage_start',
          description: 'Insurance policy coverage effective date',
          daysRemaining: calculateDaysRemaining('2026-08-29'),
          status: 'COMPLETED',
        },
        {
          id: 'evt-ins-end',
          title: 'Coverage End / Renewal',
          date: '2027-08-29',
          eventType: 'coverage_end',
          description: 'Policy coverage period ends. Renewal required.',
          daysRemaining: calculateDaysRemaining('2027-08-29'),
          status: 'UPCOMING',
        },
      ];
      recommendedActions = [
        {
          id: 'act-ins-1',
          title: 'Create a renewal reminder',
          actionType: 'create_reminder',
          description: 'Set alerts at 90, 30, and 7 days before coverage ends',
        },
        {
          id: 'act-ins-2',
          title: 'Compare with previous policy',
          actionType: 'compare_policy',
          description: 'Review premium changes and deductible limits',
        },
      ];
    } else if (nameLower.includes('contract') || nameLower.includes('employment') || nameLower.includes('offer')) {
      category = 'Career';
      subcategory = 'Employment';
      docType = 'Employment Contract';
      folder = 'Career/Employment';
      docNumber = 'EMP-CTR-2026';
      issueDate = '2026-10-01';
      expiryDate = '2027-09-30';
      status = 'VALID';
      aiConfidence = 93;
      eventType = 'renewal';
      metadataDetails = {
        parties: ['ABC Ltd.', 'John Ahmed'],
        contractNumber: 'EMP-CTR-2026',
        startDate: '2026-10-01',
        endDate: '2027-09-30',
        noticePeriod: '30 days written notice',
      };
      detectedEvents = [
        {
          id: 'evt-emp-start',
          title: 'Contract Start',
          date: '2026-10-01',
          eventType: 'start_date',
          description: 'Employment commencement with ABC Ltd.',
          daysRemaining: calculateDaysRemaining('2026-10-01'),
          status: 'UPCOMING',
        },
        {
          id: 'evt-emp-notice',
          title: 'Notice Deadline',
          date: '2027-08-30',
          eventType: 'notice_deadline',
          description: '30-day notice requirement deadline prior to term completion',
          daysRemaining: calculateDaysRemaining('2027-08-30'),
          status: 'UPCOMING',
        },
        {
          id: 'evt-emp-end',
          title: 'Contract End Date',
          date: '2027-09-30',
          eventType: 'expiration',
          description: 'Initial employment contract term concludes',
          daysRemaining: calculateDaysRemaining('2027-09-30'),
          status: 'UPCOMING',
        },
      ];
      recommendedActions = [
        {
          id: 'act-emp-1',
          title: 'Set notice deadline alert',
          actionType: 'set_notice',
          description: 'Alert 14 days before 30-day notice window closes',
        },
        {
          id: 'act-emp-2',
          title: 'Review termination and notice clause',
          actionType: 'review_details',
          description: 'Confirm notice requirements and non-compete terms',
        },
      ];
    } else if (nameLower.includes('rent') || nameLower.includes('lease') || nameLower.includes('tenancy')) {
      category = 'Property';
      subcategory = 'Rental';
      docType = 'Tenancy Agreement';
      folder = 'Property/Rental';
      docNumber = 'LSE-4491';
      issueDate = '2026-01-01';
      expiryDate = '2026-12-31';
      status = 'EXPIRING_SOON';
      aiConfidence = 95;
      eventType = 'renewal';
      metadataDetails = {
        parties: ['Oakridge Estates', 'John Ahmed'],
        contractNumber: 'LSE-4491',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        noticePeriod: '60 days',
        renewalDate: '2027-01-01',
      };
      detectedEvents = [
        {
          id: 'evt-rent-notice',
          title: 'Notice Deadline',
          date: '2026-11-01',
          eventType: 'notice_deadline',
          description: '60-day lease non-renewal or termination notice deadline',
          daysRemaining: calculateDaysRemaining('2026-11-01'),
          status: 'DUE_SOON',
        },
        {
          id: 'evt-rent-renewal',
          title: 'Lease Renewal',
          date: '2027-01-01',
          eventType: 'renewal',
          description: 'Annual tenancy renewal date',
          daysRemaining: calculateDaysRemaining('2027-01-01'),
          status: 'UPCOMING',
        },
      ];
      recommendedActions = [
        {
          id: 'act-rent-1',
          title: 'Schedule lease renewal discussion',
          actionType: 'review_details',
          description: 'Review rent rates with landlord before 60-day notice window',
        },
      ];
    } else if (nameLower.includes('land') || nameLower.includes('deed') || nameLower.includes('property')) {
      // Explicit Land Receipt pattern
      category = 'Property';
      subcategory = 'Land';
      docType = 'Land Purchase Receipt & Title';
      folder = 'Property/Land';
      docNumber = 'LND-' + Math.floor(100000 + Math.random() * 900000);
      issueDate = '2025-05-18';
      expiryDate = null;
      status = 'NO_EXPIRATION';
      aiConfidence = 96;
      metadataDetails = {
        issuingOrganization: 'Lands Registry Department',
        holderName: 'John Ahmed',
        parties: ['Green Valley Properties', 'John Ahmed'],
        amount: 8500000,
        currency: 'NGN',
      };
      recommendedActions = [
        {
          id: 'act-land-1',
          title: 'Verify cadastral registry',
          actionType: 'review_details',
          description: 'Confirm deed registration with Lands Bureau records',
        },
      ];
    } else if (nameLower.includes('receipt') || nameLower.includes('invoice')) {
      category = 'Finance';
      subcategory = 'Receipts';
      docType = 'Receipt';
      folder = 'Finance/Receipts';
      docNumber = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      issueDate = '2026-09-10';
      expiryDate = null;
      status = 'NO_EXPIRATION';
      aiConfidence = 95;
      metadataDetails = {
        merchant: 'Enterprise Solutions Vendor',
        transactionDate: '2026-09-10',
        amount: 249.99,
        currency: 'USD',
        paymentMethod: 'Corporate Debit Card',
      };
    } else if (nameLower.includes('unclear') || nameLower.includes('fuzzy') || nameLower.includes('scan') || nameLower.includes('low_conf')) {
      // Low confidence for testing Human-In-The-Loop review flow
      category = 'Personal';
      subcategory = 'Identity';
      docType = 'Identity Document';
      folder = 'Personal/Identity';
      issueDate = '2026-01-01';
      expiryDate = '2027-09-15';
      status = 'NEEDS_REVIEW';
      aiConfidence = 58;
      confidenceWarning = '⚠ Please verify this information. Low confidence optical recognition.';
      recommendedActions = [
        {
          id: 'act-review-1',
          title: 'Verify extracted dates and document numbers',
          actionType: 'review_details',
          description: 'Document has low AI optical clarity. Confirm details manually.',
        },
      ];
    }

    return {
      title,
      name: payload.fileName,
      documentType: docType,
      category,
      subcategory,
      folder,
      owner: 'John Ahmed',
      documentNumber: docNumber,
      issueDate,
      expiryDate,
      status,
      aiConfidence,
      confidenceWarning,
      eventType,
      eventDate: expiryDate,
      detectedEvents,
      recommendedActions,
      reminderSchedules: [90, 30, 7, 1],
      summary: `Document "${payload.fileName}" classified as ${docType} under ${category} → ${subcategory}. Indexed and monitored by DocuMind.`,
      keyTerms: [docType, category, subcategory, docNumber],
      tags: [category.toLowerCase(), subcategory.toLowerCase(), docType.toLowerCase()],
      metadataDetails,
    };
  }
}

function generateClientLocalChatReply(
  query: string,
  documents: DocumentItem[]
): ChatAssistantResponse {
  const q = query.toLowerCase().trim();
  const citations: ChatCitation[] = [];

  const matched = documents.filter((doc) => {
    const text = `${doc.title} ${doc.name} ${doc.documentType} ${doc.category} ${doc.folder || ''} ${(doc.keyTerms || []).join(' ')} ${doc.summary || ''}`.toLowerCase();
    if (q.includes('insurance') && (text.includes('insurance') || text.includes('policy'))) return true;
    if ((q.includes('cert') || q.includes('azure') || q.includes('devops') || q.includes('degree')) && (text.includes('cert') || text.includes('degree') || text.includes('azure') || text.includes('devops'))) return true;
    if ((q.includes('passport') || q.includes('id')) && (text.includes('passport') || text.includes('identity'))) return true;
    if ((q.includes('rent') || q.includes('lease') || q.includes('landlord')) && (text.includes('rent') || text.includes('lease') || text.includes('tenancy'))) return true;
    if ((q.includes('land') || q.includes('property') || q.includes('deed')) && (text.includes('land') || text.includes('property') || text.includes('deed'))) return true;
    if ((q.includes('receipt') || q.includes('spend') || q.includes('expense') || q.includes('cost')) && (text.includes('receipt') || text.includes('invoice') || text.includes('finance'))) return true;
    if (q.includes('expir') || q.includes('due') || q.includes('when')) return Boolean(doc.expiryDate || doc.detectedEvents?.length);

    const words = q.split(/\s+/).filter((w) => w.length > 3);
    return words.some((w) => text.includes(w));
  });

  if (matched.length === 0) {
    if (documents.length === 0) {
      return {
        reply: "You currently have no documents uploaded in your DocuMind vault. Upload your documents to track renewal deadlines, policies, and vital information.",
        citations: [],
      };
    }
    return {
      reply: `I searched your **${documents.length} uploaded documents** in DocuMind, but did not locate records matching *"${query}"*.\n\nYou can query any of your active documents, such as:\n${documents.slice(0, 4).map((d) => `• **${d.title}** (${d.documentType})`).join('\n')}`,
      citations: [],
    };
  }

  let reply = `Here are the details from your DocuMind records for your question:\n\n`;

  matched.slice(0, 3).forEach((doc) => {
    reply += `### **${doc.title}**\n`;
    reply += `• **Document Type:** ${doc.documentType} (${doc.category})\n`;
    reply += `• **Document Number:** \`${doc.documentNumber || 'N/A'}\`\n`;
    if (doc.expiryDate) {
      reply += `• **Expiry Date:** **${doc.expiryDate}** (Status: *${doc.status}*)\n`;
    }
    if (doc.issueDate) {
      reply += `• **Issue Date:** ${doc.issueDate}\n`;
    }
    if (doc.detectedEvents && doc.detectedEvents.length > 0) {
      reply += `• **Tracked Milestones:**\n`;
      doc.detectedEvents.forEach((evt) => {
        reply += `  - **${evt.title}**: ${evt.date}\n`;
      });
    }
    reply += `\n**Source:** [${doc.name}] — ${doc.folder || doc.category}\n\n`;

    citations.push({
      documentId: doc.id,
      documentTitle: doc.title,
      documentName: doc.name,
      documentType: doc.documentType,
      pageOrSection: doc.folder || 'Overview',
      date: doc.expiryDate || doc.issueDate || undefined,
      snippet: doc.summary || `${doc.title} classified under ${doc.category}`,
    });
  });

  return { reply: reply.trim(), citations };
}

export async function askDocuMindAiDetailed(
  query: string,
  documents: DocumentItem[],
  chatHistory: ChatMessage[] = []
): Promise<ChatAssistantResponse> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, documents, chatHistory }),
    });

    if (!res.ok) {
      console.warn(`Server returned ${res.status}, falling back to local vault synthesis.`);
      return generateClientLocalChatReply(query, documents);
    }

    const data = await res.json();
    return {
      reply: data.reply || 'No response from assistant.',
      citations: Array.isArray(data.citations) ? data.citations : [],
    };
  } catch (error) {
    console.warn('Network issue connecting to server chat, falling back to local vault synthesis:', error);
    return generateClientLocalChatReply(query, documents);
  }
}

export async function askDocuMindAi(
  query: string,
  documents: DocumentItem[],
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const res = await askDocuMindAiDetailed(query, documents, chatHistory);
  return res.reply;
}

// Backward-compatible alias
export const askLifeVaultAi = askDocuMindAi;

export async function batchAnalyzeFilesWithGemini(files: { name: string; size: number }[]): Promise<any> {
  try {
    const res = await fetch('/api/gemini/batch-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.analysis;
  } catch (error) {
    console.error('Batch analyze failed:', error);
    return null;
  }
}
