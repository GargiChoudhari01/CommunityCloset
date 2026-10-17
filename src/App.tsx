import React, { useState, useEffect } from 'react';
import type { User, ResourceItem, BorrowRequest, NotificationItem, ChatMessage, Category, Complaint, Report, AdminStats } from './types';
import { storage } from './services/storage';
import { realtimeService } from './services/realtimeService';
import { mapAuthUser, signOut } from './services/auth';
import { isSupabaseConfigured, requireSupabase } from './services/supabase';
import { reportError } from './services/reportError';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Auth Page
import { LoginPage } from './pages/LoginPage';
import { PasswordResetPage } from './pages/PasswordResetPage';

// User Pages
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { AddItemPage } from './pages/AddItemPage';
import { EditListingPage } from './pages/EditListingPage';
import { CommunityMapPage } from './pages/CommunityMapPage';
import { WishlistPage } from './pages/WishlistPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { HelpFAQPage } from './pages/HelpFAQPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ProjectModePage } from './pages/ProjectModePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminListingsPage } from './pages/admin/AdminListingsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#login');
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(
    () => window.location.hash.includes('type=recovery') || window.location.hash.includes('reset-password')
  );
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [appError, setAppError] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // App Data State
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [items, setItems] = useState<ResourceItem[]>(storage.getItems());
  const [transactions, setTransactions] = useState<BorrowRequest[]>(storage.getTransactions());
  const [wishlistIds, setWishlistIds] = useState<string[]>(storage.getWishlistIds());
  const [notifications, setNotifications] = useState<NotificationItem[]>(storage.getNotifications());
  const [messages, setMessages] = useState<ChatMessage[]>(storage.getMessages());
  const [categories, setCategories] = useState<Category[]>(storage.getCategories());
  const [complaints, setComplaints] = useState<Complaint[]>(storage.getComplaints());
  const [reports, setReports] = useState<Report[]>(storage.getReports());

  useEffect(() => {
    const showError = (event: Event) => setAppError((event as CustomEvent<string>).detail);
    window.addEventListener('app-error', showError);

    if (!isSupabaseConfigured) {
      setAppError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.');
      setIsInitializing(false);
      return () => window.removeEventListener('app-error', showError);
    }

    let active = true;
    const initialize = async () => {
      const { data, error } = await requireSupabase().auth.getSession();
      if (error) throw error;
      if (data.session) {
        const authUser = mapAuthUser(data.session.user);
        await storage.load(authUser);
        if (active) {
          const profile = {
            ...(storage.getUsers().find((entry) => entry.id === authUser.id) || authUser),
            email: authUser.email,
            role: authUser.role,
            verified: authUser.verified,
          };
          storage.setCurrentUser(profile);
          setUser(profile);
          refreshData();
        }
      }
      if (active) setIsInitializing(false);
    };

    void initialize().catch((error: unknown) => {
      if (active) {
        setAppError(error instanceof Error ? error.message : 'Unable to initialize Supabase.');
        setIsInitializing(false);
      }
    });

    return () => {
      active = false;
      window.removeEventListener('app-error', showError);
    };
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || (user ? '#home' : '#login');
      setCurrentPath(hash);
      if (hash.includes('type=recovery') || hash.includes('reset-password')) setIsPasswordRecovery(true);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const navigateTo = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  const refreshData = () => {
    setUsers(storage.getUsers());
    setItems(storage.getItems());
    setTransactions(storage.getTransactions());
    setWishlistIds(storage.getWishlistIds());
    setNotifications(storage.getNotifications());
    setMessages(storage.getMessages());
    setCategories(storage.getCategories());
    setComplaints(storage.getComplaints());
    setReports(storage.getReports());
  };

  const handleLoginSuccess = async (authenticatedUser: User) => {
    try {
      await storage.load(authenticatedUser);
      const profile = {
        ...(storage.getUsers().find((entry) => entry.id === authenticatedUser.id) || authenticatedUser),
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        verified: authenticatedUser.verified,
      };
      storage.setCurrentUser(profile);
      setUser(profile);
      refreshData();
      if (currentPath !== '#admin/login') navigateTo('#home');
      setAppError('');
    } catch (error) {
      reportError(error);
    }
  };

  const handleToggleWishlist = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await storage.toggleWishlist(id);
      setWishlistIds(storage.getWishlistIds());
    } catch (error) {
      reportError(error);
    }
  };

  const handleSendMessage = async (newMsg: ChatMessage) => {
    try {
      await storage.addMessage(newMsg);
      setMessages(storage.getMessages());
      realtimeService.publish(`tx-${newMsg.transactionId}`, newMsg);
    } catch (error) {
      reportError(error);
    }
  };

  // Helper route matchers
  const isItemDetailsRoute = currentPath.startsWith('#item/');
  const activeItemId = isItemDetailsRoute ? currentPath.replace('#item/', '') : null;
  const activeItem = items.find(i => i.id === activeItemId) || null;

  const isEditListingRoute = currentPath.startsWith('#edit-listing/');
  const editItemId = isEditListingRoute ? currentPath.replace('#edit-listing/', '') : null;

  const isAdminRoute = currentPath.startsWith('#admin/');

  // Compute Admin Stats
  const adminStats: AdminStats = {
    totalUsers: users.length,
    totalListings: items.length,
    totalTransactions: transactions.length,
    pendingComplaints: complaints.filter(c => c.status === 'open' || c.status === 'under_review').length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    totalCO2SavedKg: transactions.filter(t => t.status === 'completed').length * 2.8,
    totalMoneySavedInr: transactions.filter(t => t.status === 'completed').length * 450
  };

  const unreadNotifs = notifications.filter(n => !n.readStatus).length;
  const wishlistedItems = items.filter(i => wishlistIds.includes(i.id));
  const userListings = items.filter(i => user && i.userId === user.id);

  // ENTRY POINT: LOGIN-FIRST FLOW GATING
  // If user is not authenticated and trying to access main app, show Login page
  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">Connecting to Supabase…</div>;
  }

  if (appError && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div role="alert" className="max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <h1 className="font-bold">Unable to connect to CommunityCloset</h1>
          <p className="mt-2">{appError}</p>
          <p className="mt-2">Check the Supabase project URL, publishable key, and database setup.</p>
        </div>
      </div>
    );
  }

  if (user && user.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <h1 className="font-bold">This account is inactive</h1>
          <p className="mt-2">Contact a CommunityCloset administrator if you believe this is a mistake.</p>
          <button
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 font-bold text-white"
            onClick={() => {
              void signOut().then(() => {
                storage.clearCurrentUser();
                setUser(null);
                setIsAdminAuthenticated(false);
                navigateTo('#login');
              }).catch(reportError);
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (isPasswordRecovery) {
    return (
      <PasswordResetPage
        onComplete={() => {
          setIsPasswordRecovery(false);
          navigateTo('#home');
        }}
      />
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateAdmin={() => navigateTo('#admin/login')}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FFF0F5]/30 text-gray-800 flex flex-col font-sans">
        
        {/* Universal Navbar */}
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          user={user}
          unreadNotificationsCount={unreadNotifs}
          unreadMessagesCount={messages.length > 0 ? 1 : 0}
          wishlistCount={wishlistIds.length}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={() => {
            void signOut().then(() => {
              setUser(null);
              setIsAdminAuthenticated(false);
              storage.clearCurrentUser();
              navigateTo('#login');
            }).catch(reportError);
          }}
        />

        {appError && (
          <div role="alert" className="mx-auto mt-3 w-full max-w-7xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {appError}
            <button className="ml-3 font-bold underline" onClick={() => setAppError('')}>Dismiss</button>
          </div>
        )}

        {/* Main View Router */}
        <main className="flex-1">
          {/* USER FRONTEND ROUTES */}
          {currentPath === '#landing' && (
            <LandingPage
              onNavigate={navigateTo}
              featuredItems={items.slice(0, 3)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {(currentPath === '#home' || currentPath === '#login') && user && (
            <HomePage
              user={user}
              items={items}
              categories={categories}
              wishlistIds={wishlistIds}
              onNavigate={navigateTo}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {currentPath === '#explore' && (
            <ExplorePage
              items={items}
              categories={categories}
              wishlistIds={wishlistIds}
              onNavigate={navigateTo}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {isItemDetailsRoute && (
            <ItemDetailsPage
              item={activeItem}
              currentUser={user!}
              isWishlisted={wishlistIds.includes(activeItemId || '')}
              onNavigate={navigateTo}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {currentPath === '#create-listing' && user && (
            <AddItemPage
              currentUser={user}
              categories={categories}
              onNavigate={navigateTo}
              onAdded={refreshData}
            />
          )}

          {isEditListingRoute && editItemId && (
            <EditListingPage
              itemId={editItemId}
              categories={categories}
              onNavigate={navigateTo}
              onUpdated={refreshData}
            />
          )}

          {currentPath === '#map' && (
            <CommunityMapPage
              items={items}
              wishlistIds={wishlistIds}
              onNavigate={navigateTo}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {currentPath === '#project-mode' && (
            <ProjectModePage
              items={items}
              onNavigate={navigateTo}
            />
          )}

          {currentPath === '#wishlist' && (
            <WishlistPage
              wishlistedItems={wishlistedItems}
              wishlistIds={wishlistIds}
              onNavigate={navigateTo}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {currentPath === '#messages' && user && (
            <MessagesPage
              currentUser={user}
              transactions={transactions}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentPath === '#notifications' && (
            <NotificationsPage
              notifications={notifications}
              onNavigate={navigateTo}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#transactions' && user && (
            <TransactionsPage
              currentUser={user}
              transactions={transactions}
              onNavigate={navigateTo}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#profile' && user && (
            <ProfilePage
              user={user}
              userListings={userListings}
              wishlistIds={wishlistIds}
              onNavigate={navigateTo}
              onUpdateUser={(updated) => {
                void storage.updateUser(updated).then(() => {
                  setUser(updated);
                  storage.setCurrentUser(updated);
                  refreshData();
                }).catch(reportError);
              }}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {currentPath === '#impact' && (
            <ImpactDashboardPage onNavigate={navigateTo} />
          )}

          {currentPath === '#help' && (
            <HelpFAQPage onNavigate={navigateTo} />
          )}

          {currentPath === '#complaints' && user && (
            <ComplaintsPage
              currentUser={user}
              complaints={complaints}
              onSubmitted={refreshData}
            />
          )}

          {/* ADMIN PORTAL ROUTES */}
          {isAdminRoute && !isAdminAuthenticated && (
            <AdminLoginPage
              currentUser={user}
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                navigateTo('#admin/dashboard');
              }}
              onNavigate={navigateTo}
            />
          )}

          {currentPath === '#admin/dashboard' && isAdminAuthenticated && (
            <AdminDashboardPage
              stats={adminStats}
              onNavigateAdmin={(sub) => navigateTo(`#admin/${sub}`)}
              onExitAdmin={() => navigateTo('#home')}
            />
          )}

          {currentPath === '#admin/users' && isAdminAuthenticated && (
            <AdminUsersPage
              users={users}
              onBack={() => navigateTo('#admin/dashboard')}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#admin/listings' && isAdminAuthenticated && (
            <AdminListingsPage
              items={items}
              onBack={() => navigateTo('#admin/dashboard')}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#admin/reports' && isAdminAuthenticated && (
            <AdminReportsPage
              reports={reports}
              onBack={() => navigateTo('#admin/dashboard')}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#admin/complaints' && isAdminAuthenticated && (
            <AdminComplaintsPage
              complaints={complaints}
              onBack={() => navigateTo('#admin/dashboard')}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#admin/transactions' && isAdminAuthenticated && (
            <AdminTransactionsPage
              transactions={transactions}
              onBack={() => navigateTo('#admin/dashboard')}
            />
          )}

          {currentPath === '#admin/categories' && isAdminAuthenticated && (
            <AdminCategoriesPage
              categories={categories}
              onBack={() => navigateTo('#admin/dashboard')}
              onRefresh={refreshData}
            />
          )}

          {currentPath === '#admin/analytics' && isAdminAuthenticated && (
            <AdminAnalyticsPage
              stats={adminStats}
              onBack={() => navigateTo('#admin/dashboard')}
            />
          )}

        </main>

        {/* Universal Footer */}
        <Footer onNavigate={navigateTo} />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />

      </div>
    </ErrorBoundary>
  );
}

export default App;
