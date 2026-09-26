export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  bio?: string;
  avatar?: string;
  locationAddress: string;
  lat: number;
  lng: number;
  ecoPoints: number;
  co2SavedKg: number;
  verified: boolean;
  status: 'active' | 'suspended' | 'banned';
  ratingAvg?: number;
  reviewsCount?: number;
  itemsSharedCount?: number;
  itemsBorrowedCount?: number;
  createdAt: string;
}

export type ResourceType = 'lend' | 'giveaway' | 'exchange' | 'donate' | 'borrow';
export type ResourceStatus = 'available' | 'borrowed' | 'claimed' | 'archived';

export interface ResourceItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  itemKind: 'tool' | 'material';
  type: ResourceType;
  status: ResourceStatus;
  condition: 'Like New' | 'Good' | 'Fair';
  quantity?: number;
  depositAmount: number;
  maxDurationDays: number;
  locationName: string;
  lat: number;
  lng: number;
  images: string[];
  exchangePreference?: string;
  featured?: boolean;
  viewsCount: number;
  ownerName: string;
  ownerAvatar?: string;
  ownerRating?: number;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled' | 'active' | 'rejected';
export type RequestType = 'borrow' | 'material' | 'exchange' | 'collect';

export interface BorrowRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  ownerName: string;
  // Aliases for compatibility
  borrowerId?: string;
  borrowerName?: string;
  lenderId?: string;
  lenderName?: string;
  type: RequestType;
  status: RequestStatus;
  message?: string;
  startDate: string;
  endDate: string;
  depositPaid: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Alias for backward compatibility
export type Transaction = BorrowRequest;
export type TransactionStatus = RequestStatus;

export interface ChatMessage {
  id: string;
  requestId?: string;
  transactionId?: string; // alias
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  readStatus: boolean;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'request' | 'approval' | 'message' | 'system' | 'badge' | 'review';
  title: string;
  message: string;
  link?: string;
  readStatus: boolean;
  timestamp: string;
}

export interface Review {
  id: string;
  listingId: string;
  listingTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  revieweeName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  listingId: string;
  itemName: string;
  listing?: ResourceItem;
  createdAt: string;
}

export type BadgeType = 'first_share' | 'reuse_hero' | 'community_helper' | 'resource_champion';

export interface UserBadge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  transactionId?: string;
  listingId?: string;
  subject: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  details?: string;
  status: 'pending' | 'dismissed' | 'action_taken' | 'open' | 'resolved';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'tool' | 'material';
  icon: string;
  description: string;
}

export interface ImpactStats {
  id?: string;
  userId?: string;
  itemsReused: number;
  kgCo2Diverted: number;
  moneySavedInr: number;
  activeLendersCount: number;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalTransactions: number;
  pendingComplaints: number;
  pendingReports: number;
  totalCO2SavedKg: number;
  totalMoneySavedInr: number;
}
