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
  const { activeTab, setActiveTab, t } = useApp();

  return (
    <nav className="secondary-nav" aria-label="Portal Sections">
      <div className="nav-links">
        <button
          type="button"
          className={`nav-item ${activeTab === "portal" ? "active" : ""}`}
          onClick={() => setActiveTab("portal")}
          aria-current={activeTab === "portal" ? "page" : undefined}
        >
          <Users size={15} />
          <span>{t.nav.citizenPortal}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => setActiveTab("staff")}
          aria-current={activeTab === "staff" ? "page" : undefined}
        >
          <ClipboardList size={15} />
          <span>{t.nav.staffPortal}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "district" ? "active" : ""}`}
          onClick={() => setActiveTab("district")}
          aria-current={activeTab === "district" ? "page" : undefined}
        >
          <Landmark size={15} />
          <span>{t.nav.districtPortal}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
          aria-current={activeTab === "analytics" ? "page" : undefined}
        >
          <BarChart3 size={15} />
          <span>{t.nav.analytics}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "tracking" ? "active" : ""}`}
          onClick={() => setActiveTab("tracking")}
          aria-current={activeTab === "tracking" ? "page" : undefined}
        >
          <FileSearch size={15} />
          <span>{t.citizen.trackApplication}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === "chatbot" ? "active" : ""}`}
          onClick={() => setActiveTab("chatbot")}
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
