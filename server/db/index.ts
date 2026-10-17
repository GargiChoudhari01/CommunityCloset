export type DbCollection =
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

export interface DbAppRecord {
  collection: DbCollection;
  record_id: string;
  owner_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
