import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchKathmanduEnvironmentalData, getLiveCalendarDate } from "../services/publicDataService";
import NepalEmblem from "./Common/NepalEmblem";
import { 
  Building2, 
  Languages, 
  Sparkles, 
  User, 
  Briefcase, 
  Landmark,
  CloudSun,
  Wind,
  ShieldCheck,
  Sun,
  Moon,
  Search,
  Phone,
  RefreshCw,
  Calendar
} from "lucide-react";

export default function Header() {
  const { 
    lang, 
    setLang, 
    role, 
    setRole, 
    activeTab,
    setActiveTab,
    t, 
    theme,
    toggleTheme,
    setIsCommandPaletteOpen
  } = useApp();
  const [envData, setEnvData] = useState(null);
  const [isRefreshingEnv, setIsRefreshingEnv] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchKathmanduEnvironmentalData().then((data) => {
      if (mounted) setEnvData(data);
    });
    return () => { mounted = false; };
  }, []);

  const handleRefreshEnv = async () => {
    setIsRefreshingEnv(true);
    try {
      const data = await fetchKathmanduEnvironmentalData(true);
      setEnvData(data);
    } finally {
      setTimeout(() => setIsRefreshingEnv(false), 500);
    }
  };

  const getSectionInfo = (currentTab, currentLang) => {
    switch (currentTab) {
      case "staff":
        return {
          title: currentLang === "ne" ? "वडा कार्यालय नं. ०४" : "Ward Office No. 04",
          badge: currentLang === "ne" ? "वडा सचिव तथा कर्मचारी कार्यकक्ष" : "Ward Secretariat & Administrative Portal",
          office: currentLang === "ne" ? "काठमाडौँ महानगरपालिका वडा नं. ४ कार्यालय, बालुवाटार" : "Ward No. 04 Office, Baluwatar, Kathmandu",
          ribbonTag: currentLang === "ne" ? "📋 वडा ०४ सचिवालय" : "📋 Ward 04 Secretariat",
          ribbonOffice: currentLang === "ne" ? "वडा समिति ०४ कार्यालय, बालुवाटार" : "Office of Ward Committee 04, Baluwatar",
          ribbonPhoneText: currentLang === "ne" ? "वडा हटलाइन: ०१-४४१२३४५" : "Ward Desk: 01-4412345",
          ribbonPhoneTel: "tel:014412345",
          ribbonPhoneTitle: "Ward 04 Direct Service Desk",
          ribbonStatus: currentLang === "ne" ? "वडा सचिव सेवा उपलब्ध" : "Ward Secretary Desk Active"
        };
      case "district":
        return {
          title: currentLang === "ne" ? "जिल्ला प्रशासन कार्यालय, काठमाडौँ" : "District Administration Office, Kathmandu",
          badge: currentLang === "ne" ? "नागरिकता तथा शान्ति सुरक्षा महाशाखा" : "Citizenship & District Administration Division",
          office: currentLang === "ne" ? "गृह मन्त्रालय • बबरमहल, काठमाडौँ" : "Ministry of Home Affairs • Babarmahal, Kathmandu",
          ribbonTag: currentLang === "ne" ? "🏛️ जि.प्र.का. काठमाडौँ" : "🏛️ District Admin Office (DAO)",
          ribbonOffice: currentLang === "ne" ? "जिल्ला प्रशासन कार्यालय, बबरमहल" : "District Administration Office, Babarmahal",
          ribbonPhoneText: currentLang === "ne" ? "जि.प्र.का: ०१-४२६२४४१" : "DAO Helpline: 01-4262441",
          ribbonPhoneTel: "tel:014262441",
          ribbonPhoneTitle: "DAO Kathmandu Citizen Service Desk",
          ribbonStatus: currentLang === "ne" ? "नागरिकता तथा राहदानी सिफारिस प्रमाणीकरण" : "Citizenship & Passport Verification Active"
        };
      case "analytics":
        return {
          title: currentLang === "ne" ? "महानगर कार्यसम्पादन तथा अनुगमन" : "Municipal Intelligence & Analytics",
          badge: currentLang === "ne" ? "सुशासन तथा योजना महाशाखा" : "Good Governance & Planning Division",
          office: currentLang === "ne" ? "काठमाडौँ महानगरपालिका सूचना प्रविधि तथा तथ्याङ्क शाखा" : "Urban Analytics & ICT Division, KMC",
          ribbonTag: currentLang === "ne" ? "📊 महानगर अनुगमन" : "📊 Municipal Analytics",
          ribbonOffice: currentLang === "ne" ? "तथ्याङ्क तथा सहरी योजना महाशाखा" : "Data & Urban Planning Division",
          ribbonPhoneText: currentLang === "ne" ? "गुनासो अनुगमन: ११८०" : "Grievance Desk: 1180",
          ribbonPhoneTel: "tel:1180",
          ribbonPhoneTitle: "KMC Grievance & Urban Analytics Desk",
          ribbonStatus: currentLang === "ne" ? "प्रत्यक्ष कार्यसम्पादन विश्लेषण" : "Live Municipal Performance Feed"
        };
      case "tracking":
        return {
          title: currentLang === "ne" ? "डिजिटल निवेदन तथा सिफारिस ट्र्याकिङ" : "Application Status & Tracking",
          badge: currentLang === "ne" ? "डिजिटल सेवा ट्र्याकिङ" : "Live Service Tracking",
          office: currentLang === "ne" ? "सुशासन ऐन २०६४ बमोजिम डिजिटल सार्वजनिक सेवा ट्र्याकिङ" : "Good Governance Act 2064 Public Service Tracking",
          ribbonTag: currentLang === "ne" ? "🔍 डिजिटल प्रमाणीकरण" : "🔍 Digital Verification",
          ribbonOffice: currentLang === "ne" ? "सुशासन ऐन २०६४ ई-प्रणाली" : "Good Governance E-Verification",
          ribbonPhoneText: currentLang === "ne" ? "सहयोग डेस्क: ०१-४२३१४८१" : "Support Desk: 01-4231481",
          ribbonPhoneTel: "tel:014231481",
          ribbonPhoneTitle: "JanSewa Verification & Tracking Support Desk",
          ribbonStatus: currentLang === "ne" ? "डिजिटल हस्ताक्षर तथा बारकोड प्रमाणित" : "Digital Signature & Barcode Verified"
        };
      case "chatbot":
        return {
          title: currentLang === "ne" ? "जनसेवा साथी एआई सेवा सहायक" : "JanSewa Sathi Municipal AI Assistant",
          badge: currentLang === "ne" ? "महानगर एआई सेवा सहायक" : "Municipal AI Assistant",
          office: currentLang === "ne" ? "स्थानीय सरकार सञ्चालन ऐन २०७४ प्रमाणीकृत डिजिटल सहायक" : "Grounded in Local Government Operation Act 2074",
          ribbonTag: currentLang === "ne" ? "🤖 जनसेवा साथी एआई" : "🤖 JanSewa Sathi AI",
          ribbonOffice: currentLang === "ne" ? "स्थानीय सरकार सञ्चालन ऐन २०७४ प्रमाणीकृत" : "Local Govt Operation Act 2074 Grounded",
          ribbonPhoneText: currentLang === "ne" ? "टोल-फ्री: ११८०" : "Toll-Free: 1180",
          ribbonPhoneTel: "tel:1180",
          ribbonPhoneTitle: "Kathmandu Metropolitan City Citizen Helpline",
          ribbonStatus: currentLang === "ne" ? "Gemini Grounded AI • २४/७ नागरिक सेवा" : "Gemini Grounded AI • 24/7 Active"
        };
      default:
        return {
          title: currentLang === "ne" ? "काठमाडौँ महानगरपालिका" : "Kathmandu Metropolitan City",
          badge: currentLang === "ne" ? "जनसेवा एकीकृत अनलाइन नागरिक सेवा पोर्टल" : "JanSewa Integrated Citizen Services Portal",
          office: currentLang === "ne" ? "नगर कार्यपालिकाको कार्यालय, बागदरबार, काठमाडौँ" : "Office of the Municipal Executive, Bagdurbar, Kathmandu",
          ribbonTag: currentLang === "ne" ? "🏛️ नगर कार्यपालिका" : "🏛️ Municipal Executive",
          ribbonOffice: currentLang === "ne" ? "काठमाडौँ महानगरपालिका, बागदरबार" : "Kathmandu Metropolitan City, Bagdurbar",
          ribbonPhoneText: currentLang === "ne" ? "टोल-फ्री: ११८०" : "Toll-Free: 1180",
          ribbonPhoneTel: "tel:1180",
          ribbonPhoneTitle: "Kathmandu Metropolitan City Citizen Helpline",
          ribbonStatus: currentLang === "ne" ? "काठमाडौँ महानगर नागरिक सेवा" : "KMC Citizen Services Active"
        };
    }
  };

  const sectionInfo = getSectionInfo(activeTab, lang);

  const roleIcons = {
    citizen: <User size={14} />,
    ward_staff: <Briefcase size={14} />,
    municipality_admin: <Building2 size={14} />,
    district_officer: <Landmark size={14} />
  };

  return (
    <header className="main-header" role="banner">
      {/* Dynamic Top Gov Ribbon with Real-Time Context & Telemetry */}
      <div className="top-gov-ribbon">
        <div className="top-gov-ribbon-content">
          <div className="top-gov-ribbon-left">
            <span className="ribbon-context-badge">
              {sectionInfo.ribbonTag}
            </span>
            <span className="ribbon-office-name">
              {sectionInfo.ribbonOffice}
            </span>
          </div>

          <div className="top-gov-ribbon-right">
            <div
              className="ribbon-item ribbon-phone"
              title={sectionInfo.ribbonPhoneTitle}
            >
              <Phone size={11} />
              <a href={sectionInfo.ribbonPhoneTel} style={{ color: "inherit", textDecoration: "none" }}>
                {sectionInfo.ribbonPhoneText}
              </a>
            </div>

            <span className="ribbon-divider">|</span>

            {/* Dynamic Status / Telemetry for this active section */}
            {activeTab === "portal" ? (
              envData && (
                <>
                  <div
                    className="ribbon-item ribbon-weather"
                    title={`Source: ${envData.source} (Measured: ${envData.lastUpdated}) • Click refresh to update`}
                  >
                    <span
                      className="live-dot"
                      style={{
                        backgroundColor: envData.isLive ? "#10B981" : "#F59E0B"
                      }}
                      title={envData.isLive ? "Live Real-Time Telemetry Feed" : "Baseline Telemetry"}
                    />
                    <CloudSun size={12} color="var(--accent)" />
                    <span>
                      {lang === "ne"
                        ? `काठमाडौँ: ${envData.temperature}°C (${envData.conditionNe || envData.condition})`
                        : `Kathmandu: ${envData.temperature}°C (${envData.condition})`}
                    </span>
                  </div>

                  <span className="ribbon-divider">|</span>

                  <div className="ribbon-item ribbon-aqi">
                    <Wind size={12} color="var(--muted)" />
                    <span>
                      AQI {envData.aqi} ({lang === "ne" ? envData.aqiStatusNe || envData.aqiStatus : envData.aqiStatus})
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshEnv}
                      className="ribbon-refresh-btn"
                      title="Fetch live Kathmandu telemetry"
                      aria-label="Refresh environmental telemetry"
                    >
                      <RefreshCw size={10} className={isRefreshingEnv ? "spin-icon" : ""} />
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="ribbon-item ribbon-status">
                <span
                  className="live-dot"
                  style={{
                    backgroundColor: "#10B981"
                  }}
                />
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  {sectionInfo.ribbonStatus}
                </span>
              </div>
            )}

            <span className="ribbon-divider">|</span>

            <div className="ribbon-item ribbon-date">
              <Calendar size={11} color="var(--accent)" />
              <span>{getLiveCalendarDate(lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Inner */}
      <div className="header-inner">
        {/* Brand: Official Nepal Government & Kathmandu Metropolitan City Crest */}
        <div 
          className="logo-section" 
          onClick={() => {
            setActiveTab("portal");
            setRole("citizen");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Return to Citizen Portal Home"
        >
          <NepalEmblem size={62} className="emblem-svg" />
          <div className="brand-text">
            <div className="gov-sub-hierarchy">
              {lang === "ne" ? "नेपाल सरकार • बागमती प्रदेश" : "Government of Nepal • Bagmati Province"}
            </div>
            <h1 className="gov-main-title">
              {sectionInfo.title}
            </h1>
            <div className="gov-office-subtitle">
              {sectionInfo.office}
            </div>
            <div className="gov-portal-tag">
              <span className="portal-pill-badge">
                {sectionInfo.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Role Selector Tray */}
        <div className="role-picker-box" role="group" aria-label="Portal User Role Switcher">
          <button
            type="button"
            className={`role-btn ${role === "citizen" ? "active" : ""}`}
            onClick={() => setRole("citizen")}
            aria-pressed={role === "citizen"}
          >
            {roleIcons.citizen}
            <span>{lang === "ne" ? "नागरिक" : "Citizen"}</span>
          </button>
          <button
            type="button"
            className={`role-btn ${role === "ward_staff" ? "active" : ""}`}
            onClick={() => setRole("ward_staff")}
            aria-pressed={role === "ward_staff"}
          >
            {roleIcons.ward_staff}
            <span>{lang === "ne" ? "वडा सचिव" : "Ward Staff"}</span>
          </button>
          <button
            type="button"
            className={`role-btn ${role === "municipality_admin" ? "active" : ""}`}
            onClick={() => setRole("municipality_admin")}
            aria-pressed={role === "municipality_admin"}
          >
            {roleIcons.municipality_admin}
            <span>{lang === "ne" ? "नगरपालिका" : "Municipality"}</span>
          </button>
          <button
            type="button"
            className={`role-btn ${role === "district_officer" ? "active" : ""}`}
            onClick={() => setRole("district_officer")}
            aria-pressed={role === "district_officer"}
          >
            {roleIcons.district_officer}
            <span>{lang === "ne" ? "प्रजिअ / DAO" : "CDO / DAO"}</span>
          </button>
        </div>

        {/* Right Actions: Search / Command Palette, Theme, Lang + AI Engine Status */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-neu"
            onClick={() => setIsCommandPaletteOpen(true)}
            aria-label="Open Command Palette"
            title="Open Command Palette (Ctrl+K)"
            style={{ gap: "6px" }}
          >
            <Search size={14} color="var(--accent)" />
            <span style={{ fontSize: "0.78rem" }}>Menu</span>
            <kbd 
              style={{ 
                fontSize: "0.68rem", 
                padding: "2px 5px", 
                borderRadius: "4px", 
                background: "var(--highlight)", 
                boxShadow: "var(--neu-inset-sm)",
                color: "var(--muted)",
                fontFamily: "monospace"
              }}
            >
              Ctrl+K
            </kbd>
          </button>

          <button
            type="button"
            className="btn-neu theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark / Light Mode"
            title={theme === "dark" ? "Switch to Soft Light Mode" : "Switch to Deep Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <Sun size={14} color="#FBBF24" />
                <span>{lang === "ne" ? "उज्यालो" : "Light"}</span>
              </>
            ) : (
              <>
                <Moon size={14} color="var(--accent)" />
                <span>{lang === "ne" ? "अँध्यारो" : "Dark"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-neu"
            onClick={() => setLang(lang === "en" ? "ne" : "en")}
            aria-label="Toggle Language"
            title="Toggle Nepali / English"
          >
            <Languages size={14} />
            <span>{lang === "en" ? "नेपाली" : "English"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
