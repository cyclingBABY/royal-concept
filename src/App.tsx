import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { EquipmentSection } from './components/EquipmentSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { ServicePage } from './components/ServicePage';
import { AudioChatBot } from './components/AudioChatBot';
import { FloatingWidgets } from './components/FloatingWidgets';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { isAdminAuthenticated, getSiteSettings } from './data/adminStore';
import { ServiceCategory, SiteSettings } from './types';
import { MessageSquare, Volume2, Sparkles, Phone } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | ServiceCategory>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [initialServiceForQuote, setInitialServiceForQuote] = useState<ServiceCategory | null>(null);
  const [isAudioBotOpen, setIsAudioBotOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());

  // Listen to admin event updates
  useEffect(() => {
    const handleUpdate = () => {
      setSiteSettings(getSiteSettings());
    };
    window.addEventListener('royal_concepts_admin_event', handleUpdate);
    return () => window.removeEventListener('royal_concepts_admin_event', handleUpdate);
  }, []);

  // Parse hash on mount & listen to hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (
        hash === '#admin' || 
        hash === '#code5' || 
        hash === '#code5@royal' ||
        hash === '#/admin' || 
        hash === '#/code5' ||
        hash === '#/code5@royal'
      ) {
        if (isAdminAuthenticated()) {
          setIsAdminPanelOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
        return;
      }
      const match = hash.match(/#\/?services?\/(lighting|trussing|led-screens|audio-sound|stage-boardwork)/i);
      if (match && match[1]) {
        setCurrentView(match[1].toLowerCase() as ServiceCategory);
      } else if (!hash || hash === '#hero' || hash === '#services' || hash === '#portfolio' || hash === '#equipment' || hash === '#contact') {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated()) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateService = (serviceId: ServiceCategory) => {
    setCurrentView(serviceId);
    window.location.hash = `/services/${serviceId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuoteWithService = (service: ServiceCategory) => {
    setInitialServiceForQuote(service);
    setIsQuoteModalOpen(true);
  };

  const handleOpenQuoteWithProject = (_projectName: string) => {
    setInitialServiceForQuote('stage-boardwork');
    setIsQuoteModalOpen(true);
  };

  const handleOpenQuoteWithEquipment = (_equipmentName: string) => {
    setInitialServiceForQuote(null);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-neutral-100 flex flex-col font-sans selection:bg-[#FF2E00] selection:text-white overflow-x-hidden w-full max-w-[100vw]">
      {/* Header & Navigation */}
      <Navbar 
        onOpenQuote={() => {
          setInitialServiceForQuote(currentView !== 'home' ? currentView : null);
          setIsQuoteModalOpen(true);
        }}
        activeServiceId={currentView === 'home' ? null : currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateService={handleNavigateService}
      />

      {/* Dynamic Announcement Banner if enabled in Site Settings */}
      {siteSettings.bannerEnabled && siteSettings.bannerText && (
        <div className="pt-20 pb-0.5 bg-[#121316] border-b border-[#222222] relative z-30">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-neutral-300 min-w-0">
              <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#2563EB] font-mono text-[10px] font-bold shrink-0">
                UPDATE
              </span>
              <span className="truncate">{siteSettings.bannerText}</span>
            </div>
            <a
              href={`tel:${siteSettings.primaryPhone.replace(/\s+/g, '')}`}
              className="shrink-0 flex items-center gap-1.5 text-xs font-mono font-bold text-[#2563EB] hover:text-blue-400 transition"
            >
              <Phone className="w-3 h-3" />
              <span>{siteSettings.primaryPhone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Page Flow */}
      <main className="flex-1">
        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
            <Hero onOpenQuote={() => {
              setInitialServiceForQuote(null);
              setIsQuoteModalOpen(true);
            }} />

            {/* 5-Pillar Services Grid ("What We Do") with Direct Navigation to Individual Pages */}
            <ServicesSection 
              onSelectServiceForQuote={handleOpenQuoteWithService}
              onNavigateToServicePage={handleNavigateService}
            />

            {/* Filterable Project Portfolio */}
            <PortfolioSection onOpenQuoteWithDetails={handleOpenQuoteWithProject} />

            {/* Rental Equipment Showcase */}
            <EquipmentSection onSelectEquipmentForQuote={handleOpenQuoteWithEquipment} />

            {/* Interactive Event Request Form & Direct Contact */}
            <ContactSection onOpenAudioBot={() => setIsAudioBotOpen(true)} />
          </>
        ) : (
          /* Dedicated Service Page */
          <ServicePage
            serviceId={currentView}
            onNavigateHome={handleNavigateHome}
            onNavigateService={handleNavigateService}
            onOpenQuoteModal={handleOpenQuoteWithService}
          />
        )}
      </main>

      {/* Footer with Individual Service Page Links & code5 login link */}
      <Footer 
        onNavigateService={handleNavigateService}
        onNavigateHome={handleNavigateHome}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Quote Calculator Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialService={initialServiceForQuote}
        onOpenAudioBot={() => setIsAudioBotOpen(true)}
      />

      {/* Spoken Audio Voice Chatbot */}
      <AudioChatBot 
        currentService={currentView !== 'home' ? currentView : null}
        isOpenExternal={isAudioBotOpen}
        onCloseExternal={() => setIsAudioBotOpen(false)}
        hideTrigger={true}
      />

      {/* Admin Login Modal (code5) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          if (window.location.hash.includes('code5') || window.location.hash.includes('admin')) {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Admin Management Panel Console */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminPanelOpen(false);
            if (window.location.hash.includes('code5') || window.location.hash.includes('admin')) {
              window.location.hash = '';
            }
          }}
          onLogout={() => {
            setIsAdminPanelOpen(false);
            if (window.location.hash.includes('code5') || window.location.hash.includes('admin')) {
              window.location.hash = '';
            }
          }}
          onNavigateHome={() => {
            setIsAdminPanelOpen(false);
            handleNavigateHome();
          }}
        />
      )}

      {/* Persistent Floating Action Widgets: WhatsApp & Audio Chat Bot ("what boat") */}
      <FloatingWidgets
        onOpenChatBot={() => setIsAudioBotOpen(true)}
        isChatBotOpen={isAudioBotOpen}
        currentService={currentView !== 'home' ? currentView : null}
        whatsappNumber={siteSettings.whatsappPhone || '256702615454'}
      />
    </div>
  );
}
