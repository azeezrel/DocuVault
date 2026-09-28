import React, { useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VaultProvider, useVault } from './context/VaultContext';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { AdminSignInPage } from './components/auth/AdminSignInPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { EmailVerificationPage } from './components/auth/EmailVerificationPage';
import { TwoFactorPage } from './components/auth/TwoFactorPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DocumentsView } from './components/DocumentsView';
import { FavoritesView } from './components/FavoritesView';
import { RecentView } from './components/RecentView';
import { RemindersView } from './components/RemindersView';
import { ImportantDatesView } from './components/ImportantDatesView';
import { AiAssistantView } from './components/AiAssistantView';
import { RecycleBinView } from './components/RecycleBinView';
import { SettingsView } from './components/SettingsView';
import { DocumentHealthView } from './components/DocumentHealthView';
import { ReceiptsView } from './components/ReceiptsView';
import { ContractsView } from './components/ContractsView';
import { CertificationsView } from './components/CertificationsView';
import { SecurityView } from './components/SecurityView';
import { DocumentModal } from './components/DocumentModal';
import { UploadModal } from './components/UploadModal';
import { ShareModal } from './components/ShareModal';
import { FloatingAskAi } from './components/FloatingAskAi';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminAccessDenied } from './components/admin/AdminAccessDenied';

const AuthenticatedWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    activeView,
    setActiveView,
    selectedDocForView,
    setSelectedDocForView,
    isUploadModalOpen,
    setIsUploadModalOpen,
    docToShare,
    setDocToShare,
    isShareModalOpen,
    setIsShareModalOpen,
  } = useVault();

  // 1. URL Synchronization (Clean URLs without exposing /workspace/)
  const { documents } = useVault();

  // Route administrator directly to /admin upon login
  const lastAdminIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      if (lastAdminIdRef.current !== currentUser.id) {
        lastAdminIdRef.current = currentUser.id;
        setActiveView('admin');
        if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
          window.history.replaceState({ view: 'admin' }, '', '/admin');
        }
      }
    } else {
      lastAdminIdRef.current = null;
    }
  }, [currentUser, setActiveView]);

  useEffect(() => {
    const routeMap: Record<string, string> = {
      'home': '/home',
      'documents': '/documents',
      'favorites': '/favorites',
      'recent': '/recent',
      'reminders': '/reminders',
      'important-dates': '/dates',
      'calendar': '/dates',
      'ai-assistant': '/assistant',
      'recycle-bin': '/recycle-bin',
      'settings': '/settings',
      'health': '/health',
      'receipts': '/receipts',
      'contracts': '/contracts',
      'certifications': '/certifications',
      'security': '/security',
      'admin': '/admin',
    };

    if (selectedDocForView) {
      const targetPath = `/documents/${selectedDocForView.id}`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ docId: selectedDocForView.id }, '', targetPath);
      }
    } else {
      const targetPath = routeMap[activeView] || '/home';
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ view: activeView }, '', targetPath);
      }
    }
  }, [activeView, selectedDocForView]);

  // Deep-link check for /documents/:id or /admin on load
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/admin' || window.location.hash === '#admin') {
      setActiveView('admin');
      return;
    }

    if (path.startsWith('/documents/') && path.length > 11) {
      const docId = window.location.pathname.replace('/documents/', '');
      const found = documents.find((d) => d.id === docId);
      if (found) {
        setSelectedDocForView(found);
      }
    }
  }, [documents, setSelectedDocForView, setActiveView]);

  // Browser Back/Forward Popstate Handling
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin') setActiveView('admin');
      else if (path === '/home' || path === '/') setActiveView('home');
      else if (path.startsWith('/document')) setActiveView('documents');
      else if (path === '/favorites') setActiveView('favorites');
      else if (path === '/recent') setActiveView('recent');
      else if (path === '/reminders') setActiveView('reminders');
      else if (path === '/dates' || path === '/calendar') setActiveView('important-dates');
      else if (path === '/assistant') setActiveView('ai-assistant');
      else if (path === '/settings') setActiveView('settings');
      else if (path === '/health') setActiveView('health');
      else if (path === '/recycle-bin') setActiveView('recycle-bin');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveView]);

  // 2. Global Keyboard Shortcut ⌘ K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput =
          document.getElementById('dash-central-search-input') ||
          document.getElementById('global-ai-search-input');
        if (searchInput) {
          searchInput.focus();
        } else {
          setActiveView('ai-assistant');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveView]);

  // Render view depending on activeView state
  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <DashboardView />;
      case 'documents':
        return <DocumentsView />;
      case 'favorites':
        return <FavoritesView />;
      case 'recent':
        return <RecentView />;
      case 'reminders':
        return <RemindersView />;
      case 'important-dates':
      case 'dates':
      case 'calendar':
        return <ImportantDatesView />;
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'recycle-bin':
        return <RecycleBinView />;
      case 'settings':
        return <SettingsView />;
      case 'health':
        return <DocumentHealthView />;
      case 'receipts':
        return <ReceiptsView />;
      case 'contracts':
        return <ContractsView />;
      case 'certifications':
        return <CertificationsView />;
      case 'security':
        return <SecurityView />;
      default:
        return <DashboardView />;
    }
  };

  if (activeView === 'admin') {
    if (currentUser?.role === 'admin') {
      return <AdminLayout />;
    }
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-800 font-sans selection:bg-sky-200 selection:text-sky-900">
      {/* Top Command Center Navigation with permanent search box */}
      <Navbar />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Two-level Sidebar with exact 8 tabs + Settings / Profile */}
        <Sidebar />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {renderCurrentView()}
        </main>
      </div>

      {/* Document Detail Modal */}
      <DocumentModal
        document={selectedDocForView}
        onClose={() => setSelectedDocForView(null)}
      />

      {/* Smart Document Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Temporary Secure Sharing Modal */}
      <ShareModal
        document={docToShare}
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setDocToShare(null);
        }}
      />

      {/* Floating Ask AI Button (Bottom Far Right on all pages) */}
      <FloatingAskAi />
    </div>
  );
};

const AppRoot: React.FC = () => {
  const { isCheckingSession, sessionStatusMessage, isAuthenticated, authScreen, setAuthScreen } = useAuth();

  // Handle direct URL on unauthenticated load and sync clean URLs
  useEffect(() => {
    if (!isAuthenticated && !isCheckingSession) {
      const path = window.location.pathname.toLowerCase();
      if (path === '/sign-in' && authScreen !== 'signin') {
        setAuthScreen('signin');
      } else if (path === '/sign-up' && authScreen !== 'signup') {
        setAuthScreen('signup');
      } else if ((path === '/admin' || path === '/admin-signin') && authScreen !== 'admin-signin') {
        setAuthScreen('admin-signin');
      } else if (
        (path === '/welcome' || path === '/' || path === '/features' || path === '/landing') &&
        authScreen !== 'welcome' &&
        authScreen !== 'signin' &&
        authScreen !== 'signup' &&
        authScreen !== 'admin-signin'
      ) {
        setAuthScreen('welcome');
      }
    }
  }, [isAuthenticated, isCheckingSession]);

  // Sync clean URLs for unauthenticated visitors
  useEffect(() => {
    if (!isAuthenticated && !isCheckingSession) {
      const path = window.location.pathname.toLowerCase();
      if (authScreen === 'signin' && path !== '/sign-in') {
        window.history.pushState({ screen: 'signin' }, '', '/sign-in');
      } else if (authScreen === 'signup' && path !== '/sign-up') {
        window.history.pushState({ screen: 'signup' }, '', '/sign-up');
      } else if (authScreen === 'admin-signin' && path !== '/admin-signin' && path !== '/admin') {
        window.history.pushState({ screen: 'admin-signin' }, '', '/admin-signin');
      } else if (
        authScreen === 'welcome' &&
        path !== '/welcome' &&
        path !== '/'
      ) {
        window.history.pushState({ screen: 'welcome' }, '', '/welcome');
      }
    }
  }, [isAuthenticated, isCheckingSession, authScreen]);

  // Popstate navigation for unauthenticated screens
  useEffect(() => {
    if (!isAuthenticated && !isCheckingSession) {
      const handleUnauthPop = () => {
        const path = window.location.pathname.toLowerCase();
        if (path === '/sign-in') setAuthScreen('signin');
        else if (path === '/sign-up') setAuthScreen('signup');
        else if (path === '/admin' || path === '/admin-signin') setAuthScreen('admin-signin');
        else if (path === '/welcome' || path === '/' || path === '/features' || path === '/landing') setAuthScreen('welcome');
      };
      window.addEventListener('popstate', handleUnauthPop);
      return () => window.removeEventListener('popstate', handleUnauthPop);
    }
  }, [isAuthenticated, isCheckingSession, setAuthScreen]);

  // 1. Very first screen users see: Minimal Splash Screen (1.2s check)
  if (isCheckingSession) {
    return <SplashScreen statusMessage={sessionStatusMessage} />;
  }

  // 2. If not authenticated: render streamlined Welcome (non-bulky!) or specific Auth screen
  if (!isAuthenticated) {
    switch (authScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'signin':
        return <SignInPage />;
      case 'signup':
        return <SignUpPage />;
      case 'admin-signin':
        return <AdminSignInPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'verify-email':
        return <EmailVerificationPage />;
      case 'mfa':
        return <TwoFactorPage />;
      default:
        return <WelcomeScreen />;
    }
  }

  // 3. Returning or signed-in user: go directly to Home workspace (no landing page!)
  return <AuthenticatedWorkspace />;
};

export default function App() {
  return (
    <AuthProvider>
      <VaultProvider>
        <AppRoot />
      </VaultProvider>
    </AuthProvider>
  );
}
