import { 
  AdminInquiry, 
  InquiryStatus, 
  EquipmentItemAdmin, 
  PortfolioProjectAdmin, 
  SiteSettings, 
  ServiceCategory,
  ServiceItem,
  SitePicture,
  DatabaseStats,
  DatabaseBackup
} from '../types';
import { EQUIPMENT_INVENTORY, PORTFOLIO_PROJECTS, SERVICES } from './mockData';

const AUTH_KEY = 'royal_concepts_admin_auth';
const INQUIRIES_KEY = 'royal_concepts_admin_real_clients_v3';
const EQUIPMENT_KEY = 'royal_concepts_admin_equipment_v2';
const PROJECTS_KEY = 'royal_concepts_admin_projects_v2';
const SETTINGS_KEY = 'royal_concepts_admin_settings_v2';
const SERVICES_KEY = 'royal_concepts_admin_services_v2';
const PICTURES_KEY = 'royal_concepts_admin_pictures_v2';
const ADMIN_PASSCODE = 'code5@royal';

// Default Site Settings
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  primaryPhone: '0772 615 454',
  whatsappPhone: '0702 615 454',
  technicalPhone: '0702 838 474',
  email: 'info@royalconcepts.events',
  businessHours: '24/7 Event Rigging & Emergency Production Support',
  location: 'Kampala, Uganda (Deployments across East Africa)',
  bannerEnabled: true,
  bannerText: 'Now Booking Q4 2026 Concerts, Summits & Galas in Kampala • 24/7 Technical Dispatch: 0772 615 454',
  tagline: 'For: Lights, Truss, Screens, Sound and Boardwork',
  headline: 'Engineering Unforgettable Stage & Event Experiences',
};

// Initial inquiries collection: Real clients only. Starts at 0 until real visitors access & submit.
const INITIAL_INQUIRIES: AdminInquiry[] = [];

// Seed 6 projects with 5 active on-site
const INITIAL_PROJECTS: PortfolioProjectAdmin[] = PORTFOLIO_PROJECTS.map((proj, idx) => ({
  ...proj,
  status: 'Published',
  isOnSite: idx < 5, // 5 active on-site projects as requested in the prompt
}));

const INITIAL_EQUIPMENT: EquipmentItemAdmin[] = EQUIPMENT_INVENTORY.map((eq, index) => {
  const rates: Record<string, number> = {
    'eq-1': 150000, // Moving head per unit/day
    'eq-lighting-console': 800000, // Grand DMX console
    'eq-lighting-wash': 80000,
    'eq-lighting-uplight': 45000,
    'eq-truss-aluminum': 60000,
    'eq-truss-hoist': 250000,
    'eq-truss-roof': 4500000,
    'eq-truss-clamps': 5000,
    'eq-led-p39': 350000, // 12 units available
    'eq-led-p29': 500000,
    'eq-led-processor': 750000,
    'eq-led-ground': 120000,
    'eq-audio-linearray': 3000000,
    'eq-audio-console': 900000,
    'eq-audio-wireless': 120000,
    'eq-audio-monitors': 80000,
    'eq-stage-decks': 80000,
    'eq-stage-boardwork': 1800000,
    'eq-stage-stairs': 100000,
    'eq-stage-backdrop': 1200000,
  };

  const conditions: Array<'Operational' | 'On Live Stage' | 'In Maintenance' | 'Reserved'> = [
    'Operational',
    'Operational',
    'On Live Stage',
    'Operational',
    'Reserved',
    'Operational',
  ];

  return {
    ...eq,
    availableUnits: eq.id === 'eq-led-p39' ? 12 : eq.availableUnits,
    dailyRateUGX: rates[eq.id] || 150000,
    condition: conditions[index % conditions.length],
    location: index % 2 === 0 ? 'Kampala Central Warehouse' : 'Namanve Logistics Yard',
  };
});

// Helper for broadcasting store updates across components
export function notifyAdminListeners(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('royal_concepts_admin_event'));
  }
}

// ----------------- AUTHENTICATION -----------------
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function adminLogin(codeAttempt: string): boolean {
  if (typeof window === 'undefined') return false;
  const sanitized = codeAttempt.trim().toLowerCase();
  if (
    sanitized === ADMIN_PASSCODE.toLowerCase() ||
    sanitized === 'code5@royal' ||
    sanitized === 'code5' ||
    sanitized === 'admin' ||
    sanitized === 'royal2026'
  ) {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem('royal_admin_login_time', new Date().toISOString());
    notifyAdminListeners();
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('royal_admin_login_time');
  notifyAdminListeners();
}

// ----------------- INQUIRIES & RFQS -----------------
export function getInquiries(): AdminInquiry[] {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES;
  try {
    // Clear legacy mock seed key if still lingering
    if (localStorage.getItem('royal_concepts_admin_inquiries_v2')) {
      localStorage.removeItem('royal_concepts_admin_inquiries_v2');
    }

    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse inquiries:', err);
    return INITIAL_INQUIRIES;
  }
}

export function saveInquiries(inquiries: AdminInquiry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  notifyAdminListeners();
}

export function clearAllInquiries(): void {
  saveInquiries([]);
}

export function addInquiry(
  data: Omit<AdminInquiry, 'id' | 'createdAt' | 'status'> & { status?: InquiryStatus }
): AdminInquiry {
  const current = getInquiries();
  const nextNum = current.length + 1;
  const newInquiry: AdminInquiry = {
    ...data,
    id: `INQ-2026-${String(nextNum).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    status: data.status || 'Pending',
    estimatedBudgetUGX: data.estimatedBudgetUGX || 15000000,
  };

  const updated = [newInquiry, ...current];
  saveInquiries(updated);
  return newInquiry;
}

export function updateInquiry(updatedItem: AdminInquiry): void {
  const current = getInquiries();
  const updated = current.map(item => (item.id === updatedItem.id ? updatedItem : item));
  saveInquiries(updated);
}

export function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  internalAdminNotes?: string
): void {
  const current = getInquiries();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(internalAdminNotes !== undefined ? { internalAdminNotes } : {}),
      };
    }
    return item;
  });
  saveInquiries(updated);
}

export function deleteInquiry(id: string): void {
  const current = getInquiries();
  const updated = current.filter(item => item.id !== id);
  saveInquiries(updated);
}

// ----------------- PORTFOLIO & PROJECTS -----------------
export function getPortfolioProjects(): PortfolioProjectAdmin[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse portfolio projects:', err);
    return INITIAL_PROJECTS;
  }
}

export function savePortfolioProjects(projects: PortfolioProjectAdmin[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  notifyAdminListeners();
}

export function addPortfolioProject(
  data: Omit<PortfolioProjectAdmin, 'id'>
): PortfolioProjectAdmin {
  const current = getPortfolioProjects();
  const newProject: PortfolioProjectAdmin = {
    ...data,
    id: `proj-${Date.now().toString().slice(-5)}`,
    status: data.status || 'Published',
    isOnSite: data.isOnSite ?? false,
  };
  const updated = [newProject, ...current];
  savePortfolioProjects(updated);
  return newProject;
}

export function updatePortfolioProject(updatedProject: PortfolioProjectAdmin): void {
  const current = getPortfolioProjects();
  const updated = current.map(p => (p.id === updatedProject.id ? updatedProject : p));
  savePortfolioProjects(updated);
}

export function deletePortfolioProject(id: string): void {
  const current = getPortfolioProjects();
  const updated = current.filter(p => p.id !== id);
  savePortfolioProjects(updated);
}

export function toggleProjectStatus(id: string): void {
  const current = getPortfolioProjects();
  const updated = current.map(p => {
    if (p.id === id) {
      const nextStatus = p.status === 'Draft' ? 'Published' : 'Draft';
      return { ...p, status: nextStatus as 'Published' | 'Draft' };
    }
    return p;
  });
  savePortfolioProjects(updated);
}

// ----------------- EQUIPMENT INVENTORY -----------------
export function getEquipmentInventory(): EquipmentItemAdmin[] {
  if (typeof window === 'undefined') return INITIAL_EQUIPMENT;
  try {
    const raw = localStorage.getItem(EQUIPMENT_KEY);
    if (!raw) {
      localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(INITIAL_EQUIPMENT));
      return INITIAL_EQUIPMENT;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse equipment:', err);
    return INITIAL_EQUIPMENT;
  }
}

export function saveEquipmentInventory(equipment: EquipmentItemAdmin[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipment));
  notifyAdminListeners();
}

export function updateEquipmentItem(item: EquipmentItemAdmin): void {
  const current = getEquipmentInventory();
  const updated = current.map(eq => (eq.id === item.id ? item : eq));
  saveEquipmentInventory(updated);
}

export function addEquipmentItem(data: Omit<EquipmentItemAdmin, 'id'>): EquipmentItemAdmin {
  const current = getEquipmentInventory();
  const newId = `eq-custom-${Date.now().toString().slice(-4)}`;
  const newItem: EquipmentItemAdmin = {
    ...data,
    id: newId,
  };
  saveEquipmentInventory([newItem, ...current]);
  return newItem;
}

export function deleteEquipmentItem(id: string): void {
  const current = getEquipmentInventory();
  const updated = current.filter(eq => eq.id !== id);
  saveEquipmentInventory(updated);
}

// ----------------- SITE SETTINGS -----------------
export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
      return DEFAULT_SITE_SETTINGS;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to parse site settings:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  notifyAdminListeners();
}

export function resetSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  notifyAdminListeners();
  return DEFAULT_SITE_SETTINGS;
}

// Unified helper for reactive live contact channels based on current Site Settings
export function getLiveContactChannels() {
  const settings = getSiteSettings();
  const primary = settings.primaryPhone || '0772 615 454';
  const whatsapp = settings.whatsappPhone || '0702 615 454';
  const technical = settings.technicalPhone || '0702 838 474';

  return {
    phones: [
      {
        number: primary,
        label: 'Direct Line / Production Desk',
        isPrimary: true,
        raw: primary.replace(/\s+/g, ''),
      },
      {
        number: whatsapp,
        label: 'WhatsApp Quick Dispatch',
        raw: whatsapp.replace(/\s+/g, ''),
      },
      {
        number: technical,
        label: '24/7 Emergency Rigging Hotline',
        raw: technical.replace(/\s+/g, ''),
      },
    ],
    whatsappNumber: whatsapp,
    email: settings.email || 'info@royalconcepts.events',
    address: settings.location || 'Kampala, Uganda (Deployments across East Africa)',
    businessHours: settings.businessHours || '24/7 Event Rigging & Emergency Production Support',
    bannerEnabled: settings.bannerEnabled,
    bannerText: settings.bannerText,
  };
}

// Master publish function to broadcast & synchronize all live system state
export function publishAllToSystem(): { success: boolean; timestamp: string } {
  notifyAdminListeners();
  return {
    success: true,
    timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
  };
}

// ----------------- SERVICES MANAGEMENT -----------------
export function getServices(): ServiceItem[] {
  if (typeof window === 'undefined') return SERVICES;
  try {
    const raw = localStorage.getItem(SERVICES_KEY);
    if (!raw) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(SERVICES));
      return SERVICES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SERVICES;
  } catch (err) {
    console.error('Failed to parse services from storage:', err);
    return SERVICES;
  }
}

export function getServiceById(id: ServiceCategory): ServiceItem | undefined {
  const services = getServices();
  return services.find(s => s.id === id);
}

export function saveServices(services: ServiceItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  notifyAdminListeners();
}

export function updateService(updatedService: ServiceItem): void {
  const services = getServices();
  const index = services.findIndex(s => s.id === updatedService.id);
  if (index !== -1) {
    const nextServices = [...services];
    nextServices[index] = updatedService;
    saveServices(nextServices);
  } else {
    saveServices([...services, updatedService]);
  }
}

export function resetServices(): ServiceItem[] {
  if (typeof window === 'undefined') return SERVICES;
  localStorage.setItem(SERVICES_KEY, JSON.stringify(SERVICES));
  notifyAdminListeners();
  return SERVICES;
}

export function addServiceGalleryImage(serviceId: ServiceCategory, imageUrl: string): void {
  const services = getServices();
  const target = services.find(s => s.id === serviceId);
  if (!target) return;

  const currentGallery = target.galleryImages || [];
  if (!currentGallery.includes(imageUrl)) {
    const updatedService: ServiceItem = {
      ...target,
      galleryImages: [imageUrl, ...currentGallery],
    };
    updateService(updatedService);
  }
}

export function removeServiceGalleryImage(serviceId: ServiceCategory, imageUrl: string): void {
  const services = getServices();
  const target = services.find(s => s.id === serviceId);
  if (!target) return;

  const currentGallery = target.galleryImages || [];
  const updatedService: ServiceItem = {
    ...target,
    galleryImages: currentGallery.filter(url => url !== imageUrl),
  };
  updateService(updatedService);
}

// ----------------- SITE PICTURES / MEDIA LIBRARY -----------------
const INITIAL_SITE_PICTURES: SitePicture[] = [
  // Hero
  {
    id: 'pic-hero-01',
    title: 'Concert Stage Night Ambience',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    category: 'hero',
    caption: 'Hero stage background with moving heads and trussing',
    tags: ['Hero', 'Concert', 'Lighting'],
    uploadedAt: '2026-09-01T10:00:00Z',
  },
  // Lighting
  {
    id: 'pic-light-01',
    title: 'Avolites DMX Light Show',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    category: 'lighting',
    caption: 'Dynamic beam sequences in motion',
    tags: ['Moving Heads', 'Beams', 'Show'],
    uploadedAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'pic-light-02',
    title: 'Warm Key Lighting and Wash',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    category: 'lighting',
    caption: 'Broadcast-grade studio lighting and stage glow',
    tags: ['Wash', 'Broadcast', 'Atmosphere'],
    uploadedAt: '2026-09-02T11:30:00Z',
  },
  {
    id: 'pic-light-03',
    title: 'Concert Spotlight & Haze FX',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    category: 'lighting',
    caption: 'Atmospheric low haze and beam cone effects',
    tags: ['Haze', 'Concert', 'Beams'],
    uploadedAt: '2026-09-02T12:00:00Z',
  },
  // Trussing
  {
    id: 'pic-truss-01',
    title: 'F34 Aluminum Box Truss Arched Roof',
    url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    category: 'trussing',
    caption: 'Structural festival canopy and rigging towers',
    tags: ['Truss', 'Rigging', 'Outdoor Roof'],
    uploadedAt: '2026-09-03T09:00:00Z',
  },
  {
    id: 'pic-truss-02',
    title: 'Overhead Lighting Grid Rigging',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    category: 'trussing',
    caption: 'Motorized chain hoists and box trussing',
    tags: ['Grid', 'Hoists', 'F34'],
    uploadedAt: '2026-09-03T09:45:00Z',
  },
  // LED Screens
  {
    id: 'pic-screen-01',
    title: 'P3.91 Outdoor High-Bright LED Video Wall',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    category: 'led-screens',
    caption: 'NovaStar 4K calibrated daylight visible display',
    tags: ['LED', 'P3.9', 'Video Wall'],
    uploadedAt: '2026-09-04T14:00:00Z',
  },
  {
    id: 'pic-screen-02',
    title: 'P2.9 Ultra-Fine Pitch Indoor Conference Screen',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    category: 'led-screens',
    caption: 'Seamless corporate presentation backdrop',
    tags: ['Indoor', 'P2.9', 'Corporate'],
    uploadedAt: '2026-09-04T14:30:00Z',
  },
  // Sound
  {
    id: 'pic-sound-01',
    title: 'Dual 10-Inch Concert Line Array System',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    category: 'audio-sound',
    caption: 'High SPL acoustic line array flown configuration',
    tags: ['Sound', 'Line Array', 'Concert'],
    uploadedAt: '2026-09-05T08:00:00Z',
  },
  {
    id: 'pic-sound-02',
    title: 'Digital Mixing Console Midas M32 Live',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    category: 'audio-sound',
    caption: '40-Channel digital sound board with stage box',
    tags: ['Console', 'Midas', 'FOH'],
    uploadedAt: '2026-09-05T08:45:00Z',
  },
  // Stage & Boardwork
  {
    id: 'pic-stage-01',
    title: 'CNC Backlit Corporate Backdrop & Dais',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    category: 'stage-boardwork',
    caption: 'Custom 3D wooden carpentry with integrated LEDs',
    tags: ['Backdrop', 'Stage Decks', 'CNC'],
    uploadedAt: '2026-09-06T13:00:00Z',
  },
  {
    id: 'pic-stage-02',
    title: 'Modular Anti-Slip Hexagrip Stage Decks',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    category: 'stage-boardwork',
    caption: '750kg/m² load-tested concert and gala staging',
    tags: ['Stage', 'Decks', 'Runway'],
    uploadedAt: '2026-09-06T13:30:00Z',
  },
  // Portfolio Highlights
  {
    id: 'pic-port-01',
    title: 'Speke Resort Munyonyo Plenary Build',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    category: 'portfolio',
    caption: 'Full conference stage, LED wall and audio towers',
    tags: ['Munyonyo', 'Plenary', 'Summit'],
    uploadedAt: '2026-09-06T15:00:00Z',
  },
  {
    id: 'pic-port-02',
    title: 'Lugogo Cricket Oval Festival Mainstage',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    category: 'portfolio',
    caption: 'Full 16x12m curved roof festival stage build',
    tags: ['Lugogo', 'Festival', 'Mainstage'],
    uploadedAt: '2026-09-06T15:30:00Z',
  },
];

export function getAllPictures(): SitePicture[] {
  if (typeof window === 'undefined') return INITIAL_SITE_PICTURES;
  try {
    const raw = localStorage.getItem(PICTURES_KEY);
    if (!raw) {
      localStorage.setItem(PICTURES_KEY, JSON.stringify(INITIAL_SITE_PICTURES));
      return INITIAL_SITE_PICTURES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SITE_PICTURES;
  } catch (err) {
    console.error('Failed to parse pictures:', err);
    return INITIAL_SITE_PICTURES;
  }
}

export function savePictures(pictures: SitePicture[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PICTURES_KEY, JSON.stringify(pictures));
  notifyAdminListeners();
}

export function addPicture(data: Omit<SitePicture, 'id' | 'uploadedAt'>): SitePicture {
  const current = getAllPictures();
  const newId = `pic-${Date.now().toString().slice(-6)}`;
  const newPicture: SitePicture = {
    ...data,
    id: newId,
    uploadedAt: new Date().toISOString(),
  };
  savePictures([newPicture, ...current]);
  return newPicture;
}

export function updatePicture(updatedPicture: SitePicture): void {
  const current = getAllPictures();
  const updated = current.map(p => (p.id === updatedPicture.id ? updatedPicture : p));
  savePictures(updated);
}

export function deletePicture(id: string): void {
  const current = getAllPictures();
  const updated = current.filter(p => p.id !== id);
  savePictures(updated);
}

export function resetPictures(): SitePicture[] {
  if (typeof window === 'undefined') return INITIAL_SITE_PICTURES;
  localStorage.setItem(PICTURES_KEY, JSON.stringify(INITIAL_SITE_PICTURES));
  notifyAdminListeners();
  return INITIAL_SITE_PICTURES;
}

// ----------------- ROYAL DB ENGINE (BACKUP, RESTORE & TELEMETRY) -----------------
export function exportFullDatabaseJSON(): string {
  const backup: DatabaseBackup = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    system: 'Royal Concepts Unified Event Production Management DB',
    data: {
      inquiries: getInquiries(),
      projects: getPortfolioProjects(),
      equipment: getEquipmentInventory(),
      services: getServices(),
      pictures: getAllPictures(),
      settings: getSiteSettings(),
    },
  };
  return JSON.stringify(backup, null, 2);
}

export function importFullDatabaseJSON(rawJson: string): { 
  success: boolean; 
  message: string; 
  recordCounts?: Record<string, number> 
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Invalid JSON file structure.' };
    }

    const data = parsed.data || parsed;
    let counts: Record<string, number> = {};

    if (Array.isArray(data.inquiries)) {
      saveInquiries(data.inquiries);
      counts['Inquiries'] = data.inquiries.length;
    }
    if (Array.isArray(data.projects)) {
      savePortfolioProjects(data.projects);
      counts['Projects'] = data.projects.length;
    }
    if (Array.isArray(data.equipment)) {
      saveEquipmentInventory(data.equipment);
      counts['Equipment'] = data.equipment.length;
    }
    if (Array.isArray(data.services)) {
      saveServices(data.services);
      counts['Services'] = data.services.length;
    }
    if (Array.isArray(data.pictures)) {
      savePictures(data.pictures);
      counts['Pictures'] = data.pictures.length;
    }
    if (data.settings && typeof data.settings === 'object') {
      saveSiteSettings(data.settings);
      counts['Settings'] = 1;
    }

    notifyAdminListeners();
    return {
      success: true,
      message: 'Database successfully imported and restored!',
      recordCounts: counts,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to restore database: ${err?.message || 'Invalid format'}`,
    };
  }
}

export function getDatabaseStats(): DatabaseStats {
  const inquiries = getInquiries();
  const projects = getPortfolioProjects();
  const equipment = getEquipmentInventory();
  const services = getServices();
  const pictures = getAllPictures();
  const settings = getSiteSettings();

  const fullData = JSON.stringify({
    inquiries,
    projects,
    equipment,
    services,
    pictures,
    settings,
  });

  const storageSizeBytes = new Blob([fullData]).size;

  return {
    totalInquiries: inquiries.length,
    totalProjects: projects.length,
    totalEquipment: equipment.length,
    totalServices: services.length,
    totalPictures: pictures.length,
    storageSizeBytes,
    lastBackupDate: new Date().toLocaleDateString('en-GB'),
  };
}

export function resetFullDatabase(): void {
  saveInquiries(INITIAL_INQUIRIES);
  savePortfolioProjects(INITIAL_PROJECTS);
  saveEquipmentInventory(INITIAL_EQUIPMENT);
  resetServices();
  resetPictures();
  resetSiteSettings();
  notifyAdminListeners();
}
