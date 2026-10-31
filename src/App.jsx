import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import CitizenPortal from "./components/CitizenPortal/CitizenPortal";
import StaffPortal from "./components/StaffPortal/StaffPortal";
import DistrictPortal from "./components/DistrictPortal/DistrictPortal";
import AnalyticsDashboard from "./components/AnalyticsPortal/AnalyticsDashboard";
import ApplicationTracker from "./components/CitizenPortal/ApplicationTracker";
import JanSewaSathi from "./components/Chatbot/JanSewaSathi";
import NewApplicationModal from "./components/CitizenPortal/NewApplicationModal";
import ApplicationReviewModal from "./components/StaffPortal/ApplicationReviewModal";
import ComplaintLodgeModal from "./components/CitizenPortal/ComplaintLodgeModal";
import CertificateModal from "./components/Common/CertificateModal";
import CommandPaletteModal from "./components/Common/CommandPaletteModal";
import Toast from "./components/Common/Toast";
import MobileBottomNav from "./components/Navigation/MobileBottomNav";
import { Home, ChevronRight } from "lucide-react";

function MainContent() {
  const { activeTab, setActiveTab, role, setRole, lang } = useApp();

  // Dynamic URL hash routing & history support (#portal, #staff, #district, #analytics, #tracking, #chatbot)
  useEffect(() => {
    const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";
    if (isTest || typeof window === "undefined") return;

    const validTabs = ["portal", "staff", "district", "analytics", "tracking", "chatbot"];
    
    // Initial load from URL hash
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && validTabs.includes(initialHash)) {
      setActiveTab(initialHash);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash.replace("#", "");
      if (currentHash && validTabs.includes(currentHash)) {
        setActiveTab(currentHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [setActiveTab]);

  // Synchronize hash, smooth scroll, and document.title on activeTab change
  useEffect(() => {
    const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";
    if (!isTest && typeof window !== "undefined" && window.location.hash.replace("#", "") !== activeTab) {
      window.location.hash = activeTab;
    }
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        // Safe fallback in test runners
      }
    }

    // Dynamic document.title
    const pageTitles = {
      portal: lang === "ne" ? "नागरिक सेवा पोर्टल | जनसेवा काठमाडौँ" : "Citizen Services | JanSewa Kathmandu",
      staff: lang === "ne" ? "वडा सचिव कार्यकक्ष (वडा ०४) | जनसेवा काठमाडौँ" : "Ward Staff Workspace | JanSewa Kathmandu",
      district: lang === "ne" ? "जिल्ला प्रशासन कार्यालय (DAO काठमाडौँ) | जनसेवा" : "District Administration Office | JanSewa",
      analytics: lang === "ne" ? "महानगर अनुगमन तथा कार्यसम्पादन विश्लेषण | जनसेवा" : "Governance Analytics | JanSewa",
      tracking: lang === "ne" ? "डिजिटल निवेदन स्थिति ट्र्याकिङ | जनसेवा" : "Application Status Tracker | JanSewa",
      chatbot: lang === "ne" ? "जनसेवा साथी एआई सेवा सहायक | जनसेवा" : "JanSewa Sathi Municipal AI | JanSewa"
    };

    if (typeof document !== "undefined") {
      document.title = pageTitles[activeTab] || "जनसेवा एकीकृत अनलाइन नागरिक सेवा पोर्टल";
    }
  }, [activeTab, lang]);

  // If role changes, guide view intuitively
  useEffect(() => {
    if (role === "ward_staff" || role === "municipality_admin") {
      setActiveTab("staff");
    } else if (role === "district_officer") {
      setActiveTab("district");
    } else if (role === "citizen") {
      if (activeTab === "staff" || activeTab === "district") {
        setActiveTab("portal");
      }
    }
  }, [role, activeTab, setActiveTab]);

  const sectionLabels = {
    portal: lang === "ne" ? "नागरिक सेवा पोर्टल (Citizen Services)" : "Citizen Services Portal",
    staff: lang === "ne" ? "वडा सचिव तथा कर्मचारी कार्यकक्ष (Ward 04)" : "Ward Staff Workspace (Ward 04)",
    district: lang === "ne" ? "जिल्ला प्रशासन कार्यालय (DAO काठमाडौँ)" : "District Administration Office (DAO)",
    analytics: lang === "ne" ? "महानगर अनुगमन तथा कार्यसम्पादन विश्लेषण" : "Governance & Revenue Analytics",
    tracking: lang === "ne" ? "डिजिटल निवेदन तथा सिफारिस ट्र्याकिङ" : "Application Status & Tracking",
    chatbot: lang === "ne" ? "जनसेवा साथी एआई सेवा सहायक" : "JanSewa Sathi AI Assistant"
  };

  return (
    <div className="app-container">
      <Header />
      <Navigation />

      {/* Dynamic Section Breadcrumb Bar */}
      <div className="section-breadcrumb-bar">
        <div className="breadcrumb-inner">
          <div className="breadcrumb-path">
            <button
              type="button"
              className="breadcrumb-home-btn"
              onClick={() => {
                setActiveTab("portal");
                setRole("citizen");
              }}
              title="Return to Citizen Portal Home"
            >
              <Home size={13} />
              <span>{lang === "ne" ? "गृहपृष्ठ" : "Home"}</span>
            </button>
            <ChevronRight size={12} style={{ opacity: 0.4 }} />
            <span className="breadcrumb-active-tag">
              {sectionLabels[activeTab] || activeTab}
            </span>
          </div>

          <div className="breadcrumb-quick-pills desktop-only">
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              {lang === "ne" ? "द्रुत पृष्ठहरू:" : "Quick Jump:"}
            </span>
            <a
              href="#portal"
              className={`pill-link ${activeTab === "portal" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("portal"); setRole("citizen"); }}
            >
              {lang === "ne" ? "नागरिक" : "Citizen"}
            </a>
            <a
              href="#staff"
              className={`pill-link ${activeTab === "staff" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("staff"); setRole("ward_staff"); }}
            >
              {lang === "ne" ? "वडा सचिव" : "Ward Staff"}
            </a>
            <a
              href="#district"
              className={`pill-link ${activeTab === "district" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("district"); setRole("district_officer"); }}
            >
              {lang === "ne" ? "प्रजिअ / DAO" : "DAO"}
            </a>
            <a
              href="#analytics"
              className={`pill-link ${activeTab === "analytics" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("analytics"); setRole("municipality_admin"); }}
            >
              {lang === "ne" ? "विश्लेषण" : "Analytics"}
            </a>
            <a
              href="#tracking"
              className={`pill-link ${activeTab === "tracking" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("tracking"); setRole("citizen"); }}
            >
              {lang === "ne" ? "ट्र्याकिङ" : "Track"}
            </a>
            <a
              href="#chatbot"
              className={`pill-link ${activeTab === "chatbot" ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab("chatbot"); setRole("citizen"); }}
            >
              {lang === "ne" ? "एआई साथी" : "AI Sathi"}
            </a>
          </div>
        </div>
      </div>

      <main className="main-content" id="main-content">
        <div key={activeTab} className="portal-tab-transition">
          {activeTab === "portal" && <CitizenPortal />}
          {activeTab === "staff" && <StaffPortal />}
          {activeTab === "district" && <DistrictPortal />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "tracking" && <ApplicationTracker />}
          {activeTab === "chatbot" && <JanSewaSathi isFullPage={true} />}
        </div>
      </main>

      {/* Floating Chatbot Widget on other pages */}
      {activeTab !== "chatbot" && <JanSewaSathi isFullPage={false} />}

      {/* Modals & Dialogs */}
      <NewApplicationModal />
      <ApplicationReviewModal />
      <ComplaintLodgeModal />
      <CertificateModal />
      <CommandPaletteModal />
      <Toast />

      {/* Authentic Government of Nepal / Kathmandu Metropolitan City Municipal Footer */}
      <footer className="gov-footer" style={{ background: "var(--bg)", borderTop: "1px solid rgba(208, 208, 208, 0.4)", padding: "28px 24px", marginTop: "auto", fontSize: "0.8rem", color: "var(--muted)" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--heading)", marginBottom: "4px" }}>
                {lang === "ne" ? "काठमाडौँ महानगरपालिका" : "Kathmandu Metropolitan City"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--body)" }}>
                {lang === "ne" ? "नगर कार्यपालिकाको कार्यालय, बागदरबार, काठमाडौँ, बागमती प्रदेश, नेपाल" : "Office of the Municipal Executive, Bagdurbar, Kathmandu, Bagmati Province, Nepal"}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: "4px" }}>
                {lang === "ne" ? "फोन: ०१-४२३१४८१, ०१-४२३१४२८ | टोल-फ्री: ११८० | इमेल: info@kathmandu.gov.np" : "Phone: 01-4231481, 01-4231428 | Toll-Free: 1180 | Email: info@kathmandu.gov.np"}
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.78rem" }}>
              <span style={{ color: "var(--accent)", cursor: "pointer" }}>{lang === "ne" ? "नागरिक बडापत्र (Citizen Charter)" : "Citizen Charter"}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: "var(--accent)", cursor: "pointer" }}>{lang === "ne" ? "गोपनीयता नीति (Privacy Policy)" : "Privacy Policy"}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: "var(--accent)", cursor: "pointer" }}>{lang === "ne" ? "प्रयोगका सर्तहरू" : "Terms of Use"}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{lang === "ne" ? "राष्ट्रिय सूचना प्रविधि केन्द्र (NITC)" : "Hosted on Govt Cloud (NITC)"}</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(208, 208, 208, 0.3)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "0.74rem" }}>
            <div>
              {lang === "ne" ? "प्रतिलिपि अधिकार © २०८३ काठमाडौँ महानगरपालिका । सर्वाधिकार सुरक्षित ।" : "Copyright © 2026 Kathmandu Metropolitan City. All Rights Reserved."}
            </div>
            <div>
              {lang === "ne" ? "स्थानीय सरकार सञ्चालन ऐन, २०७४ तथा सुशासन ऐन, २०६४ बमोजिम सञ्चालित" : "Operating under the Local Government Operation Act 2074 & Good Governance Act 2064"}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
