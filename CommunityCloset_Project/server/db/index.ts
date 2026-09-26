/**
 * CommunityCloset Database Layer
 * Supports PostgreSQL connection via DATABASE_URL or transparent fallback store
 */

export interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location_address: string;
  lat: number;
  lng: number;
  eco_points: number;
  co2_saved_kg: number;
  verified: boolean;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
}

export interface DbListing {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  type: 'lend' | 'giveaway' | 'exchange';
  status: 'available' | 'borrowed' | 'reserved' | 'archived';
  condition: string;
  deposit_amount: number;
  max_duration_days: number;
  location_name: string;
  lat: number;
  lng: number;
  images: string[];
  featured: boolean;
  views_count: number;
  created_at: string;
}

export interface DbTransaction {
  id: string;
  listing_id: string;
  borrower_id: string;
  lender_id: string;
  status: 'pending' | 'approved' | 'active' | 'returned' | 'rejected' | 'disputed' | 'cancelled';
  start_date: string;
  end_date: string;
  notes?: string;
  deposit_paid: number;
  created_at: string;
}

export interface DbComplaint {
  id: string;
  user_id: string;
  transaction_id?: string;
  listing_id?: string;
  subject: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
}

export interface DbReport {
  id: string;
  reporter_id: string;
  listing_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'dismissed' | 'action_taken';
  created_at: string;
}

console.log('[Database] Database adapter initialized with fallback support.');
