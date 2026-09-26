-- CommunityCloset PostgreSQL Database Schema
-- Location focus: Katraj, Pune, Maharashtra

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'tool' | 'material'
  icon VARCHAR(64),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'lend' | 'giveaway' | 'exchange'
  status VARCHAR(32) DEFAULT 'available', -- 'available' | 'borrowed' | 'reserved' | 'archived'
  condition VARCHAR(64) NOT NULL, -- 'Like New' | 'Good' | 'Fair'
  deposit_amount NUMERIC(8,2) DEFAULT 0,
  max_duration_days INT DEFAULT 7,
  location_name VARCHAR(255) DEFAULT 'Katraj, Pune',
  lat NUMERIC(9,6) DEFAULT 18.4575,
  lng NUMERIC(9,6) DEFAULT 73.8508,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(64) PRIMARY KEY,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE CASCADE,
  borrower_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  lender_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(32) DEFAULT 'pending', -- 'pending' | 'approved' | 'active' | 'returned' | 'rejected' | 'disputed' | 'cancelled'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  deposit_paid NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlist (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(64) PRIMARY KEY,
  transaction_id VARCHAR(64) REFERENCES transactions(id) ON DELETE CASCADE,
  sender_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  receiver_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL, -- 'request' | 'approval' | 'message' | 'system'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  transaction_id VARCHAR(64) REFERENCES transactions(id) ON DELETE SET NULL,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'open', -- 'open' | 'under_review' | 'resolved' | 'dismissed'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(64) PRIMARY KEY,
  reporter_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  listing_id VARCHAR(64) REFERENCES listings(id) ON DELETE CASCADE,
  reason VARCHAR(128) NOT NULL,
  details TEXT,
  status VARCHAR(32) DEFAULT 'pending', -- 'pending' | 'dismissed' | 'action_taken'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
