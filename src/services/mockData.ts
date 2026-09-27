import type { ResourceItem, User, BorrowRequest, Category, Complaint, Report, NotificationItem, ChatMessage } from '../types';

export const KATRAJ_CENTER = { lat: 18.4575, lng: 73.8508 };

// Start with completely empty database collections as requested - NO FAKE OR MOCK DATA
export const DEFAULT_USERS: User[] = [];

export const DEFAULT_CATEGORIES: Category[] = [

  { id: 'cat-1', name: 'Clothing & Accessories', type: 'material', icon: 'Shirt', description: 'Clothes, shoes, bags, and accessories' },

  { id: 'cat-2', name: 'Books & Study', type: 'material', icon: 'BookOpen', description: 'Books, textbooks, notebooks, and study materials' },

  { id: 'cat-3', name: 'Furniture', type: 'material', icon: 'Armchair', description: 'Chairs, tables, shelves, and other furniture' },

  { id: 'cat-4', name: 'Kitchen Items', type: 'tool', icon: 'Utensils', description: 'Cookware, utensils, appliances, and kitchen items' },

  { id: 'cat-5', name: 'Electronics', type: 'tool', icon: 'Laptop', description: 'Laptops, chargers, speakers, and electronic devices' },

  { id: 'cat-6', name: 'Sports & Fitness', type: 'tool', icon: 'Dumbbell', description: 'Sports equipment, fitness gear, and accessories' },

  { id: 'cat-7', name: 'Toys & Games', type: 'material', icon: 'Gamepad2', description: 'Toys, board games, puzzles, and recreational items' },

  { id: 'cat-8', name: 'Home & Utility', type: 'tool', icon: 'House', description: 'Household items, cleaning tools, and useful utilities' },

];

export const DEFAULT_ITEMS: ResourceItem[] = [];

export const DEFAULT_TRANSACTIONS: BorrowRequest[] = [];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

export const DEFAULT_MESSAGES: ChatMessage[] = [];

export const DEFAULT_COMPLAINTS: Complaint[] = [];

export const DEFAULT_REPORTS: Report[] = [];
