import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Building2,
  Briefcase,
  Landmark,
  BarChart3,
  SearchCode,
  Sparkles,
  Sun,
  Moon,
  Languages,
  Megaphone,
  FileText,
  CornerDownLeft,
  X,
  RotateCcw
} from "lucide-react";

export default function CommandPaletteModal() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setRole,
    services,
    setPreselectedService,
    setIsApplyModalOpen,
    setIsComplaintModalOpen,
    lang,
    setLang,
    theme,
    toggleTheme,
    resetDemoData
  } = useApp();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Construct command actions
  const navigationItems = [
    {
      id: "nav-portal",
      category: "Navigation",
      title: lang === "ne" ? "नागरिक सेवा पोर्टल" : "Citizen Public Services Portal",
      subtitle: "Browse 8 municipal public services and track submissions",
      icon: <Building2 size={16} color="var(--accent)" />,
      action: () => {
        setRole("citizen");
        setActiveTab("portal");
      }
    },
    {
      id: "nav-staff",
      category: "Navigation",
      title: lang === "ne" ? "वडा नं. ०४ कर्मचारी डेस्क" : "Ward 04 Staff Verification Queue",
      subtitle: "Review applications, verify documents, and issue certificates",
      icon: <Briefcase size={16} color="var(--accent)" />,
      action: () => {
        setRole("ward_staff");
        setActiveTab("staff");
      }
    },
    {
      id: "nav-district",
      category: "Navigation",
      title: lang === "ne" ? "प्रजिअ / DAO समन्वय डेस्क" : "CDO / DAO District Coordination Desk",
      subtitle: "Monitor cross-ward grievance triage, security, and emergency operations",
      icon: <Landmark size={16} color="var(--accent)" />,
      action: () => {
        setRole("district_officer");
        setActiveTab("district");
      }
    },
    {
      id: "nav-analytics",
      category: "Navigation",
      title: lang === "ne" ? "नगरपालिका विश्लेषण ड्यासबोर्ड" : "Municipal Intelligence & Analytics",
      subtitle: "Ward performance, SLA compliance rates, and predictive trends",
      icon: <BarChart3 size={16} color="var(--accent)" />,
      action: () => {
        setActiveTab("analytics");
      }
    },
    {
      id: "nav-track",
      category: "Navigation",
      title: lang === "ne" ? "आवेदन स्थिति ट्र्याकिङ" : "Track Application by ID",
      subtitle: "Lookup real-time status of recommendations, licenses, or complaints",
      icon: <SearchCode size={16} color="var(--accent)" />,
      action: () => {
        setActiveTab("tracking");
      }
    },
    {
      id: "nav-chatbot",
      category: "Navigation",
      title: lang === "ne" ? "जनसेवा साथी (एआई सहायक)" : "JanSewa Sathi (Municipal Assistant)",
      subtitle: "Bilingual conversation for government procedures, citizenship, and ward bylaws",
      icon: <Sparkles size={16} color="var(--accent)" />,
      action: () => {
        setActiveTab("chatbot");
      }
    }
  ];

  const serviceItems = services.map((svc) => ({
    id: `svc-${svc.id}`,
    category: "Municipal Services",
    title: lang === "ne" ? svc.titleNe : svc.titleEn,
    subtitle: `${svc.code} • NPR ${svc.feeNpr} • ${svc.processingDays} days SLA`,
    icon: <FileText size={16} color="var(--soft-blue-text)" />,
    action: () => {
      setPreselectedService(svc);
      setIsApplyModalOpen(true);
    }
  }));

  const systemItems = [
    {
      id: "sys-theme",
      category: "System Preferences",
      title: theme === "dark" 
        ? (lang === "ne" ? "उज्यालो मोडमा परिवर्तन गर्नुहोस्" : "Switch to Soft Light Mode") 
        : (lang === "ne" ? "गाढा मोडमा परिवर्तन गर्नुहोस्" : "Switch to Deep Dark Mode"),
      subtitle: `Current active theme: ${theme.toUpperCase()}`,
      icon: theme === "dark" ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="var(--accent)" />,
      action: () => toggleTheme()
    },
    {
      id: "sys-lang",
      category: "System Preferences",
      title: lang === "en" ? "नेपाली भाषामा बदल्नुहोस् (Switch to Nepali)" : "Switch to English",
      subtitle: "Toggle bilingual interface dictionary",
      icon: <Languages size={16} color="var(--accent)" />,
      action: () => setLang(lang === "en" ? "ne" : "en")
    },
    {
      id: "sys-grievance",
      category: "System Preferences",
      title: lang === "ne" ? "नागरिक गुनासो दर्ता गर्नुहोस्" : "Lodge Citizen Grievance / Complaint",
      subtitle: "Automated municipal triage with ward routing and priority classification",
      icon: <Megaphone size={16} color="#EF4444" />,
      action: () => setIsComplaintModalOpen(true)
    },
    {
      id: "sys-reset",
      category: "System Preferences",
      title: lang === "ne" ? "परीक्षण डेटा रिसेट गर्नुहोस्" : "Restore Baseline Municipal Records",
      subtitle: "Reset all mock applications and complaints to standard state",
      icon: <RotateCcw size={16} color="var(--muted)" />,
      action: () => resetDemoData()
    }
  ];

  const allItems = [...navigationItems, ...serviceItems, ...systemItems];

  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={() => setIsCommandPaletteOpen(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "12vh",
        backdropFilter: "blur(4px)"
      }}
    >
      <div 
        className="modal-card command-palette-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "680px",
          width: "92%",
          padding: "16px",
          overflow: "hidden"
        }}
      >
        {/* Command Search Bar */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 16px",
            boxShadow: "var(--neu-inset)",
            borderRadius: "var(--radius-pill)",
            marginBottom: "16px"
          }}
        >
          <Search size={18} color="var(--accent)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={lang === "ne" ? "सेवा, पोर्टल वा कार्य खोज्नुहोस्..." : "Type a command, service name, or action..."}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--heading)",
              fontSize: "0.98rem",
              fontFamily: "inherit"
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)" }}
            >
              <X size={15} />
            </button>
          )}
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "var(--highlight)",
              color: "var(--muted)",
              boxShadow: "var(--neu-inset-sm)"
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          style={{
            maxHeight: "380px",
            overflowY: "auto",
            paddingRight: "4px"
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--muted)" }}>
              <p style={{ fontSize: "0.95rem", marginBottom: "4px" }}>No matching commands or services found.</p>
              <p style={{ fontSize: "0.8rem" }}>Try searching for "Birth", "Ward", "Dark", "DAO", or "Grievance".</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    margin: "4px 0",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    boxShadow: isSelected ? "var(--neu-pressed)" : "none",
                    background: isSelected ? "var(--bg-surface)" : "transparent",
                    transition: "var(--transition)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div 
                      style={{
                        padding: "8px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--highlight)",
                        boxShadow: "var(--neu-raised-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--bg)",
                        boxShadow: "var(--neu-inset-sm)",
                        color: "var(--muted)"
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={14} color="var(--accent)" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div 
          style={{
            borderTop: "1px solid rgba(208, 208, 208, 0.3)",
            marginTop: "12px",
            paddingTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.72rem",
            color: "var(--muted)"
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <span><kbd style={{ padding: "1px 4px", borderRadius: "3px", background: "var(--highlight)", boxShadow: "var(--neu-inset-sm)" }}>↑↓</kbd> to navigate</span>
            <span><kbd style={{ padding: "1px 4px", borderRadius: "3px", background: "var(--highlight)", boxShadow: "var(--neu-inset-sm)" }}>↵</kbd> to select</span>
            <span><kbd style={{ padding: "1px 4px", borderRadius: "3px", background: "var(--highlight)", boxShadow: "var(--neu-inset-sm)" }}>esc</kbd> to close</span>
          </div>
          <div>
            <span>{filteredItems.length} available actions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
