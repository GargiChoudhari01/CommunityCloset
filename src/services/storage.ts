import type { ResourceItem, User, BorrowRequest, Complaint, Report, NotificationItem, ChatMessage, Category, Review, UserBadge, ImpactStats } from '../types';
import { requireSupabase } from './supabase';

type Collection =
  | 'users'
  | 'items'
  | 'transactions'
  | 'wishlist'
  | 'categories'
  | 'complaints'
  | 'reports'
  | 'notifications'
  | 'messages'
  | 'reviews'
  | 'badges';

interface AppRecord {
  collection: Collection;
  record_id: string;
  owner_id: string | null;
  payload: Record<string, unknown>;
}

const cache: Record<Collection, unknown[]> = {
  users: [],
  items: [],
  transactions: [],
  wishlist: [],
  categories: [],
  complaints: [],
  reports: [],
  notifications: [],
  messages: [],
  reviews: [],
  badges: [],
};

let currentUser: User | null = null;
let impactStats: ImpactStats = {
  itemsReused: 0,
  kgCo2Diverted: 0,
  moneySavedInr: 0,
  activeLendersCount: 0,
  totalUsers: 0,
  updatedAt: new Date(0).toISOString(),
};

function byId<T extends { id: string }>(collection: Collection): T[] {
  return cache[collection] as T[];
}

function authenticatedUser(): User {
  if (!currentUser) throw new Error('You must be signed in to save data.');
  return currentUser;
}

function currentUserId(): string {
  return authenticatedUser().id;
}

function ownerFor(collection: Collection, value: Record<string, unknown>): string | null {
  switch (collection) {
    case 'users': return String(value.id);
    case 'items': return String(value.userId);
    case 'transactions': return String(value.requesterId);
    case 'wishlist':
    case 'complaints':
    case 'badges': return String(value.userId);
    case 'notifications': return currentUserId();
    case 'reports': return String(value.reporterId);
    case 'messages': return String(value.senderId);
    case 'reviews': return String(value.reviewerId);
    case 'categories': return null;
  }
}

function toPayload(value: object): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value));
}

async function saveRecord(collection: Collection, id: string, value: Record<string, unknown>) {
  const ownerId = ownerFor(collection, value);
  const { error } = await requireSupabase()
    .from('app_records')
    .upsert({
      collection,
      record_id: id,
      owner_id: ownerId,
      payload: value,
    }, { onConflict: 'collection,record_id' });
  if (error) throw error;
}

async function updateRecord(collection: Collection, id: string, value: Record<string, unknown>) {
  const { error } = await requireSupabase()
    .from('app_records')
    .update({
      owner_id: ownerFor(collection, value),
      payload: value,
    })
    .eq('collection', collection)
    .eq('record_id', id);
  if (error) throw error;
}

async function deleteRecord(collection: Collection, id: string) {
  const { error } = await requireSupabase()
    .from('app_records')
    .delete()
    .eq('collection', collection)
    .eq('record_id', id);
  if (error) throw error;
}

function setCache<T>(collection: Collection, values: T[]) {
  cache[collection] = values;
}

export const storage = {
  async load(user: User): Promise<void> {
    currentUser = user;
    const client = requireSupabase();
    const records: AppRecord[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await client
        .from('app_records')
        .select('collection,record_id,owner_id,payload')
        .range(offset, offset + 999);
      if (error) throw error;
      const page = (data || []) as AppRecord[];
      records.push(...page);
      if (page.length < 1000) break;
    }

    for (const collection of Object.keys(cache) as Collection[]) {
      const collectionRecords = records.filter((row) => row.collection === collection);
      setCache(collection, collectionRecords.map((row) => row.payload));
    }
    const { data: stats, error: statsError } = await client.rpc('get_communitycloset_impact');
    if (statsError) throw statsError;
    impactStats = stats as ImpactStats;

    const profiles = byId<User>('users');
    if (!profiles.some((profile) => profile.id === user.id)) {
      await saveRecord('users', user.id, toPayload(user));
      setCache('users', [user, ...profiles]);
    }
  },

  setCurrentUser(user: User | null) {
    currentUser = user;
    if (user) {
      const users = byId<User>('users');
      setCache('users', users.some((entry) => entry.id === user.id)
        ? users.map((entry) => entry.id === user.id ? user : entry)
        : [user, ...users]);
    }
  },
  getCurrentUser: () => currentUser,
  clearCurrentUser: () => { currentUser = null; },

  getUsers: () => byId<User>('users'),
  async saveUsers(users: User[]) {
    for (const user of users) await saveRecord('users', user.id, toPayload(user));
    setCache('users', users);
    await storage.load(authenticatedUser());
  },
  async updateUser(user: User) {
    await updateRecord('users', user.id, toPayload(user));
    setCache('users', byId<User>('users').map((entry) => entry.id === user.id ? user : entry));
    if (currentUser?.id === user.id) currentUser = user;
  },

  getItems: () => byId<ResourceItem>('items'),
  async addItem(item: ResourceItem) {
    const user = authenticatedUser();
    await saveRecord('items', item.id, toPayload(item));
    setCache('items', [item, ...byId<ResourceItem>('items')]);
    await storage.load(user);
    return item;
  },
  async updateItem(id: string, updates: Partial<ResourceItem>) {
    const item = byId<ResourceItem>('items').find((entry) => entry.id === id);
    if (!item) return;
    const updated = { ...item, ...updates };
    await updateRecord('items', id, toPayload(updated));
    setCache('items', byId<ResourceItem>('items').map((entry) => entry.id === id ? updated : entry));
  },
  async deleteItem(id: string) {
    await deleteRecord('items', id);
    setCache('items', byId<ResourceItem>('items').filter((entry) => entry.id !== id));
    await storage.load(authenticatedUser());
  },

  getTransactions: () => byId<BorrowRequest>('transactions'),
  async addTransaction(transaction: BorrowRequest) {
    await saveRecord('transactions', transaction.id, toPayload(transaction));
    setCache('transactions', [transaction, ...byId<BorrowRequest>('transactions')]);
    return transaction;
  },
  async updateTransaction(id: string, status: BorrowRequest['status']) {
    const transaction = byId<BorrowRequest>('transactions').find((entry) => entry.id === id);
    if (!transaction) return;
    const updated = { ...transaction, status, updatedAt: new Date().toISOString() };
    await updateRecord('transactions', id, toPayload(updated));
    setCache('transactions', byId<BorrowRequest>('transactions').map((entry) => entry.id === id ? updated : entry));
    await storage.load(authenticatedUser());
  },

  getReviews: () => byId<Review>('reviews'),
  async addReview(review: Review) {
    await saveRecord('reviews', review.id, toPayload(review));
    setCache('reviews', [review, ...byId<Review>('reviews')]);
    const userReviews = byId<Review>('reviews').filter((entry) => entry.revieweeId === review.revieweeId);
    const profile = byId<User>('users').find((entry) => entry.id === review.revieweeId);
    if (profile) {
      await storage.updateUser({
        ...profile,
        ratingAvg: Math.round((userReviews.reduce((total, entry) => total + entry.rating, 0) / userReviews.length) * 10) / 10,
        reviewsCount: userReviews.length,
      });
    }
    return review;
  },

  getBadges: (userId?: string) => byId<UserBadge>('badges').filter((badge) => !userId || badge.userId === userId),
  getWishlistIds: () => byId<{ id: string }>('wishlist').map((entry) => entry.id),
  async toggleWishlist(listingId: string) {
    const existing = byId<{ id: string; userId: string }>('wishlist').find((entry) => entry.id === listingId);
    if (existing) {
      await deleteRecord('wishlist', listingId);
      setCache('wishlist', byId('wishlist').filter((entry) => (entry as { id: string }).id !== listingId));
      return false;
    }
    const entry = { id: listingId, userId: currentUserId() };
    await saveRecord('wishlist', listingId, entry);
    setCache('wishlist', [...byId('wishlist'), entry]);
    return true;
  },

  getComplaints: () => byId<Complaint>('complaints'),
  async addComplaint(complaint: Complaint) {
    await saveRecord('complaints', complaint.id, toPayload(complaint));
    setCache('complaints', [complaint, ...byId<Complaint>('complaints')]);
    return complaint;
  },
  async updateComplaint(id: string, status: Complaint['status'], adminNotes?: string) {
    const complaint = byId<Complaint>('complaints').find((entry) => entry.id === id);
    if (!complaint) return;
    const updated = { ...complaint, status, ...(adminNotes !== undefined ? { adminNotes } : {}) };
    await updateRecord('complaints', id, toPayload(updated));
    setCache('complaints', byId<Complaint>('complaints').map((entry) => entry.id === id ? updated : entry));
  },

  getReports: () => byId<Report>('reports'),
  async addReport(report: Report) {
    await saveRecord('reports', report.id, toPayload(report));
    setCache('reports', [report, ...byId<Report>('reports')]);
    return report;
  },
  async updateReport(id: string, status: Report['status']) {
    const report = byId<Report>('reports').find((entry) => entry.id === id);
    if (!report) return;
    const updated = { ...report, status };
    await updateRecord('reports', id, toPayload(updated));
    setCache('reports', byId<Report>('reports').map((entry) => entry.id === id ? updated : entry));
  },

  getCategories: () => byId<Category>('categories'),
  async saveCategories(categories: Category[]) {
    for (const category of categories) await saveRecord('categories', category.id, toPayload(category));
    setCache('categories', categories);
  },

  getNotifications: () => byId<NotificationItem>('notifications'),
  async addNotification(notification: NotificationItem) {
    await saveRecord('notifications', notification.id, toPayload(notification));
    setCache('notifications', [notification, ...byId<NotificationItem>('notifications')]);
  },
  async markNotificationRead(id: string) {
    const notification = byId<NotificationItem>('notifications').find((entry) => entry.id === id);
    if (!notification) return;
    const updated = { ...notification, readStatus: true };
    await updateRecord('notifications', id, toPayload(updated));
    setCache('notifications', byId<NotificationItem>('notifications').map((entry) => entry.id === id ? updated : entry));
  },

  getMessages: () => byId<ChatMessage>('messages'),
  async addMessage(message: ChatMessage) {
    await saveRecord('messages', message.id, toPayload(message));
    setCache('messages', [...byId<ChatMessage>('messages'), message]);
    return message;
  },

  getImpactStats: (): ImpactStats => impactStats,
};
