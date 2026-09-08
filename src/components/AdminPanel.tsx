import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Layers, 
  Inbox, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Menu, 
  X, 
  ShieldCheck, 
  Tv, 
  Sparkles,
  Database,
  Image as ImageIcon
} from 'lucide-react';
import { Logo } from './Logo';
import { 
  adminLogout, 
  getInquiries, 
  getEquipmentInventory, 
  getPortfolioProjects, 
  getSiteSettings,
  getServices,
  saveInquiries,
  addInquiry,
  updateInquiryStatus,
  deleteInquiry,
  clearAllInquiries,
  savePortfolioProjects,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  toggleProjectStatus,
  updateEquipmentItem,
  addEquipmentItem,
  deleteEquipmentItem,
  saveSiteSettings,
  resetSiteSettings
} from '../data/adminStore';
import { 
  AdminInquiry, 
  InquiryStatus, 
  EquipmentItemAdmin, 
  PortfolioProjectAdmin, 
  SiteSettings,
  ServiceItem
} from '../types';
import { AdminHeader } from './admin/AdminHeader';
import { DashboardTab } from './admin/DashboardTab';
import { ProjectsTab } from './admin/ProjectsTab';
import { EquipmentTab } from './admin/EquipmentTab';
import { InquiriesTab } from './admin/InquiriesTab';
import { SettingsTab } from './admin/SettingsTab';
import { ServicesTab } from './admin/ServicesTab';
import { PicturesTab } from './admin/PicturesTab';
import { DatabaseTab } from './admin/DatabaseTab';
import { ProjectModal } from './admin/ProjectModal';
import { InquiryModal } from './admin/InquiryModal';

interface AdminPanelProps {
  onClose: () => void;
  onNavigateHome: () => void;
}

type AdminTab = 'dashboard' | 'services' | 'pictures' | 'database' | 'projects' | 'equipment' | 'inquiries' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data Stores
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItemAdmin[]>([]);
  const [projects, setProjects] = useState<PortfolioProjectAdmin[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(getServices());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());

  // Modals
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<PortfolioProjectAdmin | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  // Manual Lead Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualVenue, setManualVenue] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualType, setManualType] = useState('Concert');
  const [manualBudget, setManualBudget] = useState(15000000);
  const [manualNotes, setManualNotes] = useState('');

  // Clock
  const [timeString, setTimeString] = useState('');

  const refreshAllData = () => {
    setInquiries(getInquiries());
    setEquipment(getEquipmentInventory());
    setProjects(getPortfolioProjects());
    setServices(getServices());
    setSiteSettings(getSiteSettings());
  };

  useEffect(() => {
    refreshAllData();

    const handleStoreEvent = () => refreshAllData();
    window.addEventListener('royal_concepts_admin_event', handleStoreEvent);

    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Africa/Kampala',
          hour12: false,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => {
      window.removeEventListener('royal_concepts_admin_event', handleStoreEvent);
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    adminLogout();
    onClose();
  };

  // Inquiries Handlers
  const handleUpdateInquiryStatus = (id: string, status: InquiryStatus, internalNotes?: string) => {
    updateInquiryStatus(id, status, internalNotes);
    refreshAllData();
  };

  const handleDeleteInquiry = (id: string) => {
    deleteInquiry(id);
    refreshAllData();
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    addInquiry({
      fullName: manualName.trim(),
      phoneNumber: manualPhone.trim(),
      venueLocation: manualVenue.trim() || 'Kampala Area Venue',
      eventDate: manualDate.trim() || 'Date Pending',
      eventType: manualType,
      estimatedAudience: '1,000+ Guests',
      selectedServices: ['lighting', 'led-screens', 'trussing'],
      estimatedBudgetUGX: manualBudget,
      status: 'Pending',
      notes: manualNotes.trim() || 'Direct call booking logged into admin panel.',
      source: 'Admin Entry',
    });

    setManualName('');
    setManualPhone('');
    setManualVenue('');
    setManualDate('');
    setManualNotes('');
    setIsManualBookingOpen(false);
    refreshAllData();
  };

  // Projects Handlers
  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: PortfolioProjectAdmin) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (data: Omit<PortfolioProjectAdmin, 'id'>, isPublish: boolean) => {
    if (projectToEdit) {
      updatePortfolioProject({
        ...data,
        id: projectToEdit.id,
        status: isPublish ? 'Published' : 'Draft',
      });
    } else {
      addPortfolioProject({
        ...data,
        status: isPublish ? 'Published' : 'Draft',
      });
    }
    setIsProjectModalOpen(false);
    setProjectToEdit(null);
    refreshAllData();
  };

  const handleDeleteProject = (id: string) => {
    deletePortfolioProject(id);
    refreshAllData();
  };

  const handleToggleProjectStatus = (id: string) => {
    toggleProjectStatus(id);
    refreshAllData();
  };

  // Equipment Handlers
  const handleUpdateEquipment = (item: EquipmentItemAdmin) => {
    updateEquipmentItem(item);
    refreshAllData();
  };

  const handleAddEquipment = (item: Omit<EquipmentItemAdmin, 'id'>) => {
    addEquipmentItem(item);
    refreshAllData();
  };

  const handleDeleteEquipment = (id: string) => {
    deleteEquipmentItem(id);
    refreshAllData();
  };

  // Settings Handlers
  const handleSaveSettings = (newSettings: SiteSettings) => {
    saveSiteSettings(newSettings);
    refreshAllData();
  };

  const handleResetSettings = () => {
    const def = resetSiteSettings();
    setSiteSettings(def);
    refreshAllData();
  };

  const handleClearAllInquiries = () => {
    clearAllInquiries();
    refreshAllData();
  };

  const pendingQuotesCount = inquiries.filter(i => i.status === 'Pending').length;
  const activeOnsiteCount = projects.filter(p => p.isOnSite).length;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'services': return 'Services & Production Pillars';
      case 'pictures': return 'Site Media & Pictures Database';
      case 'database': return 'RoyalDB Engine & Vercel Deployment';
      case 'projects': return 'Portfolio & Projects';
      case 'equipment': return 'Services & Equipment Inventory';
      case 'inquiries': return 'Quote Requests & Inquiries';
      case 'settings': return 'Site Settings';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121316] text-neutral-100 flex overflow-hidden font-sans">
      {/* ---------------- LEFT SIDEBAR NAVIGATION ---------------- */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1A1C20] border-r border-[#2E323B] flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & System Identity */}
        <div className="p-5 border-b border-[#2E323B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" showTagline={false} />
              <div>
                <span className="text-[10px] font-mono font-bold text-[#2563EB] tracking-wider uppercase block">
                  BACK-OFFICE CMS
                </span>
                <span className="text-sm font-bold text-white tracking-tight">
                  Royal Admin
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto no-scrollbar scrollbar-none">
          {/* Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'dashboard' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              Overview
            </span>
          </button>

          {/* Services & Pillars Management */}
          <button
            onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#FF2E00]" />
              <span>Services & Pillars</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              5 Core
            </span>
          </button>

          {/* Site Media & Pictures Database */}
          <button
            onClick={() => { setActiveTab('pictures'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pictures'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-[#00F0FF]" />
              <span>Pictures & Media</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'pictures' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              DB
            </span>
          </button>

          {/* RoyalDB & Vercel Deployment */}
          <button
            onClick={() => { setActiveTab('database'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'database'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#FFE600]" />
              <span>RoyalDB & Vercel</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'database' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              Deploy
            </span>
          </button>

          {/* Portfolio & Projects */}
          <button
            onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4" />
              <span>Portfolio & Projects</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              {projects.length}
            </span>
          </button>

          {/* Services & Equipment Inventory */}
          <button
            onClick={() => { setActiveTab('equipment'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'equipment'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Services & Inventory</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'equipment' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              Gear
            </span>
          </button>

          {/* Quote Requests / Inquiries */}
          <button
            onClick={() => { setActiveTab('inquiries'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Quote Requests</span>
            </div>
            {pendingQuotesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-black">
                {pendingQuotesCount}
              </span>
            )}
          </button>

          {/* Site Settings */}
          <button
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                : 'text-neutral-400 hover:text-white hover:bg-[#121316]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Site Settings</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'settings' ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
              Contacts
            </span>
          </button>
        </nav>

        {/* Sidebar Footer: Authenticated User & Logout */}
        <div className="p-4 border-t border-[#2E323B] space-y-3 bg-[#16181C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white text-xs shadow-md">
              RC
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                Admin Station
              </div>
              <div className="text-[10px] text-emerald-400 font-mono truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                code5@royal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-3 rounded-xl bg-[#121316] hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-[#2E323B] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN DYNAMIC CONTENT AREA ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header Bar for Toggle */}
        <div className="lg:hidden h-14 bg-[#1A1C20] border-b border-[#2E323B] px-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#121316] text-neutral-300 border border-[#2E323B]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-white font-mono">{getTabTitle()}</span>
          <button
            onClick={onNavigateHome}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Site</span>
          </button>
        </div>

        {/* Top Header Bar with quick stats and notifications */}
        <AdminHeader
          pendingQuotesCount={pendingQuotesCount}
          activeOnsiteCount={activeOnsiteCount}
          timeString={timeString}
          onNavigateHome={onNavigateHome}
          onNewProject={handleOpenAddProject}
          onNewBooking={() => setIsManualBookingOpen(true)}
          activeTabTitle={getTabTitle()}
        />

        {/* Scrollable Dynamic Tab Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#121316] no-scrollbar scrollbar-none">
          {activeTab === 'dashboard' && (
            <DashboardTab
              inquiries={inquiries}
              projects={projects}
              equipment={equipment}
              onSelectInquiry={item => setSelectedInquiry(item)}
              onNewBooking={() => setIsManualBookingOpen(true)}
              onNewProject={handleOpenAddProject}
              onNavigateToInquiries={() => setActiveTab('inquiries')}
              onNavigateToProjects={() => setActiveTab('projects')}
              onNavigateToEquipment={() => setActiveTab('equipment')}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab
              services={services}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'pictures' && (
            <PicturesTab
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseTab
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onOpenAddModal={handleOpenAddProject}
              onEditProject={handleOpenEditProject}
              onDeleteProject={handleDeleteProject}
              onToggleStatus={handleToggleProjectStatus}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentTab
              equipment={equipment}
              onUpdateItem={handleUpdateEquipment}
              onAddItem={handleAddEquipment}
              onDeleteItem={handleDeleteEquipment}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              onSelectInquiry={item => setSelectedInquiry(item)}
              onNewBooking={() => setIsManualBookingOpen(true)}
              onDeleteInquiry={handleDeleteInquiry}
              onClearAllInquiries={handleClearAllInquiries}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={siteSettings}
              onSave={handleSaveSettings}
              onReset={handleResetSettings}
            />
          )}
        </main>
      </div>

      {/* ---------------- MODALS ---------------- */}
      {/* 1. Project Add/Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => {
          setIsProjectModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />

      {/* 2. Inquiry View/Edit Modal */}
      <InquiryModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onUpdateStatus={handleUpdateInquiryStatus}
        onDelete={handleDeleteInquiry}
      />

      {/* 3. Manual Lead Quick Log Modal */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto no-scrollbar scrollbar-none">
          <form
            onSubmit={handleCreateManualBooking}
            className="relative w-full max-w-lg bg-[#1A1C20] border border-[#2E323B] rounded-2xl p-6 text-white space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
              <h2 className="text-base font-bold">Log New Inbound Lead / Booking</h2>
              <button
                type="button"
                onClick={() => setIsManualBookingOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="e.g. John Baptist"
                    className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                    placeholder="0772..."
                    className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Venue Location</label>
                  <input
                    type="text"
                    value={manualVenue}
                    onChange={e => setManualVenue(e.target.value)}
                    placeholder="e.g. Lugogo Tennis Grounds"
                    className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Event Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Event Type</label>
                  <select
                    value={manualType}
                    onChange={e => setManualType(e.target.value)}
                    className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Concert">Concert / Festival</option>
                    <option value="Corporate Gala">Corporate Gala</option>
                    <option value="Wedding / Social">Wedding / Social</option>
                    <option value="Conference / Plenary">Conference / Plenary</option>
                    <option value="Exhibition">Exhibition</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase">Quoted / Budget (UGX)</label>
                  <input
                    type="number"
                    step="500000"
                    value={manualBudget}
                    onChange={e => setManualBudget(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase">Technical Notes</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="Sound system, truss requirements, LED screen size..."
                  className="w-full bg-[#121316] border border-[#2E323B] rounded-xl p-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#2E323B]">
              <button
                type="button"
                onClick={() => setIsManualBookingOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-[#2563EB]/25"
              >
                Save Inbound Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
