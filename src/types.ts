export type ServiceCategory = 
  | 'lighting' 
  | 'trussing' 
  | 'led-screens' 
  | 'audio-sound' 
  | 'stage-boardwork';

export interface ServiceStat {
  label: string;
  value: string;
  helper?: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: ServiceCategory;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  iconName: string;
  specs: string[];
  capabilities: string[];
  imageUrl: string;
  galleryImages: string[];
  accentColor: string;
  heroStats: ServiceStat[];
  idealFor: string[];
  safetyStandards: string[];
  faqs: ServiceFaq[];
}

export type PortfolioCategory = 'All' | 'Concerts' | 'Corporate Events' | 'Stage Builds' | 'Exhibitions';

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'Concerts' | 'Corporate Events' | 'Stage Builds' | 'Exhibitions';
  client: string;
  venue: string;
  date: string;
  attendance: string;
  imageUrl: string;
  description: string;
  equipmentUsed: string[];
  highlight: string;
}

export interface EquipmentSpec {
  id: string;
  name: string;
  category: ServiceCategory;
  model: string;
  description: string;
  specs: string[];
  availableUnits: number;
  featured?: boolean;
}

export interface QuoteFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  eventDate: string;
  venueLocation: string;
  eventType: string;
  estimatedAudience: string;
  selectedServices: ServiceCategory[];
  additionalNotes: string;
}

export type InquiryStatus = 'Pending' | 'Contacted' | 'Confirmed' | 'In Logistics' | 'Completed' | 'Cancelled';

export interface AdminInquiry {
  id: string;
  createdAt: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  eventDate: string;
  venueLocation: string;
  eventType: string;
  estimatedAudience: string;
  selectedServices: ServiceCategory[];
  estimatedBudgetUGX?: number;
  status: InquiryStatus;
  notes?: string;
  internalAdminNotes?: string;
  source: 'Quote Modal' | 'Contact Form' | 'Admin Entry' | 'Audio Bot' | 'WhatsApp Direct';
}

export interface EquipmentItemAdmin extends EquipmentSpec {
  dailyRateUGX: number;
  condition: 'Operational' | 'On Live Stage' | 'In Maintenance' | 'Reserved';
  location: string;
}

export interface PortfolioProjectAdmin extends PortfolioProject {
  status?: 'Published' | 'Draft';
  isOnSite?: boolean;
}

export interface SiteSettings {
  primaryPhone: string;
  whatsappPhone: string;
  technicalPhone: string;
  email: string;
  businessHours: string;
  location: string;
  bannerEnabled: boolean;
  bannerText: string;
  tagline: string;
  headline: string;
}
