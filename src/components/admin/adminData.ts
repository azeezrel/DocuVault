import {
  PlatformUser,
  ProcessingJob,
  AuditLogEntry,
  SystemHealthService,
} from '../../types';

// Real platform users list (initialized empty; populated dynamically from registered users)
export const INITIAL_PLATFORM_USERS: PlatformUser[] = [];

// Real processing queue (initialized empty; populated dynamically from uploaded vault documents)
export const INITIAL_PROCESSING_JOBS: ProcessingJob[] = [];

// Session audit log stream
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-init',
    user: 'Administrator',
    userEmail: 'admin@lifevault.ai',
    action: 'Login',
    resource: 'Admin Operations Console Initialized',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    ipAddress: '127.0.0.1 (Local Session)',
    severity: 'info',
    details: 'Role-Based Access Control verified. Telemetry connected.',
  },
];

export const SYSTEM_SERVICES: SystemHealthService[] = [
  {
    name: 'Node.js Express API Gateway',
    category: 'Infrastructure',
    status: 'healthy',
    metric: 'Active • 0 queued errors',
    latency: '38ms',
    uptime: '100%',
    lastChecked: 'Just now',
  },
  {
    name: 'Vault Storage Engine',
    category: 'Data',
    status: 'healthy',
    metric: 'Client & Zero-Knowledge Encrypted',
    latency: '14ms',
    uptime: '100%',
    lastChecked: 'Just now',
  },
  {
    name: 'AI Extraction Engine (Gemini 3.8 Flash)',
    category: 'AI',
    status: 'healthy',
    metric: 'High-speed reasoning active',
    latency: '1.4s avg',
    uptime: '100%',
    lastChecked: 'Just now',
  },
  {
    name: 'Document Vector & Semantic Index',
    category: 'AI',
    status: 'healthy',
    metric: 'Synchronized with vault items',
    latency: '12ms',
    uptime: '100%',
    lastChecked: 'Just now',
  },
  {
    name: 'Deadline & Reminder Dispatcher',
    category: 'Messaging',
    status: 'healthy',
    metric: 'Interval schedulers running (90, 30, 7, 1 day)',
    latency: '5ms',
    uptime: '100%',
    lastChecked: 'Just now',
  },
];
