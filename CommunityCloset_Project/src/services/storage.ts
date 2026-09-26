import type { ResourceItem, User, Transaction, Complaint, Report, NotificationItem, ChatMessage, Category } from '../types';
import { DEFAULT_USERS, DEFAULT_ITEMS, DEFAULT_TRANSACTIONS, DEFAULT_CATEGORIES, DEFAULT_COMPLAINTS, DEFAULT_REPORTS, DEFAULT_NOTIFICATIONS, DEFAULT_MESSAGES } from './mockData';

const KEYS = {
  USERS: 'community_closet_users_v2',
  ITEMS: 'community_closet_items_v2',
  TRANSACTIONS: 'community_closet_tx_v2',
  WISHLIST: 'community_closet_wishlist_v2',
  CATEGORIES: 'community_closet_categories_v2',
  COMPLAINTS: 'community_closet_complaints_v2',
  REPORTS: 'community_closet_reports_v2',
  NOTIFICATIONS: 'community_closet_notifications_v2',
  MESSAGES: 'community_closet_messages_v2',
  CURRENT_USER: 'community_closet_current_user_v2'
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
  getCurrentUser: (): User => {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
    const users = storage.getUsers();
    return users[0] || DEFAULT_USERS[0];
  },
  setCurrentUser: (user: User) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
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

  // Wishlist
  getWishlistIds: (): string[] => {
    const raw = localStorage.getItem(KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : ['item-1'];
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

  // Transactions
  getTransactions: (): Transaction[] => {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : DEFAULT_TRANSACTIONS;
  },
  saveTransactions: (txs: Transaction[]) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
  },
  addTransaction: (tx: Transaction) => {
    const txs = storage.getTransactions();
    txs.unshift(tx);
    storage.saveTransactions(txs);
    return tx;
  },
  updateTransaction: (id: string, status: Transaction['status']) => {
    const txs = storage.getTransactions();
    const idx = txs.findIndex(t => t.id === id);
    if (idx !== -1) {
      txs[idx].status = status;
      storage.saveTransactions(txs);
    }
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
  }
};
