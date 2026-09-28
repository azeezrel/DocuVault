# DocuMind — Intelligent Personal Document Workspace & Life Administration Vault

**DocuMind** is a full-stack personal digital document workspace and intelligent life administration command center. It enables individuals and administrators to securely ingest, classify, extract structured metadata from, search, and monitor important life documents—ranging from passports, national IDs, and professional certifications to insurance policies, tenancy agreements, tax filings, and financial receipts.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features & Capabilities](#2-key-features--capabilities)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Project Directory & Codebase Structure](#5-project-directory--codebase-structure)
6. [Core Modules & State Management](#6-core-modules--state-management)
7. [Document Ingestion & Extraction Pipeline](#7-document-ingestion--extraction-pipeline)
8. [Role-Based Access Control (RBAC) & Admin Console](#8-role-based-access-control-rbac--admin-console)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Core Data Models (`src/types.ts`)](#10-core-data-models-srctypests)
11. [Getting Started & Local Development](#11-getting-started--local-development)

---

## 1. Project Overview

Important personal documents are often scattered across email attachments, cloud drives, and physical folders—leading to missed renewal deadlines, expired credentials, overlooked contract notice periods, and time wasted searching for critical records.

**DocuMind** solves this by transforming static files (PDFs, scanned images, receipts, and text documents) into **structured, searchable, and self-monitoring records**:
- **Automated Classification & Extraction**: Extracts document numbers, issue/expiration dates, issuing organizations, contract clauses, coverage limits, and financial totals upon upload.
- **Proactive Deadline & Renewal Tracking**: Calculates exact days remaining for every document milestone and triggers multi-stage reminders (`90`, `30`, `7`, and `1` day intervals).
- **Vault Health & Compliance Scoring**: Continuously audits the document library for expired records, upcoming expirations, missing critical dates, and low-confidence fields requiring human review.
- **Grounded Document Q&A**: Allows users to query their vault in natural language and receive answers with clickable citations linked directly to the source documents.

---

## 2. Key Features & Capabilities

### Smart Document Vault & Categorization
- **11 Core Life Categories**: `Personal`, `Education`, `Career`, `Finance`, `Insurance`, `Property`, `Vehicles`, `Family`, `Legal`, `Work`, and `Health`.
- **Hierarchical Folder Tree**: Automatic routing into structured subfolders (e.g., `Personal/Identity`, `Career/Certifications`, `Insurance/Health`, `Property/Tenancy`).
- **Specialized Domain Views**:
  - **Certifications View**: Tracks professional credentials, issuing bodies, credential IDs, and renewal timelines.
  - **Contracts & Agreements View**: Monitors tenancy leases, employment contracts, notice periods, parties, and contract values.
  - **Receipts & Expenses View**: Aggregates financial receipts, merchants, currencies, payment methods, and expense categories.
- **Duplicate Detection Engine**: Prevents vault clutter by computing both exact content hashes and semantic similarity scores (`0–100%`) against existing documents before ingestion.
- **Human-in-the-Loop Verification**: Flags extractions with confidence below `70%` (`NEEDS_REVIEW`) so users can inspect, edit, and verify metadata in side-by-side detail modals.

### Deadlines, Calendar & Reminder Engine
- **Multi-Date Event Extraction**: Detects multiple lifecycle events from a single document (`expiration`, `renewal`, `notice_deadline`, `payment_due`, `filing_deadline`, `coverage_start`, `coverage_end`).
- **Automated Countdown Calculation**: Deterministically computes `daysRemaining` (`UPCOMING`, `DUE_SOON`, `OVERDUE`, `COMPLETED`) relative to the current date.
- **Interactive Important Dates & Calendar View**: Visualizes monthly and chronological timelines across all personal and custom deadlines.

### Vault Health Score & Security
- **Real-Time Vault Health Score (`0–100%`)**: Evaluates overall document readiness and highlights actionable health flags (Expired, Expiring within 90 days, Missing Critical Dates, Review Required).
- **Temporary Secure Sharing**: Generates time-bound, revocable sharing links with optional access restrictions via the `ShareModal`.
- **Recycle Bin & Soft Deletion**: Safely archives deleted documents with one-click restoration or permanent purge.

### Conversational Document Assistant & Global Search
- **Natural Language Q&A (`/assistant` & Floating Ask AI)**: Answers questions about the user's uploaded documents (e.g., *"When does my passport expire?"*, *"What is the notice period on my lease?"*) with structured source citations.
- **Global Command Search (`⌘K` / `Ctrl+K`)**: Instant keyboard-accessible search bar across document titles, numbers, tags, key terms, and extracted summaries.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** | Component architecture, hooks, and strict static typing |
| **Styling & UI** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Utility-first responsive layout, clean white-and-blue design system |
| **Icons & Animation** | **Lucide React** + **Motion** | Crisp iconography and smooth UI transitions |
| **Backend Runtime** | **Node.js** + **Express 4** (`server.ts`) | API gateway, document analysis routes, and RBAC middleware |
| **AI & Extraction SDK** | **`@google/genai`** | Multimodal OCR, structured JSON metadata extraction, and grounded Q&A |
| **Build & Bundling** | **Vite 8** + **esbuild** + **tsx** | Fast development server and production Node/SPA bundling |

---

## 4. System Architecture

DocuMind uses a unified full-stack TypeScript architecture served on **Port 3000**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        Client SPA (React 19 + Vite)                     │
│                                                                         │
│  ┌──────────────────────┐   ┌──────────────────────┐   ┌─────────────┐  │
│  │     AuthContext      │   │     VaultContext     │   │ URL Router  │  │
│  │ (Session, 2FA, RBAC) │   │ (Docs, Health, Chat) │   │ (History)   │  │
│  └──────────┬───────────┘   └──────────┬───────────┘   └──────┬──────┘  │
│             │                          │                      │         │
│             ▼                          ▼                      ▼         │
│  ┌────────────────────────────────────┐  ┌───────────────────────────┐  │
│  │   Personal Vault Workspace Views   │  │ Admin Console (/admin)    │  │
│  │ (Dashboard, Docs, Dates, Health,   │  │ (RBAC Protected: Users,   │  │
│  │  Contracts, Receipts, Assistant)   │  │  Processing, Audit, etc.) │  │
│  └──────────────────┬─────────────────┘  └─────────────┬─────────────┘  │
└─────────────────────┼──────────────────────────────────┼────────────────┘
                      │ REST JSON (/api/*)               │
                      ▼                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Express.js Backend Server (server.ts)                │
│                                                                         │
│  • POST /api/gemini/analyze       (Multimodal OCR & JSON Extraction)    │
│  • POST /api/gemini/chat          (Grounded Vault Q&A + Citations)      │
│  • POST /api/gemini/batch-analyze (Batch File Categorization)           │
│  • GET/POST /api/admin/*          (RBAC Protected Admin Endpoints)      │
│  • Resilient Multi-Model Retry + Deterministic Rule Extraction Fallback │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Project Directory & Codebase Structure

```text
/
├── index.html                        # HTML entry point & SEO metadata
├── metadata.json                     # Application metadata & capability declarations
├── package.json                      # Dependencies and build/dev scripts
├── server.ts                         # Express backend server, AI routes, fallback engine, RBAC API
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite bundler configuration
└── src/
    ├── main.tsx                      # React DOM root mount
    ├── App.tsx                       # Root router, keyboard shortcuts (⌘K), auth & admin guards
    ├── index.css                     # Global Tailwind CSS v4 imports and custom utility styles
    ├── types.ts                      # Comprehensive TypeScript interfaces for Vault, Auth, and Admin
    ├── context/
    │   ├── AuthContext.tsx           # Authentication state, user registry, 2FA, and role switching
    │   └── VaultContext.tsx          # Core document store, health calculations, deadlines, and AI chat
    ├── services/
    │   └── geminiService.ts          # Client service layer communicating with /api/gemini/* endpoints
    ├── data/
    │   └── mockDocuments.ts          # Folder taxonomy definitions & initial seed templates
    └── components/
        ├── Navbar.tsx                # Top command bar with global search, notifications & user menu
        ├── Sidebar.tsx               # Navigation sidebar for the Personal Vault workspace
        ├── DashboardView.tsx         # Primary user command center with health score & urgent deadlines
        ├── DocumentsView.tsx         # Filterable, sortable document grid/list with category folders
        ├── DocumentModal.tsx         # Detailed document inspector, inline metadata editor & actions
        ├── UploadModal.tsx           # Drag-and-drop uploader with duplicate check & live AI extraction
        ├── ShareModal.tsx            # Secure expiring link generator for individual documents
        ├── DocumentHealthView.tsx    # Compliance audit view for expired, expiring & incomplete docs
        ├── ImportantDatesView.tsx    # Chronological & calendar view of all life deadlines
        ├── CalendarView.tsx          # Interactive monthly calendar component
        ├── RemindersView.tsx         # Configurable notification schedules (90, 30, 7, 1 days)
        ├── CertificationsView.tsx    # Specialized tracker for professional certificates & licenses
        ├── ContractsView.tsx         # Specialized tracker for agreements, leases & notice periods
        ├── ReceiptsView.tsx          # Specialized tracker for financial receipts & expenses
        ├── FavoritesView.tsx         # Starred priority documents view
        ├── RecentView.tsx            # Recently uploaded and inspected documents
        ├── RecycleBinView.tsx        # Soft-deleted documents with restore and permanent delete
        ├── AiAssistantView.tsx       # Full-screen conversational Q&A assistant with citations
        ├── FloatingAskAi.tsx         # Persistent quick-access Q&A drawer across all vault views
        ├── SecurityView.tsx          # Encryption status, session integrity & access controls
        ├── SettingsView.tsx          # User profile, notification preferences & vault management
        ├── SplashScreen.tsx          # Initial session verification splash screen
        ├── auth/                     # Authentication & Onboarding Flows
        │   ├── WelcomeScreen.tsx     # Landing screen with User vs. Admin portal entry points
        │   ├── SignInPage.tsx        # Standard user login
        │   ├── SignUpPage.tsx        # New user registration
        │   ├── AdminSignInPage.tsx   # Dedicated Administrator authentication portal
        │   ├── EmailVerificationPage.tsx # OTP email verification step
        │   ├── TwoFactorPage.tsx     # Multi-factor authentication challenge screen
        │   └── ForgotPasswordPage.tsx# Password reset workflow
        └── admin/                    # Role-Protected Admin Console (/admin)
            ├── AdminLayout.tsx       # Main shell & state coordinator for the Admin Console
            ├── AdminHeader.tsx       # Admin top navigation bar with live sync & role indicator
            ├── AdminSidebar.tsx      # 10-tab operational navigation sidebar
            ├── AdminAccessDenied.tsx # 403 Zero-Trust screen shown to non-admin users visiting /admin
            ├── adminData.ts          # Initial audit log entries and service definitions
            └── views/
                ├── AdminDashboardView.tsx     # Vault health summary & real-time ingestion queue
                ├── AdminUsersView.tsx         # User directory, role assignment & status suspension
                ├── AdminProcessingView.tsx    # Ingestion pipeline queue & job retry controls
                ├── AdminAiOpsView.tsx         # Extraction confidence & latency metrics
                ├── AdminHealthView.tsx        # Platform-wide document compliance & missing date audit
                ├── AdminStorageView.tsx       # Storage utilization by category and user quotas
                ├── AdminNotificationsView.tsx # Scheduled reminder dispatch queue
                ├── AdminAuditLogsView.tsx     # Immutable security & administrative event log
                ├── AdminConfigView.tsx        # Platform thresholds, quotas & feature toggles
                └── AdminMonitoringView.tsx    # System uptime and service health matrix
```

---

## 6. Core Modules & State Management

### 1. `AuthContext.tsx` (`src/context/AuthContext.tsx`)
Manages the complete authentication lifecycle and user role enforcement:
- **Multi-Stage Auth Flow**: Supports `welcome`, `signin`, `signup`, `admin-signin`, `verify-email`, `2fa`, and `forgot-password` screens.
- **Persistent User Registry**: Stores registered accounts and session state in `localStorage` (`lifevault_auth_prod_v1` and `lifevault_registered_users_prod_v1`) so user accounts and role assignments persist across browser refreshes.
- **Role Segregation**: Distinguishes between standard vault owners (`role: 'user'`) and platform administrators (`role: 'admin'`).

### 2. `VaultContext.tsx` (`src/context/VaultContext.tsx`)
Acts as the central intelligence engine for the user's document workspace:
- **Document Lifecycle Operations**: `addDocument`, `updateDocument`, `deleteDocument` (soft delete to Recycle Bin), `restoreDocument`, `permanentlyDeleteDocument`, and `toggleFavorite`.
- **Dynamic Vault Health Calculation**: Computes `vaultHealth` (`score`, `statusLabel`) and `attentionCounts` (`expired`, `expiring`, `missingDates`, `review`) in real time whenever documents change.
- **Automated Deadline Aggregation**: Synthesizes both document-level `expiryDate` fields and nested `detectedEvents` arrays into a unified, sorted `deadlines` list with exact `daysLeft` calculations.
- **Duplicate Detection (`checkDuplicate`)**: Evaluates incoming uploads against existing documents using content hash comparison and title/number/type similarity scoring.

---

## 7. Document Ingestion & Extraction Pipeline

When a user uploads a file via `UploadModal.tsx`, DocuMind executes a multi-stage pipeline:

1. **Client Pre-Processing & Duplicate Check**:
   - Reads the file as Base64/text and computes a deterministic content fingerprint.
   - Runs `checkDuplicate()` to warn the user if an identical or semantically similar document already exists in the vault.
2. **Multimodal AI Analysis (`POST /api/gemini/analyze`)**:
   - Sends the file name, MIME type, extracted text, and inline Base64 payload (for PDFs and images) to the backend.
   - Extracts structured JSON containing `title`, `documentType`, `category`, `subcategory`, `folder`, `owner`, `documentNumber`, `issueDate`, `expiryDate`, `status`, `aiConfidence`, `detectedEvents`, `recommendedActions`, `metadataDetails`, `financials`, and `contractDetails`.
3. **Resilient Fallback Engine (`extractDeterministicMetadata` in `server.ts`)**:
   - If the external AI API experiences rate limits (`429`) or temporary unavailability (`503`), `generateContentWithRetry()` automatically retries with exponential backoff across fallback models.
   - If all remote calls fail, the server seamlessly falls back to `extractDeterministicMetadata()`, a deterministic rule-based parser that classifies and extracts structured fields from the document so uploads never fail.
4. **Human-in-the-Loop Review**:
   - Users can inspect the extracted fields in `DocumentModal.tsx`, edit any metadata inline, execute recommended actions (such as creating a renewal reminder), and mark the document as human-verified (`verifiedByHuman: true`).

---

## 8. Role-Based Access Control (RBAC) & Admin Console

DocuMind enforces strict separation between the **Personal Vault** and the **Admin Operations Console (`/admin`)**:
- **Automatic Admin Routing**: When a user authenticates with an `admin` role (via `AdminSignInPage`), `App.tsx` automatically routes them to `/admin`.
- **Zero-Trust Route Guard**: If a standard user (`role: 'user'`) attempts to navigate to `/admin`, `App.tsx` blocks access and renders `AdminAccessDenied.tsx`.
- **Real-Time Derived Admin State**: All metrics in `AdminLayout.tsx` (registered users, document counts, storage utilization, processing jobs, active reminders, and document health issues) are dynamically derived from the live application state rather than hardcoded placeholders.

---

## 9. API Endpoints Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/gemini/analyze` | Authenticated | Analyzes an uploaded document (PDF/Image/Text) and returns structured metadata, lifecycle events, and confidence scores. |
| `POST` | `/api/gemini/chat` | Authenticated | Answers natural language questions grounded in the user's uploaded document library and returns structured source citations. |
| `POST` | `/api/gemini/batch-analyze` | Authenticated | Groups multiple uploaded files into recommended life categories and folder paths. |
| `GET` | `/api/admin/system-health` | Admin (`x-user-role: admin`) | Returns backend runtime health and service status. |
| `GET` | `/api/admin/metrics` | Admin (`x-user-role: admin`) | Returns platform-level operational metrics. |
| `POST` | `/api/admin/retry-job` | Admin (`x-user-role: admin`) | Requeues a document ingestion job into the extraction pipeline. |

---

## 10. Core Data Models (`src/types.ts`)

### `DocumentItem`
Represents a single document stored in the vault:
- **Identity & Classification**: `id`, `title`, `name`, `documentType`, `category`, `subcategory`, `folder`, `owner`, `documentNumber`
- **Lifecycle Dates & Status**: `issueDate`, `expiryDate`, `status` (`VALID` | `EXPIRING_SOON` | `EXPIRED` | `NO_EXPIRATION` | `NEEDS_REVIEW`)
- **AI & Verification**: `aiConfidence` (`0–100`), `confidenceWarning`, `processingStatus`, `verifiedByHuman`, `contentHash`
- **Events & Reminders**: `detectedEvents` (`DocumentDetectedEvent[]`), `recommendedActions` (`DocumentRecommendedAction[]`), `reminderSchedules` (`[90, 30, 7, 1]`)
- **Domain-Specific Metadata**: `metadataDetails` (`SpecializedMetadata`), `financials` (`DocumentFinancials`), `contractDetails` (`ContractDetails`)

---

## 11. Getting Started & Local Development

### Prerequisites
- **Node.js** `v20+` (or **Bun**)
- **npm**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your API key:
```bash
cp .env.example .env
```
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Run the Development Server
Starts the Express backend and Vite frontend middleware on `http://localhost:3000`:
```bash
npm run dev
```

### 4. Type-Check & Lint
```bash
npm run lint
```

### 5. Build & Start for Production
Compiles the React SPA into `dist/` and bundles `server.ts` into `dist/server.cjs`:
```bash
npm run build
npm start
```
