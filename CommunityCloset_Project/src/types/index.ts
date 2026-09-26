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
  createdAt: string;
}

export type ResourceType = 'lend' | 'giveaway' | 'exchange';
export type ResourceStatus = 'available' | 'borrowed' | 'reserved' | 'archived';

export interface ResourceItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string; // e.g., 'Gardening', 'Power Tools', 'Lumber', 'Painting'
  itemKind: 'tool' | 'material';
  type: ResourceType;
  status: ResourceStatus;
  condition: 'Like New' | 'Good' | 'Fair';
  depositAmount: number;
  maxDurationDays: number;
  locationName: string;
  lat: number;
  lng: number;
  images: string[];
  featured?: boolean;
  viewsCount: number;
  ownerName: string;
  ownerAvatar?: string;
  ownerRating?: number;
  createdAt: string;
}

export type TransactionStatus =
  | 'pending'
  | 'approved'
  | 'active'
  | 'returned'
  | 'rejected'
  | 'disputed'
  | 'cancelled';

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  borrowerId: string;
  borrowerName: string;
  lenderId: string;
  lenderName: string;
  status: TransactionStatus;
  startDate: string;
  endDate: string;
  depositPaid: number;
  notes?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  listingId: string;
  listing: ResourceItem;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  transactionId: string;
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
  type: 'request' | 'approval' | 'message' | 'system';
  title: string;
  message: string;
  link?: string;
  readStatus: boolean;
  timestamp: string;
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
  status: 'pending' | 'dismissed' | 'action_taken';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'tool' | 'material';
  icon: string;
  description: string;
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
