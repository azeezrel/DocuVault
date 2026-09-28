export type DocumentCategory =
  | 'Personal'
  | 'Education'
  | 'Career'
  | 'Finance'
  | 'Insurance'
  | 'Property'
  | 'Vehicles'
  | 'Family'
  | 'Legal'
  | 'Work'
  | 'Health';

export type DocumentStatus =
  | 'VALID'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'NO_EXPIRATION'
  | 'NEEDS_REVIEW';

export type DocumentEventType =
  | 'expiration'
  | 'renewal'
  | 'payment_due'
  | 'notice_deadline'
  | 'filing_deadline'
  | 'review_date'
  | 'coverage_start'
  | 'coverage_end'
  | 'start_date';

export interface DocumentDetectedEvent {
  id: string;
  title: string; // e.g. "Coverage Start", "Coverage End", "Notice Deadline", "Renewal Date", "Payment Due", "Expiration"
  date: string; // YYYY-MM-DD
  eventType: DocumentEventType;
  description?: string;
  daysRemaining?: number; // deterministically calculated: Math.ceil((date - now) / 86400000)
  status?: 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';
}

export interface DocumentRecommendedAction {
  id: string;
  title: string;
  actionType: 'create_reminder' | 'review_details' | 'find_related' | 'compare_policy' | 'set_notice';
  description: string;
  executed?: boolean;
  eventDate?: string;
}

export interface DuplicateWarning {
  existingDoc: DocumentItem;
  matchType: 'exact_hash' | 'semantic_similarity';
  similarityScore: number; // 0-100
  reason: string;
}

export interface SpecializedMetadata {
  // Certificate
  issuingOrganization?: string | null;
  holderName?: string | null;
  certificateId?: string | null;

  // Passport / National ID
  fullName?: string | null;
  passportNumber?: string | null;
  nationality?: string | null;
  dateOfBirth?: string | null;

  // Insurance Policy
  provider?: string | null;
  policyNumber?: string | null;
  policyHolder?: string | null;
  coverageStart?: string | null;
  coverageEnd?: string | null;
  premium?: string | number | null;

  // Contract / Agreement
  parties?: string[] | null;
  contractNumber?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  renewalDate?: string | null;
  noticePeriod?: string | null;
  contractValue?: string | number | null;

  // Receipt / Financial Transaction
  merchant?: string | null;
  transactionDate?: string | null;
  amount?: number | null;
  currency?: string | null;
  paymentMethod?: string | null;
  expenseCategory?: string | null;

  // Tax / Government Records
  taxYear?: string | null;
  filingDeadline?: string | null;
  taxpayerId?: string | null;
}

export interface DocumentFinancials {
  merchant?: string | null;
  amount?: number | null;
  currency?: string | null;
  paymentMethod?: string | null;
  expenseCategory?: string | null;
}

export interface ContractDetails {
  agreementType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  noticePeriod?: string | null;
  parties?: string[] | null;
  keyClauses?: string[] | null;
  rentAmount?: string | null;
}

export interface DocumentTimelineEvent {
  year: string;
  date?: string;
  title: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  userId?: string;
  title: string;
  name: string; // file name
  documentType: string; // e.g. Professional Certificate, Passport, Tenancy Agreement
  category: DocumentCategory;
  subcategory?: string;
  folder: string; // e.g. "Career/Certifications", "Personal/Identity"
  owner: string;
  documentNumber: string;
  issueDate?: string | null;
  expiryDate?: string | null;
  status: DocumentStatus;
  aiConfidence?: number; // 0 to 100 percentage
  confidenceWarning?: string | null;
  processingStatus?: 'uploaded' | 'analyzing' | 'review_required' | 'ready';
  summary: string;
  keyTerms: string[];
  tags: string[];
  fileSize?: string;
  fileType?: string;
  uploadedAt: string;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  fileDataUrl?: string;

  // Event & Reminders Engine
  eventType?: DocumentEventType;
  eventDate?: string | null;
  reminderSchedules?: number[]; // e.g. [90, 30, 7, 1] days before
  reminderCreated?: boolean;
  detectedEvents?: DocumentDetectedEvent[];
  recommendedActions?: DocumentRecommendedAction[];

  // Document Platform Integrity & Human in the Loop
  contentHash?: string;
  version?: number;
  verifiedByHuman?: boolean;

  // Specialized details
  metadataDetails?: SpecializedMetadata;
  financials?: DocumentFinancials;
  contractDetails?: ContractDetails;
  timeline?: DocumentTimelineEvent[];
  healthFlags?: string[];
}

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  category: DocumentCategory;
  subfolders?: FolderNode[];
}

export interface ChatCitation {
  documentId: string;
  documentTitle: string;
  documentName?: string;
  documentType?: string;
  pageOrSection?: string;
  page?: string | number;
  date?: string;
  snippet?: string;
}

// Admin Portal Types
export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'processing'
  | 'ai-ops'
  | 'health'
  | 'storage'
  | 'notifications'
  | 'audit'
  | 'config'
  | 'monitoring';

export type UserRole = 'admin' | 'user' | 'support';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  storageUsedMb: number;
  storageQuotaMb: number;
  documentsCount: number;
  lastActive: string;
  joinedDate: string;
}

export type ProcessingStage = 'OCR' | 'AI Extraction' | 'Classification' | 'Embedding';
export type ProcessingStatus = 'complete' | 'processing' | 'review_required' | 'failed';

export interface ProcessingJob {
  id: string;
  documentName: string;
  documentId: string;
  userName: string;
  userEmail: string;
  stage: ProcessingStage;
  status: ProcessingStatus;
  latencySeconds: number;
  aiConfidence: number;
  error?: string;
  timestamp: string;
  retryCount: number;
}

export type AuditActionType =
  | 'Uploaded'
  | 'Deleted'
  | 'Updated Metadata'
  | 'Retried Job'
  | 'Changed Role'
  | 'AI Ingestion'
  | 'Login'
  | 'Password Reset'
  | 'Export'
  | 'Share Created';

export interface AuditLogEntry {
  id: string;
  user: string;
  userEmail: string;
  action: AuditActionType;
  resource: string;
  timestamp: string;
  ipAddress: string;
  severity: 'info' | 'warn' | 'error';
  details?: string;
}

export interface SystemHealthService {
  name: string;
  category: 'Infrastructure' | 'Data' | 'AI' | 'Messaging';
  status: 'healthy' | 'degraded' | 'down';
  metric: string;
  latency: string;
  uptime: string;
  lastChecked: string;
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  citations?: ChatCitation[];
}

export interface ShareLink {
  id: string;
  documentId: string;
  documentTitle: string;
  recipientEmail: string;
  permission: 'view' | 'download';
  expiresAt: string;
  createdAt: string;
  token?: string;
  viewCount?: number;
  active?: boolean;
  downloadAllowed?: boolean;
}

export interface LifeDeadline {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
  documentId?: string;
  documentTitle?: string;
  category: DocumentCategory | string;
  eventType?: DocumentEventType;
  urgency?: 'high' | 'medium' | 'low';
  priority?: 'high' | 'medium' | 'low';
  actionRequired?: string;
  reminderScheduleDays?: number[];
  eventId?: string;
}

export interface VaultHealthStatus {
  score: number;
  totalDocuments: number;
  expiredCount: number;
  expiringSoonCount: number;
  needsReviewCount: number;
  missingMetadataCount: number;
  possibleDuplicatesCount: number;
  uncategorizedCount: number;
  categorizationRate: number;
  upcomingRenewalsHandled: number;
  missingDatesCount: number;
  unreviewedCount: number;
  securityRating: 'A+' | 'A' | 'B' | 'C';
}
