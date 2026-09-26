import type { ResourceItem, User, Transaction, Category, Complaint, Report, NotificationItem, ChatMessage } from '../types';

export const KATRAJ_CENTER = { lat: 18.4575, lng: 73.8508 };

export const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Aarav Sharma',
    email: 'aarav.katraj@gmail.com',
    role: 'user',
    phone: '+91 98230 11223',
    bio: 'DIY enthusiast & woodworking hobbyist in Katraj, Pune. Happy to lend tools to neighbors!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Near Rajiv Gandhi Zoological Park, Katraj, Pune',
    lat: 18.4582,
    lng: 73.8512,
    ecoPoints: 420,
    co2SavedKg: 38.5,
    verified: true,
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'u2',
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@gmail.com',
    role: 'user',
    phone: '+91 98901 44556',
    bio: 'Avid organic gardener and terrace farm builder near Katraj Lake.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Katraj Lake view Apartments, Katraj, Pune',
    lat: 18.4540,
    lng: 73.8490,
    ecoPoints: 610,
    co2SavedKg: 52.0,
    verified: true,
    status: 'active',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'u3',
    name: 'Rohan Patil',
    email: 'rohan.patil@gmail.com',
    role: 'user',
    phone: '+91 97654 88990',
    bio: 'Civil engineer giving away leftover construction materials from home renovation.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Sukhsagar Nagar, Katraj, Pune',
    lat: 18.4610,
    lng: 73.8530,
    ecoPoints: 340,
    co2SavedKg: 29.0,
    verified: true,
    status: 'active',
    createdAt: '2026-03-10T14:30:00.000Z'
  },
  {
    id: 'admin1',
    name: 'Community Admin',
    email: 'admin@communitycloset.org',
    role: 'admin',
    phone: '+91 98000 00000',
    bio: 'Official CommunityCloset Admin for Katraj & Pune South Zone.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Community Center, Katraj, Pune',
    lat: 18.4575,
    lng: 73.8508,
    ecoPoints: 1200,
    co2SavedKg: 150.0,
    verified: true,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Power Tools', type: 'tool', icon: 'Wrench', description: 'Drills, saws, sanders, angle grinders' },
  { id: 'cat-2', name: 'Gardening & Lawn', type: 'tool', icon: 'Sprout', description: 'Lawn mowers, pruners, spades, hoses' },
  { id: 'cat-3', name: 'Painting & Masonry', type: 'tool', icon: 'Paintbrush', description: 'Ladders, paint sprayers, trowels' },
  { id: 'cat-4', name: 'Lumber & Wood', type: 'material', icon: 'Trees', description: 'Leftover plywood, wooden planks, timber' },
  { id: 'cat-5', name: 'Tiles & Bricks', type: 'material', icon: 'Boxes', description: 'Ceramic tiles, red bricks, paving blocks' },
  { id: 'cat-6', name: 'Hardware & Plumbing', type: 'material', icon: 'Hammer', description: 'PVC pipes, copper wires, screws, bolts' },
];

export const DEFAULT_ITEMS: ResourceItem[] = [
  {
    id: 'item-1',
    userId: 'u1',
    title: 'Bosch Professional Cordless Impact Drill Set',
    description: 'Heavy duty 18V Bosch drill with 2 lithium batteries, charger, and 30-piece masonry bit set. Ideal for wall mounting and concrete drilling in Katraj homes.',
    category: 'Power Tools',
    itemKind: 'tool',
    type: 'lend',
    status: 'available',
    condition: 'Like New',
    depositAmount: 500,
    maxDurationDays: 5,
    locationName: 'Near Rajiv Gandhi Zoological Park, Katraj',
    lat: 18.4582,
    lng: 73.8512,
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    viewsCount: 142,
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerRating: 4.9,
    createdAt: '2026-08-01T09:00:00.000Z'
  },
  {
    id: 'item-2',
    userId: 'u2',
    title: 'Extendable Aluminum Ladder (12 Feet)',
    description: 'Sturdy lightweight 12ft folding aluminum ladder. Perfect for ceiling painting, cleaning water tanks, or roof repairs.',
    category: 'Painting & Masonry',
    itemKind: 'tool',
    type: 'lend',
    status: 'available',
    condition: 'Good',
    depositAmount: 300,
    maxDurationDays: 3,
    locationName: 'Katraj Lake view, Katraj',
    lat: 18.4540,
    lng: 73.8490,
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    viewsCount: 98,
    ownerName: 'Priya Deshmukh',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    ownerRating: 4.8,
    createdAt: '2026-08-05T11:20:00.000Z'
  },
  {
    id: 'item-3',
    userId: 'u3',
    title: 'Leftover Teak Plywood Planks (4 Sheets)',
    description: 'High-grade 18mm teak plywood pieces leftover from modular kitchen work. Free giveaway for DIY furniture makers in Katraj.',
    category: 'Lumber & Wood',
    itemKind: 'material',
    type: 'giveaway',
    status: 'available',
    condition: 'Like New',
    depositAmount: 0,
    maxDurationDays: 1,
    locationName: 'Sukhsagar Nagar, Katraj',
    lat: 18.4610,
    lng: 73.8530,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    viewsCount: 180,
    ownerName: 'Rohan Patil',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    ownerRating: 5.0,
    createdAt: '2026-08-10T15:45:00.000Z'
  },
  {
    id: 'item-4',
    userId: 'u1',
    title: 'Electric Lawn Mower & Grass Trimmer',
    description: '1400W electric lawn mower with 30L grass box. Great for garden maintenance in Katraj housing societies.',
    category: 'Gardening & Lawn',
    itemKind: 'tool',
    type: 'lend',
    status: 'available',
    condition: 'Good',
    depositAmount: 400,
    maxDurationDays: 2,
    locationName: 'Near Rajiv Gandhi Zoological Park, Katraj',
    lat: 18.4582,
    lng: 73.8512,
    images: ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a8d?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    viewsCount: 76,
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerRating: 4.9,
    createdAt: '2026-08-12T08:30:00.000Z'
  }
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    listingId: 'item-1',
    listingTitle: 'Bosch Professional Cordless Impact Drill Set',
    listingImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    borrowerId: 'u2',
    borrowerName: 'Priya Deshmukh',
    lenderId: 'u1',
    lenderName: 'Aarav Sharma',
    status: 'active',
    startDate: '2026-09-20',
    endDate: '2026-09-24',
    depositPaid: 500,
    notes: 'Borrowing to drill wall curtain hooks in Katraj Lake View Apt.',
    createdAt: '2026-09-19T14:00:00.000Z'
  }
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'u1',
    type: 'request',
    title: 'New Borrow Request!',
    message: 'Priya Deshmukh requested to borrow "Bosch Professional Cordless Impact Drill Set" for 4 days.',
    link: '#transactions',
    readStatus: false,
    timestamp: '2026-09-22T10:15:00.000Z'
  }
];

export const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    transactionId: 'tx-101',
    senderId: 'u2',
    senderName: 'Priya Deshmukh',
    receiverId: 'u1',
    text: 'Hi Aarav, I picked up the drill near Rajiv Gandhi Zoo gate. Will return it by Thursday!',
    readStatus: true,
    timestamp: '2026-09-20T11:00:00.000Z'
  },
  {
    id: 'msg-2',
    transactionId: 'tx-101',
    senderId: 'u1',
    senderName: 'Aarav Sharma',
    receiverId: 'u2',
    text: 'Awesome Priya! Let me know if you need the masonry bits set as well.',
    readStatus: true,
    timestamp: '2026-09-20T11:05:00.000Z'
  }
];

export const DEFAULT_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-1',
    userId: 'u3',
    userName: 'Rohan Patil',
    subject: 'Minor damage to ladder rubber foot pad',
    description: 'The rubber foot on the aluminum ladder was slightly chipped upon return.',
    status: 'under_review',
    adminNotes: 'Contacting lender for repair confirmation.',
    createdAt: '2026-09-18T16:00:00.000Z'
  }
];

export const DEFAULT_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'u2',
    reporterName: 'Priya Deshmukh',
    listingId: 'item-3',
    listingTitle: 'Leftover Teak Plywood Planks',
    reason: 'Duplicate Listing',
    details: 'User accidentally submitted duplicate item listing.',
    status: 'pending',
    createdAt: '2026-09-19T09:30:00.000Z'
  }
];
