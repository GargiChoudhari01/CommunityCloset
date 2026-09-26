import type { User, ResourceItem, BorrowRequest, Review, UserBadge, Category, ImpactStats } from '../../src/types';

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Aarav Sharma',
    email: 'aarav.katraj@gmail.com',
    role: 'user',
    phone: '+91 98230 11223',
    bio: 'DIY enthusiast & woodworking hobbyist near Katraj Zoo. Happy to lend tools to neighbors!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Near Rajiv Gandhi Zoological Park, Katraj, Pune',
    lat: 18.4582,
    lng: 73.8512,
    ecoPoints: 420,
    co2SavedKg: 38.5,
    verified: true,
    status: 'active',
    ratingAvg: 4.9,
    reviewsCount: 12,
    itemsSharedCount: 5,
    itemsBorrowedCount: 3,
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
    ratingAvg: 4.8,
    reviewsCount: 16,
    itemsSharedCount: 8,
    itemsBorrowedCount: 4,
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'u3',
    name: 'Rohan Patil',
    email: 'rohan.patil@gmail.com',
    role: 'user',
    phone: '+91 97654 88990',
    bio: 'Civil engineer giving away leftover construction materials from home renovation in Sukhsagar Nagar.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    locationAddress: 'Sukhsagar Nagar, Katraj, Pune',
    lat: 18.4610,
    lng: 73.8530,
    ecoPoints: 340,
    co2SavedKg: 29.0,
    verified: true,
    status: 'active',
    ratingAvg: 5.0,
    reviewsCount: 8,
    itemsSharedCount: 4,
    itemsBorrowedCount: 2,
    createdAt: '2026-03-10T14:30:00.000Z'
  },
  {
    id: 'admin1',
    name: 'Katraj Admin Moderator',
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
    ratingAvg: 5.0,
    reviewsCount: 25,
    itemsSharedCount: 15,
    itemsBorrowedCount: 10,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Power Tools', type: 'tool', icon: 'Wrench', description: 'Drills, saws, sanders, angle grinders' },
  { id: 'cat-2', name: 'Gardening & Lawn', type: 'tool', icon: 'Sprout', description: 'Lawn mowers, pruners, spades, hoses' },
  { id: 'cat-3', name: 'Painting & Masonry', type: 'tool', icon: 'Paintbrush', description: 'Ladders, paint sprayers, trowels' },
  { id: 'cat-4', name: 'Lumber & Wood', type: 'material', icon: 'Trees', description: 'Leftover plywood, wooden planks, timber' },
  { id: 'cat-5', name: 'Tiles & Bricks', type: 'material', icon: 'Boxes', description: 'Ceramic tiles, red bricks, paving blocks' },
  { id: 'cat-6', name: 'Hardware & Plumbing', type: 'material', icon: 'Hammer', description: 'PVC pipes, copper wires, screws, bolts' },
];

export const SEED_LISTINGS: ResourceItem[] = [
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
    quantity: 1,
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
    description: 'Sturdy lightweight 12ft folding aluminum ladder. Perfect for ceiling painting, cleaning water tanks, or roof repairs in Katraj Lake Apt.',
    category: 'Painting & Masonry',
    itemKind: 'tool',
    type: 'lend',
    status: 'available',
    condition: 'Good',
    quantity: 1,
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
    quantity: 4,
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
  }
];

export const SEED_REQUESTS: BorrowRequest[] = [
  {
    id: 'req-101',
    listingId: 'item-1',
    listingTitle: 'Bosch Professional Cordless Impact Drill Set',
    listingImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    requesterId: 'u2',
    requesterName: 'Priya Deshmukh',
    ownerId: 'u1',
    ownerName: 'Aarav Sharma',
    borrowerId: 'u2',
    borrowerName: 'Priya Deshmukh',
    lenderId: 'u1',
    lenderName: 'Aarav Sharma',
    type: 'borrow',
    status: 'accepted',
    message: 'Borrowing to drill wall curtain hooks in Katraj Lake View Apt.',
    startDate: '2026-09-20',
    endDate: '2026-09-24',
    depositPaid: 500,
    createdAt: '2026-09-19T14:00:00.000Z',
    updatedAt: '2026-09-19T14:30:00.000Z'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    listingId: 'item-1',
    listingTitle: 'Bosch Professional Cordless Impact Drill Set',
    reviewerId: 'u2',
    reviewerName: 'Priya Deshmukh',
    reviewerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    revieweeId: 'u1',
    revieweeName: 'Aarav Sharma',
    rating: 5,
    comment: 'Aarav was super helpful! The drill was clean and came with fully charged batteries.',
    createdAt: '2026-09-18T11:00:00.000Z'
  }
];

export const SEED_BADGES: UserBadge[] = [
  {
    id: 'bdg-1',
    userId: 'u1',
    badgeType: 'first_share',
    title: 'First Share Hero',
    description: 'Shared your first tool with Katraj neighbors',
    icon: 'Sparkles',
    earnedAt: '2026-08-01T09:00:00.000Z'
  },
  {
    id: 'bdg-2',
    userId: 'u1',
    badgeType: 'reuse_hero',
    title: 'Reuse Champion',
    description: 'Prevented over 35kg CO₂ through tool lending',
    icon: 'Leaf',
    earnedAt: '2026-08-15T12:00:00.000Z'
  }
];

export const SEED_IMPACT_STATS: ImpactStats = {
  itemsReused: 184,
  kgCo2Diverted: 142.5,
  moneySavedInr: 48200,
  updatedAt: new Date().toISOString()
};

console.log('[Seed Engine] Database seed script ready for execution.');
