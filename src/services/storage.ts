import type { ResourceItem, User, BorrowRequest, Complaint, Report, NotificationItem, ChatMessage, Category, Review, UserBadge, ImpactStats } from '../types';
import { DEFAULT_USERS, DEFAULT_ITEMS, DEFAULT_TRANSACTIONS, DEFAULT_CATEGORIES, DEFAULT_COMPLAINTS, DEFAULT_REPORTS, DEFAULT_NOTIFICATIONS, DEFAULT_MESSAGES } from './mockData';

const KEYS = {
  USERS: 'community_closet_users_v4_clean',
  ITEMS: 'community_closet_items_v4_clean',
  TRANSACTIONS: 'community_closet_tx_v4_clean',
  WISHLIST: 'community_closet_wishlist_v4_clean',
  CATEGORIES: 'community_closet_categories_v4_clean',
  COMPLAINTS: 'community_closet_complaints_v4_clean',
  REPORTS: 'community_closet_reports_v4_clean',
  NOTIFICATIONS: 'community_closet_notifications_v4_clean',
  MESSAGES: 'community_closet_messages_v4_clean',
  REVIEWS: 'community_closet_reviews_v4_clean',
  BADGES: 'community_closet_badges_v4_clean',
  IMPACT: 'community_closet_impact_v4_clean',
  CURRENT_USER: 'community_closet_current_user_v4_clean'
};

export const storage = {
  // Users
  getUsers: (): User[] => {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
    return null;
  },
  setCurrentUser: (user: User) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },
  clearCurrentUser: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Items / Listings
  getItems: (): ResourceItem[] => {
    const raw = localStorage.getItem(KEYS.ITEMS);
    return raw ? JSON.parse(raw) : DEFAULT_ITEMS;
  },
  saveItems: (items: ResourceItem[]) => {
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
  },
  addItem: (item: ResourceItem) => {
    const items = storage.getItems();
    items.unshift(item);
    storage.saveItems(items);

    // Award first_share badge if user's first listing
    const userBadges = storage.getBadges(item.userId);
    if (!userBadges.some(b => b.badgeType === 'first_share')) {
      storage.addBadge({
        id: `bdg-${Date.now()}`,
        userId: item.userId,
        badgeType: 'first_share',
        title: 'First Share Hero',
        description: 'Shared your first resource with Katraj neighbors',
        icon: 'Sparkles',
        earnedAt: new Date().toISOString()
      });
    }
    return item;
  },
  updateItem: (id: string, updates: Partial<ResourceItem>) => {
    const items = storage.getItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      storage.saveItems(items);
    }
  },
  deleteItem: (id: string) => {
    const items = storage.getItems().filter(i => i.id !== id);
    storage.saveItems(items);
  },

  // Requests / Transactions
  getTransactions: (): BorrowRequest[] => {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : DEFAULT_TRANSACTIONS;
  },
  saveTransactions: (txs: BorrowRequest[]) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
  },
  addTransaction: (tx: BorrowRequest) => {
    const txs = storage.getTransactions();
    txs.unshift(tx);
    storage.saveTransactions(txs);
    return tx;
  },
  updateTransaction: (id: string, status: BorrowRequest['status']) => {
    const txs = storage.getTransactions();
    const idx = txs.findIndex(t => t.id === id);
    if (idx !== -1) {
      txs[idx].status = status;
      txs[idx].updatedAt = new Date().toISOString();
      storage.saveTransactions(txs);

      // Award reuse_hero badge on completed transaction
      if (status === 'completed') {
        const borrowerId = txs[idx].requesterId;
        const userBadges = storage.getBadges(borrowerId);
        if (!userBadges.some(b => b.badgeType === 'reuse_hero')) {
          storage.addBadge({
            id: `bdg-${Date.now()}`,
            userId: borrowerId,
            badgeType: 'reuse_hero',
            title: 'Reuse Hero',
            description: 'Completed a resource borrow and prevented landfill waste',
            icon: 'Leaf',
            earnedAt: new Date().toISOString()
          });
        }
      }
    }
  },

  // Reviews
  getReviews: (): Review[] => {
    const raw = localStorage.getItem(KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : [];
  },
  addReview: (review: Review) => {
    const reviews = storage.getReviews();
    reviews.unshift(review);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));

    // Recalculate reviewee average rating
    const userReviews = reviews.filter(r => r.revieweeId === review.revieweeId);
    const avg = Math.round((userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length) * 10) / 10;
    
    const users = storage.getUsers();
    const uIdx = users.findIndex(u => u.id === review.revieweeId);
    if (uIdx !== -1) {
      users[uIdx].ratingAvg = avg;
      users[uIdx].reviewsCount = userReviews.length;
      storage.saveUsers(users);
    }

    return review;
  },

  // Badges
  getBadges: (userId?: string): UserBadge[] => {
    const raw = localStorage.getItem(KEYS.BADGES);
    const allBadges: UserBadge[] = raw ? JSON.parse(raw) : [];
    if (userId) return allBadges.filter(b => b.userId === userId);
    return allBadges;
  },
  addBadge: (badge: UserBadge) => {
    const badges = storage.getBadges();
    if (!badges.some(b => b.userId === badge.userId && b.badgeType === badge.badgeType)) {
      badges.unshift(badge);
      localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
    }
    return badge;
  },

  // Wishlist
  getWishlistIds: (): string[] => {
    const raw = localStorage.getItem(KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  },
  toggleWishlist: (listingId: string): boolean => {
    const wishlist = storage.getWishlistIds();
    const exists = wishlist.includes(listingId);
    let next: string[];
    if (exists) {
      next = wishlist.filter(id => id !== listingId);
    } else {
      next = [...wishlist, listingId];
    }
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(next));
    return !exists;
  },

  // Complaints
  getComplaints: (): Complaint[] => {
    const raw = localStorage.getItem(KEYS.COMPLAINTS);
    return raw ? JSON.parse(raw) : DEFAULT_COMPLAINTS;
  },
  addComplaint: (cmp: Complaint) => {
    const complaints = storage.getComplaints();
    complaints.unshift(cmp);
    localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(complaints));
    return cmp;
  },
  updateComplaint: (id: string, status: Complaint['status'], adminNotes?: string) => {
    const complaints = storage.getComplaints();
    const idx = complaints.findIndex(c => c.id === id);
    if (idx !== -1) {
      complaints[idx].status = status;
      if (adminNotes !== undefined) complaints[idx].adminNotes = adminNotes;
      localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(complaints));
    }
  },

  // Reports
  getReports: (): Report[] => {
    const raw = localStorage.getItem(KEYS.REPORTS);
    return raw ? JSON.parse(raw) : DEFAULT_REPORTS;
  },
  addReport: (rep: Report) => {
    const reports = storage.getReports();
    reports.unshift(rep);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    return rep;
  },
  updateReport: (id: string, status: Report['status']) => {
    const reports = storage.getReports();
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    }
  },

  // Categories
  getCategories: (): Category[] => {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
  },
  addNotification: (notif: NotificationItem) => {
    const notifs = storage.getNotifications();
    notifs.unshift(notif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },
  markNotificationRead: (id: string) => {
    const notifs = storage.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifs[idx].readStatus = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  },

  // Chat Messages
  getMessages: (): ChatMessage[] => {
    const raw = localStorage.getItem(KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : DEFAULT_MESSAGES;
  },
  addMessage: (msg: ChatMessage) => {
    const msgs = storage.getMessages();
    msgs.push(msg);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(msgs));
    return msg;
  },

  // Impact Stats - computed dynamically from completed transactions
  getImpactStats: (): ImpactStats => {
    const completedTx = storage.getTransactions().filter(t => t.status === 'completed');
    const itemsReused = completedTx.length;
    const kgCo2Diverted = Math.round(itemsReused * 2.8 * 10) / 10;
    const moneySavedInr = itemsReused * 450;
    const activeLenders = new Set(storage.getItems().map(i => i.userId)).size;

    return {
      itemsReused,
      kgCo2Diverted,
      moneySavedInr,
      activeLendersCount: activeLenders,
      updatedAt: new Date().toISOString()
    };
  }
};
