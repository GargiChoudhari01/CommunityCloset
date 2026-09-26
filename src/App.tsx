import React, { useState, useEffect } from 'react';
import type { User, ResourceItem, BorrowRequest, NotificationItem, ChatMessage, Category, Complaint, Report, AdminStats } from './types';
import { storage } from './services/storage';
import { realtimeService } from './services/realtimeService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Auth Page
import { LoginPage } from './pages/LoginPage';

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
  const [user, setUser] = useState<User | null>(storage.getCurrentUser());
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

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || (user ? '#home' : '#login');
      setCurrentPath(hash);
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

  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleWishlist(id);
    setWishlistIds(storage.getWishlistIds());
  };

  const handleSendMessage = (newMsg: ChatMessage) => {
    storage.addMessage(newMsg);
    setMessages(storage.getMessages());
    realtimeService.publish(`tx-${newMsg.transactionId}`, newMsg);
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
  if (!user && !isAdminRoute) {
    return (
      <ErrorBoundary>
        <LoginPage
          onLoginSuccess={(loggedUser) => {
            setUser(loggedUser);
            refreshData();
            navigateTo('#home');
          }}
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
            setUser(null);
            storage.clearCurrentUser();
            navigateTo('#login');
          }}
        />

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
                setUser(updated);
                storage.setCurrentUser(updated);
                refreshData();
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
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            refreshData();
          }}
        />

      </div>
    </ErrorBoundary>
  );
}

export default App;
