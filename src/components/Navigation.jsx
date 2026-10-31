import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Users, 
  ClipboardList, 
  Landmark, 
  BarChart3, 
  MessageSquareCode, 
  FileSearch
} from "lucide-react";

export default function Navigation() {
  const { activeTab, setActiveTab, setRole, t } = useApp();

  const handleNavClick = (tab, targetRole) => {
    setActiveTab(tab);
    if (targetRole) {
      setRole(targetRole);
    }
  };

  return (
    <nav className="secondary-nav" aria-label="Portal Sections">
      <div className="nav-links">
        <button
          type="button"
          className={`nav-item ${activeTab === "portal" ? "active" : ""}`}
          onClick={() => handleNavClick("portal", "citizen")}
          aria-current={activeTab === "portal" ? "page" : undefined}
        >
          <Users size={15} />
          <span>{t.nav.citizenPortal}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => handleNavClick("staff", "ward_staff")}
          aria-current={activeTab === "staff" ? "page" : undefined}
        >
          <ClipboardList size={15} />
          <span>{t.nav.staffPortal}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "district" ? "active" : ""}`}
          onClick={() => handleNavClick("district", "district_officer")}
          aria-current={activeTab === "district" ? "page" : undefined}
        >
          <Landmark size={15} />
          <span>{t.nav.districtPortal}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => handleNavClick("analytics", "municipality_admin")}
          aria-current={activeTab === "analytics" ? "page" : undefined}
        >
          <BarChart3 size={15} />
          <span>{t.nav.analytics}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "tracking" ? "active" : ""}`}
          onClick={() => handleNavClick("tracking", "citizen")}
          aria-current={activeTab === "tracking" ? "page" : undefined}
        >
          <FileSearch size={15} />
          <span>{t.citizen.trackApplication}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "chatbot" ? "active" : ""}`}
          onClick={() => handleNavClick("chatbot", "citizen")}
          aria-current={activeTab === "chatbot" ? "page" : undefined}
          style={{ color: "var(--accent)" }}
        >
          <MessageSquareCode size={15} />
          <span>{t.nav.aiAssistant}</span>
        </button>
      </div>
    </nav>
  );
}
