
import firebase from 'firebase/compat/app';

// --- primitive types ---
export interface KeyValue {
  label: string;
  value: string;
}

// --- Content & Ad Types ---
export interface ExecutionSection {
  title: string;
  fields: KeyValue[];
}

export interface ContentSection {
  title: string;
  content: string | string[]; 
}

export interface AdCardData {
  id: string;
  title: string;
  description: string; 
  price: string; 
  imageUrl: string;
  images?: string[]; 
  category: 'top' | 'more';
  
  // Detailed Page Data
  stats: {
    usedFor: string;
    adType: string;
    leadTime: string;
    span: string;
  };
  pricing: {
    original: string;
    discounted: string;
    minBilling: string;
  };
  executionDetails: ExecutionSection[];
  contentSections: ContentSection[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export interface AdPlatformData {
  platformName: string;
  logoUrl: string;
  heroBackgroundImageUrl: string;
  homeSection: {
    title: string;
    description: string;
    buttonText: string;
  };
  header: {
    monthlyUsers: string;
    platformType: string;
    budgetDescription: string;
    pricingModels: string;
    bidType: string;
    categories: string;
  };
  intro: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  cards: AdCardData[];
  faqs: FaqItem[];
}

// --- Service Types ---
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  btnText: string;
  imageUrl?: string; 
}

export interface ServiceCategory {
  id: string;
  categoryName: string;
  items: string[];
}

// --- Site Content Data ---
export interface SiteData {
  brand: {
    line1: string;
    line2: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string;
  };
  services: {
    topServices: ServiceItem[];
    moreServices: ServiceCategory[];
  };
  stats: {
    mainText: string;
    stat1: { val: string; label: string };
    stat2: { val: string; label: string };
    stat3: { val: string; label: string };
    ctaTitle: string;
    ctaDescription: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    instagram: string;
    linkedin: string;
  };
  adPlatform: AdPlatformData;
}

// --- User & Commerce Types ---
export interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

export interface CartItem extends AdCardData {
  cartId: string; // Unique ID for the item in the cart
  dateAdded: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: CartItem[];
  totalAmount: string; 
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  dateOrdered: any; // Firestore timestamp
}

export interface Consultation {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    status: 'New' | 'Contacted' | 'Converted';
    createdAt: any;
}

// --- Chat Types ---
export interface ChatSession {
  id: string; 
  userName: string;
  lastMessage: string;
  lastUpdated: any;
  userId: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
  isAdmin: boolean;
}
