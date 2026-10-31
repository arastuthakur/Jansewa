import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Users, 
  ClipboardList, 
  Landmark, 
  FileSearch, 
  MessageSquareCode 
} from "lucide-react";

export default function MobileBottomNav() {
  const { activeTab, setActiveTab, setRole, lang } = useApp();

  const navItems = [
    {
      id: "portal",
      role: "citizen",
      icon: <Users size={20} />,
      labelNe: "नागरिक सेवा",
      labelEn: "Services"
    },
    {
      id: "staff",
      role: "ward_staff",
      icon: <ClipboardList size={20} />,
      labelNe: "वडा कार्यकक्ष",
      labelEn: "Staff Desk"
    },
    {
      id: "district",
      role: "district_officer",
      icon: <Landmark size={20} />,
      labelNe: "प्रजिअ/DAO",
      labelEn: "DAO Desk"
    },
    {
      id: "tracking",
      role: "citizen",
      icon: <FileSearch size={20} />,
      labelNe: "ट्र्याकिङ",
      labelEn: "Tracking"
    },
    {
      id: "chatbot",
      role: "citizen",
      icon: <MessageSquareCode size={20} />,
      labelNe: "एआई साथी",
      labelEn: "AI Sathi",
      highlight: true
    }
  ];

  const handleSelect = (tab, targetRole) => {
    setActiveTab(tab);
    if (targetRole) {
      setRole(targetRole);
    }
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        // Safe fallback in test runners
      }
    }
  };

  return (
    <nav 
      className="mobile-bottom-bar" 
      aria-label="Mobile Bottom Navigation"
      role="navigation"
    >
      <div className="mobile-bottom-inner">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-bottom-item ${isActive ? "active" : ""} ${item.highlight ? "highlight" : ""}`}
              onClick={() => handleSelect(item.id, item.role)}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mobile-bottom-icon-wrap">
                {item.icon}
                {item.highlight && <span className="mobile-ai-pulse" />}
              </span>
              <span className="mobile-bottom-label">
                {lang === "ne" ? item.labelNe : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
