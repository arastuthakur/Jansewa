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

function MainContent() {
  const { activeTab, setActiveTab, role, lang } = useApp();

  // If role changes, guide view intuitively
  useEffect(() => {
    if (role === "ward_staff" || role === "municipality_admin") {
      setActiveTab("staff");
    } else if (role === "district_officer") {
      setActiveTab("district");
    } else if (role === "citizen") {
      setActiveTab("portal");
    }
  }, [role, setActiveTab]);

  return (
    <div className="app-container">
      <Header />
      <Navigation />

      <main className="main-content" id="main-content">
        {activeTab === "portal" && <CitizenPortal />}
        {activeTab === "staff" && <StaffPortal />}
        {activeTab === "district" && <DistrictPortal />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "tracking" && <ApplicationTracker />}
        {activeTab === "chatbot" && <JanSewaSathi isFullPage={true} />}
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
