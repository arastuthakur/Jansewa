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
  RefreshCw
} from "lucide-react";

export default function Header() {
  const { 
    lang, 
    setLang, 
    role, 
    setRole, 
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

  const roleIcons = {
    citizen: <User size={14} />,
    ward_staff: <Briefcase size={14} />,
    municipality_admin: <Building2 size={14} />,
    district_officer: <Landmark size={14} />
  };

  return (
    <header className="main-header" role="banner">
      {/* Top Gov Ribbon with Real-Time Public Environmental Indicator */}
      <div className="top-gov-ribbon">
        <div className="top-gov-ribbon-left">
          <span>🇳🇵 <strong>{lang === "ne" ? "नेपाल सरकार" : "Government of Nepal"}</strong></span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span>{lang === "ne" ? "बागमती प्रदेश" : "Bagmati Province"}</span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span>{lang === "ne" ? "काठमाडौँ महानगरपालिका" : "Kathmandu Metropolitan City"}</span>
          <span style={{ opacity: 0.35 }}>•</span>
          <span className="gov-motto" style={{ fontStyle: "italic", fontSize: "0.72rem", color: "var(--muted)" }}>
            "जननी जन्मभूमिश्च स्वर्गादपि गरीयसी"
          </span>
        </div>

        <div className="top-gov-ribbon-right">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.74rem",
              color: "var(--accent)",
              fontWeight: 600
            }}
            title="Kathmandu Metropolitan City Citizen Helpline"
          >
            <Phone size={12} />
            <span>{lang === "ne" ? "टोल-फ्री: ११८०" : "Toll-Free: 1180"}</span>
          </span>

          <span style={{ opacity: 0.3 }}>|</span>

          {envData && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                color: "var(--muted)"
              }}
              title={`Source: ${envData.source} (Measured: ${envData.lastUpdated}) • Click refresh to update`}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: envData.isLive ? "#10B981" : "#F59E0B"
                }}
                title={envData.isLive ? "Live Real-Time Telemetry Feed" : "Baseline Telemetry"}
              />
              <CloudSun size={13} color="var(--accent)" />
              <span>
                {lang === "ne"
                  ? `काठमाडौँ: ${envData.temperature}°C (${envData.conditionNe || envData.condition})`
                  : `Kathmandu: ${envData.temperature}°C (${envData.condition})`}
              </span>
              <span style={{ opacity: 0.3 }}>|</span>
              <Wind size={13} color="var(--muted)" />
              <span>
                AQI {envData.aqi} ({lang === "ne" ? envData.aqiStatusNe || envData.aqiStatus : envData.aqiStatus})
              </span>
              <button
                type="button"
                onClick={handleRefreshEnv}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  color: "var(--accent)"
                }}
                title="Fetch live Kathmandu telemetry"
                aria-label="Refresh environmental telemetry"
              >
                <RefreshCw size={11} className={isRefreshingEnv ? "spin-icon" : ""} />
              </button>
            </span>
          )}

          <span style={{ opacity: 0.3 }}>|</span>

          <span style={{ fontSize: "0.74rem", color: "var(--heading)", fontWeight: 500 }}>
            {getLiveCalendarDate(lang)}
          </span>
        </div>
      </div>

      {/* Main Header Inner */}
      <div className="header-inner">
        {/* Brand: Official Nepal Government & Kathmandu Metropolitan City Crest */}
        <div className="logo-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <NepalEmblem size={62} className="emblem-svg" />
          <div className="brand-text">
            <div className="gov-sub-hierarchy">
              {lang === "ne" ? "नेपाल सरकार • बागमती प्रदेश" : "Government of Nepal • Bagmati Province"}
            </div>
            <h1 className="gov-main-title">
              {lang === "ne" ? "काठमाडौँ महानगरपालिका" : "Kathmandu Metropolitan City"}
            </h1>
            <div className="gov-office-subtitle">
              {lang === "ne" ? "नगर कार्यपालिकाको कार्यालय, बागदरबार, काठमाडौँ" : "Office of the Municipal Executive, Bagdurbar, Kathmandu"}
            </div>
            <div className="gov-portal-tag">
              <span className="portal-pill-badge">
                {lang === "ne" ? "जनसेवा एकीकृत अनलाइन नागरिक सेवा पोर्टल" : "JanSewa Integrated Citizen Services Portal"}
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
