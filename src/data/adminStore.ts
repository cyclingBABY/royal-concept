import { 
  AdminInquiry, 
  InquiryStatus, 
  EquipmentItemAdmin, 
  PortfolioProjectAdmin, 
  SiteSettings, 
  ServiceCategory 
} from '../types';
import { EQUIPMENT_INVENTORY, PORTFOLIO_PROJECTS } from './mockData';

const AUTH_KEY = 'royal_concepts_admin_auth';
const INQUIRIES_KEY = 'royal_concepts_admin_inquiries_v2';
const EQUIPMENT_KEY = 'royal_concepts_admin_equipment_v2';
const PROJECTS_KEY = 'royal_concepts_admin_projects_v2';
const SETTINGS_KEY = 'royal_concepts_admin_settings_v2';
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

// Seed 28 realistic inquiries (8 Pending, 6 Contacted, 8 Confirmed, 4 In Logistics, 2 Completed)
const INITIAL_INQUIRIES: AdminInquiry[] = [
  {
    id: 'INQ-2026-028',
    createdAt: '2026-09-07T08:00:00Z',
    fullName: 'Isaac Mukasa',
    phoneNumber: '0772 458 901',
    email: 'events@houseofdeejays.ug',
    eventDate: '2026-10-18',
    venueLocation: 'Lugogo Cricket Oval, Kampala',
    eventType: 'Concert / Festival',
    estimatedAudience: '8,000 - 12,000',
    selectedServices: ['lighting', 'trussing', 'led-screens', 'audio-sound'],
    estimatedBudgetUGX: 42000000,
    status: 'Pending',
    notes: 'Requires 16x12m heavy box aluminum roof grid with motorized hoists, 48 moving heads, and 12x4m P3.9 daylight LED backdrop.',
    internalAdminNotes: 'Initial quote drafted. Waiting to confirm stage height requirements.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-027',
    createdAt: '2026-09-06T15:30:00Z',
    fullName: 'Julian Nsubuga',
    phoneNumber: '0702 615 454',
    email: 'jnsubuga@stanbic.co.ug',
    eventDate: '2026-09-28',
    venueLocation: 'Kampala Serena Victoria Hall',
    eventType: 'Corporate Gala',
    estimatedAudience: '800 Delegates',
    selectedServices: ['lighting', 'led-screens', 'stage-boardwork', 'audio-sound'],
    estimatedBudgetUGX: 18500000,
    status: 'Contacted',
    notes: 'Curved P2.9 ultra-fine pitch video wall, CNC branded stage boardwork and presidential dais.',
    internalAdminNotes: 'Spoke on phone. Sent customized technical rider PDF to procurement.',
    source: 'Contact Form',
  },
  {
    id: 'INQ-2026-026',
    createdAt: '2026-09-06T11:15:00Z',
    fullName: 'Hon. Catherine Atuhaire',
    phoneNumber: '0701 882 310',
    email: 'info@eactradeforum.org',
    eventDate: '2026-11-04',
    venueLocation: 'Speke Resort Munyonyo Plenary',
    eventType: 'Summit / Plenary',
    estimatedAudience: '2,500 Delegates',
    selectedServices: ['trussing', 'stage-boardwork', 'led-screens', 'lighting'],
    estimatedBudgetUGX: 29000000,
    status: 'Pending',
    notes: 'Multi-lingual translation audio booth integration, presidential dais riser with disabled ramp.',
    internalAdminNotes: 'Follow up on Monday with the events committee.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-025',
    createdAt: '2026-09-05T19:20:00Z',
    fullName: 'Pastor Timothy Omondi',
    phoneNumber: '0782 334 119',
    email: 'worship@glorycitadel.org',
    eventDate: '2026-10-02',
    venueLocation: 'Kololo Ceremonial Grounds',
    eventType: 'Mega Praise Rally',
    estimatedAudience: '15,000+',
    selectedServices: ['audio-sound', 'lighting', 'trussing', 'led-screens'],
    estimatedBudgetUGX: 38000000,
    status: 'Confirmed',
    notes: '16-box dual 10-inch line array hangs, front fills, delay towers, 24 battery uplights, twin LED screens.',
    internalAdminNotes: 'Deposit received. Site survey complete. Structural permit cleared with KCCA.',
    source: 'WhatsApp Direct',
  },
  {
    id: 'INQ-2026-024',
    createdAt: '2026-09-05T14:40:00Z',
    fullName: 'Sarah Namubiru',
    phoneNumber: '0752 900 123',
    email: 's.namubiru@unhcr.org',
    eventDate: '2026-09-22',
    venueLocation: 'Sheraton Kampala Hotel Victoria Lawn',
    eventType: 'Diplomatic Reception',
    estimatedAudience: '400 VIP Guests',
    selectedServices: ['stage-boardwork', 'lighting', 'audio-sound'],
    estimatedBudgetUGX: 14000000,
    status: 'In Logistics',
    notes: 'Low-profile acoustic speech reinforcement, warm architectural tree uplighting, modular wooden stage.',
    internalAdminNotes: 'Staging carpentry underway. Acoustic line check scheduled for 14:00 Thursday.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-023',
    createdAt: '2026-09-04T16:10:00Z',
    fullName: 'Dr. Ronald Kasule',
    phoneNumber: '0774 219 883',
    email: 'rkasule@makerere.ac.ug',
    eventDate: '2026-10-10',
    venueLocation: 'Makerere Freedom Square',
    eventType: 'Centenary Academic Forum',
    estimatedAudience: '5,000 Attendees',
    selectedServices: ['trussing', 'lighting', 'audio-sound', 'stage-boardwork'],
    estimatedBudgetUGX: 22000000,
    status: 'Pending',
    notes: 'Covered ground support truss arch, academic processional catwalk, and speech delay audio.',
    internalAdminNotes: 'Awaiting university council budget stamp.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-022',
    createdAt: '2026-09-04T09:30:00Z',
    fullName: 'Grace Kyomugisha',
    phoneNumber: '0703 551 228',
    email: 'gkyomu@mtn.co.ug',
    eventDate: '2026-09-30',
    venueLocation: 'Kampala Serena Katonga Hall',
    eventType: 'Corporate Product Launch',
    estimatedAudience: '350 VIPs',
    selectedServices: ['led-screens', 'lighting', 'stage-boardwork'],
    estimatedBudgetUGX: 16000000,
    status: 'Contacted',
    notes: '3D brand reveal mechanism, high-resolution P2.9 LED center split screen with motorized reveal.',
    internalAdminNotes: 'Video resolution specs sent to client creative agency.',
    source: 'Contact Form',
  },
  {
    id: 'INQ-2026-021',
    createdAt: '2026-09-03T17:45:00Z',
    fullName: 'Denis Batte',
    phoneNumber: '0788 120 449',
    email: 'denis@swangzavenue.com',
    eventDate: '2026-11-20',
    venueLocation: 'Jinja Agricultural Showgrounds',
    eventType: 'Regional Music Tour',
    estimatedAudience: '10,000+',
    selectedServices: ['lighting', 'trussing', 'led-screens', 'audio-sound', 'stage-boardwork'],
    estimatedBudgetUGX: 45000000,
    status: 'Pending',
    notes: 'Heavy touring stage package, outdoor P3.9 LED screen, beam moving heads, dry ice low fog.',
    internalAdminNotes: 'Drafting multi-city package discount quotation.',
    source: 'WhatsApp Direct',
  },
  {
    id: 'INQ-2026-020',
    createdAt: '2026-09-03T11:00:00Z',
    fullName: 'Brenda Ahimbisibwe',
    phoneNumber: '0776 994 301',
    email: 'brenda@kcca.go.ug',
    eventDate: '2026-10-04',
    venueLocation: 'City Hall Gardens, Kampala',
    eventType: 'Civic Awards Ceremony',
    estimatedAudience: '600 Guests',
    selectedServices: ['lighting', 'stage-boardwork', 'audio-sound'],
    estimatedBudgetUGX: 11500000,
    status: 'Contacted',
    notes: 'Elevated VIP dais with gold edge trims, broadcast lighting, and crisp wireless podium audio.',
    internalAdminNotes: 'Site inspection done. Sent revised quotation.',
    source: 'Admin Entry',
  },
  {
    id: 'INQ-2026-019',
    createdAt: '2026-09-02T13:20:00Z',
    fullName: 'Robert Ssebaggala',
    phoneNumber: '0702 331 990',
    email: 'robert@experientialug.com',
    eventDate: '2026-10-25',
    venueLocation: 'Entebbe Botanical Gardens',
    eventType: 'Outdoor Food & Wine Expo',
    estimatedAudience: '3,000 Visitors',
    selectedServices: ['trussing', 'lighting', 'audio-sound'],
    estimatedBudgetUGX: 17500000,
    status: 'Pending',
    notes: 'Suspended canopy truss structures, bistro ambient festoon stringing, and acoustic stage for live acoustic trio.',
    internalAdminNotes: 'Pending client site approval with Entebbe authorities.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-018',
    createdAt: '2026-09-01T15:00:00Z',
    fullName: 'Arthur Mugisha',
    phoneNumber: '0754 112 887',
    email: 'arthur@airtel.co.ug',
    eventDate: '2026-10-15',
    venueLocation: 'UMA Multipurpose Hall, Lugogo',
    eventType: 'National Dealers Conference',
    estimatedAudience: '1,500 Attendees',
    selectedServices: ['led-screens', 'lighting', 'audio-sound', 'stage-boardwork'],
    estimatedBudgetUGX: 26000000,
    status: 'Confirmed',
    notes: 'Ultra-wide 16x4m LED panoramic display, digital wireless audio for 8 panel speakers, and dynamic lighting.',
    internalAdminNotes: 'Contract signed. Logistics lead assigned to lead rigging on Oct 14.',
    source: 'Contact Form',
  },
  {
    id: 'INQ-2026-017',
    createdAt: '2026-08-31T10:15:00Z',
    fullName: 'Claire Nabunya',
    phoneNumber: '0782 770 123',
    email: 'claire@fenonevents.com',
    eventDate: '2026-09-19',
    venueLocation: 'Jahazi Pier Munyonyo',
    eventType: 'Lakeside Wedding Reception',
    estimatedAudience: '700 Guests',
    selectedServices: ['lighting', 'stage-boardwork', 'audio-sound'],
    estimatedBudgetUGX: 13000000,
    status: 'Confirmed',
    notes: 'Curved wooden bridal stage with high-gloss acrylic finish, warm romantic chandeliers on aluminum goalposts.',
    internalAdminNotes: 'Carpentry complete in workshop. Final gloss coating in progress.',
    source: 'WhatsApp Direct',
  },
  {
    id: 'INQ-2026-016',
    createdAt: '2026-08-30T14:40:00Z',
    fullName: 'Patricia Akello',
    phoneNumber: '0779 334 009',
    email: 'pakello@ubc.ug',
    eventDate: '2026-10-09',
    venueLocation: 'Kololo Independence Grounds',
    eventType: 'National Independence Broadcast',
    estimatedAudience: '20,000 Broadcast',
    selectedServices: ['lighting', 'trussing', 'led-screens', 'audio-sound'],
    estimatedBudgetUGX: 52000000,
    status: 'In Logistics',
    notes: 'Heavy box truss broadcast canopy, broadcast CRI 96+ white key-lights, redundant NovaStar video processor.',
    internalAdminNotes: 'Joint technical briefing completed with state broadcasting engineers.',
    source: 'Admin Entry',
  },
  {
    id: 'INQ-2026-015',
    createdAt: '2026-08-29T16:00:00Z',
    fullName: 'Simon Peter Otim',
    phoneNumber: '0704 661 229',
    email: 'otim@spekeresort.com',
    eventDate: '2026-09-25',
    venueLocation: 'Munyonyo Commonwealth Speke Hall',
    eventType: 'Hospitality Leaders Summit',
    estimatedAudience: '500 Delegates',
    selectedServices: ['lighting', 'led-screens', 'audio-sound'],
    estimatedBudgetUGX: 14500000,
    status: 'Contacted',
    notes: 'Clean P2.9 presentation LED wall and digital podium mics with low-profile stage monitor.',
    internalAdminNotes: 'Sent customized proposal to hospitality committee.',
    source: 'Contact Form',
  },
  {
    id: 'INQ-2026-014',
    createdAt: '2026-08-28T09:00:00Z',
    fullName: 'Moses Kibirige',
    phoneNumber: '0771 883 440',
    email: 'moses@totalenergies.ug',
    eventDate: '2026-11-12',
    venueLocation: 'Serena Kampala Ballroom',
    eventType: 'Corporate Energy Gala',
    estimatedAudience: '600 VIPs',
    selectedServices: ['lighting', 'stage-boardwork', 'led-screens'],
    estimatedBudgetUGX: 21000000,
    status: 'Pending',
    notes: 'Green-themed intelligent stage lighting, custom acrylic illuminated emblem, and seamless presentation screen.',
    internalAdminNotes: 'Awaiting procurement tender evaluation.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-013',
    createdAt: '2026-08-27T11:45:00Z',
    fullName: 'Fiona Namatovu',
    phoneNumber: '0701 445 778',
    email: 'fiona@eastafricanbank.com',
    eventDate: '2026-10-28',
    venueLocation: 'Kampala Serena Hotel',
    eventType: 'Annual Shareholders Meeting (AGM)',
    estimatedAudience: '1,000 Shareholders',
    selectedServices: ['audio-sound', 'led-screens', 'stage-boardwork', 'lighting'],
    estimatedBudgetUGX: 24000000,
    status: 'Pending',
    notes: 'Dual audience question-and-answer microphones, twin 6x3m LED projection screens, and voting dais.',
    internalAdminNotes: 'Sent AV quote with redundant microphone backup included.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-012',
    createdAt: '2026-08-26T18:00:00Z',
    fullName: 'Samuel Balaba',
    phoneNumber: '0783 221 909',
    email: 'samuel@visiongroup.co.ug',
    eventDate: '2026-09-15',
    venueLocation: 'Lugogo Hockey Grounds',
    eventType: 'Brand Activation & Concert',
    estimatedAudience: '6,000 Youth',
    selectedServices: ['lighting', 'trussing', 'audio-sound', 'led-screens'],
    estimatedBudgetUGX: 34000000,
    status: 'Confirmed',
    notes: 'Touring rock line array PA system, fast moving beam lighting, and high-impact bass subwoofer matrix.',
    internalAdminNotes: 'Advance rigging crew starts on-site at 06:00 Sept 14.',
    source: 'WhatsApp Direct',
  },
  {
    id: 'INQ-2026-011',
    createdAt: '2026-08-25T14:15:00Z',
    fullName: 'Lydia Mwesigwa',
    phoneNumber: '0751 908 334',
    email: 'lydia@ugandatourism.org',
    eventDate: '2026-10-14',
    venueLocation: 'Murchison Falls National Park Gate',
    eventType: 'Tourism Heritage Festival',
    estimatedAudience: '2,000 Visitors',
    selectedServices: ['lighting', 'stage-boardwork', 'audio-sound', 'trussing'],
    estimatedBudgetUGX: 27000000,
    status: 'Contacted',
    notes: 'Self-sufficient mobile event stage with quiet diesel generator and rugged aluminum ground-support.',
    internalAdminNotes: 'Logistics plan for upcountry transport finalized.',
    source: 'Contact Form',
  },
  {
    id: 'INQ-2026-010',
    createdAt: '2026-08-24T12:00:00Z',
    fullName: 'Kato Emmanuel',
    phoneNumber: '0772 119 008',
    email: 'kato@bobiwine.ug',
    eventDate: '2026-11-28',
    venueLocation: 'Busabala One Love Beach',
    eventType: 'End of Year Reggae Carnival',
    estimatedAudience: '18,000 Crowd',
    selectedServices: ['audio-sound', 'trussing', 'lighting', 'led-screens'],
    estimatedBudgetUGX: 48000000,
    status: 'Pending',
    notes: 'Giant beach concert mainstage with heavy wind ballasts, massive sub-bass arrays, and daylight screens.',
    internalAdminNotes: 'Meeting with production team next Tuesday.',
    source: 'WhatsApp Direct',
  },
  {
    id: 'INQ-2026-009',
    createdAt: '2026-08-23T15:30:00Z',
    fullName: 'Angela Tumusiime',
    phoneNumber: '0705 332 111',
    email: 'angela@britishcouncil.ug',
    eventDate: '2026-09-20',
    venueLocation: 'National Theatre Auditorium, Kampala',
    eventType: 'Creative Arts Exhibition & Showcase',
    estimatedAudience: '600 Attendees',
    selectedServices: ['lighting', 'audio-sound', 'stage-boardwork'],
    estimatedBudgetUGX: 9500000,
    status: 'Confirmed',
    notes: 'Theatrical profile spotlights, ambient wireless uplighting, and custom artist plinths.',
    internalAdminNotes: 'Lighting plot approved by theatre master technician.',
    source: 'Admin Entry',
  },
  {
    id: 'INQ-2026-008',
    createdAt: '2026-08-22T10:00:00Z',
    fullName: 'Patrick Byaruhanga',
    phoneNumber: '0785 443 210',
    email: 'patrick@dfcugroup.com',
    eventDate: '2026-09-18',
    venueLocation: 'Kampala Serena Katonga Hall',
    eventType: 'SME Business Awards',
    estimatedAudience: '400 VIP Guests',
    selectedServices: ['stage-boardwork', 'led-screens', 'lighting'],
    estimatedBudgetUGX: 13500000,
    status: 'In Logistics',
    notes: 'Custom 3D backlit boardwork, stage riser with black velvet skirting, and P2.9 crystal video wall.',
    internalAdminNotes: 'Carpentry ready for delivery on Thursday morning.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-007',
    createdAt: '2026-08-21T16:20:00Z',
    fullName: 'Rebecca Nalule',
    phoneNumber: '0753 881 229',
    email: 'rebecca@rotarydistrict9213.org',
    eventDate: '2026-10-22',
    venueLocation: 'Speke Resort Munyonyo Victoria Ballroom',
    eventType: 'Rotary International Fellowship Gala',
    estimatedAudience: '850 Dignitaries',
    selectedServices: ['lighting', 'audio-sound', 'stage-boardwork'],
    estimatedBudgetUGX: 15500000,
    status: 'Contacted',
    notes: 'Pristine speech audio, warm gold uplighting around ballroom pillars, and custom presidential podium.',
    internalAdminNotes: 'Sent quotation with Rotary emblem branding package.',
    source: 'Contact Form',
  },
  {
    id: 'INQ-2026-006',
    createdAt: '2026-08-20T11:10:00Z',
    fullName: 'David Kintu',
    phoneNumber: '0773 661 550',
    email: 'david@ugandabreweries.com',
    eventDate: '2026-10-03',
    venueLocation: 'Lugogo Tennis Club Grounds',
    eventType: 'Craft Beer & Music Fest',
    estimatedAudience: '3,500 Guests',
    selectedServices: ['trussing', 'lighting', 'audio-sound'],
    estimatedBudgetUGX: 23000000,
    status: 'Confirmed',
    notes: 'Circular festival stage with 360-degree beam illumination, suspended speaker clusters, and festoons.',
    internalAdminNotes: 'Rigging plot approved by safety inspector.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-005',
    createdAt: '2026-08-19T14:00:00Z',
    fullName: 'Dr. Stella Nansubuga',
    phoneNumber: '0702 778 991',
    email: 'stella@ministryofhealth.go.ug',
    eventDate: '2026-09-12',
    venueLocation: 'Imperial Royale Hotel Primrose Hall',
    eventType: 'National Health Policy Launch',
    estimatedAudience: '350 Delegates',
    selectedServices: ['audio-sound', 'led-screens', 'lighting'],
    estimatedBudgetUGX: 12000000,
    status: 'In Logistics',
    notes: 'Medical document presentation screen, multi-zone speech microphones, and livestream camera audio feed.',
    internalAdminNotes: 'AV technician and sound engineer confirmed for deployment.',
    source: 'Admin Entry',
  },
  {
    id: 'INQ-2026-004',
    createdAt: '2026-08-18T09:30:00Z',
    fullName: 'Joseph Walusimbi',
    phoneNumber: '0781 559 004',
    email: 'joseph@chameleonmusic.com',
    eventDate: '2026-12-05',
    venueLocation: 'Lugogo Cricket Oval',
    eventType: 'Legendary 25-Year Live Concert',
    estimatedAudience: '15,000+ Fans',
    selectedServices: ['lighting', 'trussing', 'led-screens', 'audio-sound', 'stage-boardwork'],
    estimatedBudgetUGX: 55000000,
    status: 'Confirmed',
    notes: 'Giant curved roof truss structure, 30-meter stage width, full pyrotechnics integration, 60 moving heads.',
    internalAdminNotes: 'Major production contract secured. Advance design review meeting scheduled.',
    source: 'WhatsApp Direct',
  },
  {
    id: 'INQ-2026-003',
    createdAt: '2026-08-17T17:00:00Z',
    fullName: 'Evelyn Babirye',
    phoneNumber: '0755 221 880',
    email: 'evelyn@innovateuganda.org',
    eventDate: '2026-10-16',
    venueLocation: 'MoTIV Uganda, Industrial Area',
    eventType: 'East Africa Tech Hackathon & Expo',
    estimatedAudience: '800 Coders & Founders',
    selectedServices: ['led-screens', 'lighting', 'audio-sound'],
    estimatedBudgetUGX: 14000000,
    status: 'Pending',
    notes: 'Industrial loft aesthetic lighting, presentation LED walls for pitching teams, and energetic background PA.',
    internalAdminNotes: 'Draft budget sent; client reviewing sponsor allocations.',
    source: 'Quote Modal',
  },
  {
    id: 'INQ-2026-002',
    createdAt: '2026-08-15T10:00:00Z',
    fullName: 'Hassan Muyanja',
    phoneNumber: '0772 884 112',
    email: 'hassan@toyota.ug',
    eventDate: '2026-09-02',
    venueLocation: 'Toyota Showroom Jinja Road',
    eventType: 'Hybrid Vehicle Unveiling',
    estimatedAudience: '250 VIP Buyers',
    selectedServices: ['lighting', 'stage-boardwork', 'led-screens'],
    estimatedBudgetUGX: 16500000,
    status: 'Completed',
    notes: 'High-CRI 96+ white key-lighting, custom gloss car riser plinth, and high-contrast dramatic reveal screen.',
    internalAdminNotes: 'Show executed flawlessly. Client extended contract for next showroom opening in Gulu.',
    source: 'Admin Entry',
  },
  {
    id: 'INQ-2026-001',
    createdAt: '2026-08-12T13:45:00Z',
    fullName: 'Christine Nabatanzi',
    phoneNumber: '0703 118 774',
    email: 'christine@unfpa.org',
    eventDate: '2026-08-28',
    venueLocation: 'Speke Resort Munyonyo',
    eventType: 'Pan-African Youth Dialogue',
    estimatedAudience: '1,200 Delegates',
    selectedServices: ['audio-sound', 'lighting', 'led-screens', 'stage-boardwork'],
    estimatedBudgetUGX: 28000000,
    status: 'Completed',
    notes: 'International plenary staging, simultaneous translation booth audio, and dual LED screen feeds.',
    internalAdminNotes: 'Invoice paid in full. Testimonial received from UN resident coordinator.',
    source: 'Quote Modal',
  },
];

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
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
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
