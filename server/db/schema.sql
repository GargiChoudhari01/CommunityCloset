-- CommunityCloset Relational Database Schema (PostgreSQL)
-- Focus: Katraj, Pune, Maharashtra

-- 1. Users Collection / Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'user', -- 'user' | 'admin'
  avatar_url TEXT,
  phone VARCHAR(32),
  bio TEXT,
  location_address VARCHAR(255) DEFAULT 'Katraj, Pune, MH',
  lat NUMERIC(9,6) DEFAULT 18.4575,
  lng NUMERIC(9,6) DEFAULT 73.8508,
  eco_points INT DEFAULT 0,
  co2_saved_kg NUMERIC(8,2) DEFAULT 0.0,
  verified BOOLEAN DEFAULT true,
  status VARCHAR(32) DEFAULT 'active', -- 'active' | 'suspended' | 'banned'
  rating_avg NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  items_shared INT DEFAULT 0,
  items_borrowed INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'tool' | 'material'
  icon VARCHAR(64),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Listings Table
CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  resource_type VARCHAR(32) NOT NULL, -- 'borrow' | 'giveaway' | 'exchange' | 'donate'
  item_kind VARCHAR(32) DEFAULT 'tool', -- 'tool' | 'material'
  status VARCHAR(32) DEFAULT 'active', -- 'active' | 'borrowed' | 'claimed' | 'removed'
  condition VARCHAR(64) NOT NULL, -- 'Like New' | 'Good' | 'Fair'
  quantity INT DEFAULT 1,
  deposit_amount NUMERIC(8,2) DEFAULT 0,
  max_duration_days INT DEFAULT 7,
  location_name VARCHAR(255) DEFAULT 'Katraj, Pune',
  lat NUMERIC(9,6) DEFAULT 18.4575,
  lng NUMERIC(9,6) DEFAULT 73.8508,
  images TEXT[] DEFAULT '{}',
  exchange_preference TEXT,
  featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Requests (Borrows / Claims / Exchanges) Table
CREATE TABLE IF NOT EXISTS requests (
  id VARCHAR(64) PRIMARY KEY,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE CASCADE,
  requester_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  owner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(32) DEFAULT 'borrow', -- 'borrow' | 'material' | 'exchange' | 'collect'
  status VARCHAR(32) DEFAULT 'pending', -- 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  message TEXT,
  start_date DATE,
  end_date DATE,
  deposit_paid NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) REFERENCES requests(id) ON DELETE CASCADE,
  sender_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  receiver_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL, -- 'request' | 'approval' | 'message' | 'system' | 'badge' | 'review'
  message TEXT NOT NULL,
  related_listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE SET NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE SET NULL,
  reviewer_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE CASCADE,
  item_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);

-- 9. Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(64) NOT NULL, -- 'first_share' | 'reuse_hero' | 'community_helper' | 'resource_champion'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_type)
);

-- 10. Reports Table (for Admin)
CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(64) PRIMARY KEY,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  reporter_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(128) NOT NULL,
  details TEXT,
  status VARCHAR(32) DEFAULT 'open', -- 'open' | 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Impact Stats Table
CREATE TABLE IF NOT EXISTS impact_stats (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  items_reused INT DEFAULT 0,
  kg_co2_diverted NUMERIC(8,2) DEFAULT 0.0,
  money_saved_inr NUMERIC(10,2) DEFAULT 0.0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
