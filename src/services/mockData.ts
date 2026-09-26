import type { ResourceItem, User, BorrowRequest, Category, Complaint, Report, NotificationItem, ChatMessage } from '../types';

export const KATRAJ_CENTER = { lat: 18.4575, lng: 73.8508 };

// Start with completely empty database collections as requested - NO FAKE OR MOCK DATA
export const DEFAULT_USERS: User[] = [];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Power Tools', type: 'tool', icon: 'Wrench', description: 'Drills, saws, sanders, angle grinders' },
  { id: 'cat-2', name: 'Gardening & Lawn', type: 'tool', icon: 'Sprout', description: 'Lawn mowers, pruners, spades, hoses' },
  { id: 'cat-3', name: 'Painting & Masonry', type: 'tool', icon: 'Paintbrush', description: 'Ladders, paint sprayers, trowels' },
  { id: 'cat-4', name: 'Lumber & Wood', type: 'material', icon: 'Trees', description: 'Leftover plywood, wooden planks, timber' },
  { id: 'cat-5', name: 'Tiles & Bricks', type: 'material', icon: 'Boxes', description: 'Ceramic tiles, red bricks, paving blocks' },
  { id: 'cat-6', name: 'Hardware & Plumbing', type: 'material', icon: 'Hammer', description: 'PVC pipes, copper wires, screws, bolts' },
  { id: 'cat-7', name: 'Baby & Nursery', type: 'tool', icon: 'Heart', description: 'Cribs, strollers, high chairs, baby care' },
  { id: 'cat-8', name: 'Kitchen & Household', type: 'tool', icon: 'Layers', description: 'Blenders, ladders, party tables, sewing machines' },
];

export const DEFAULT_ITEMS: ResourceItem[] = [];

export const DEFAULT_TRANSACTIONS: BorrowRequest[] = [];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

export const DEFAULT_MESSAGES: ChatMessage[] = [];

export const DEFAULT_COMPLAINTS: Complaint[] = [];

export const DEFAULT_REPORTS: Report[] = [];
