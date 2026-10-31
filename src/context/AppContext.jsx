import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_SERVICES,
  INITIAL_APPLICATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  MUNICIPAL_PROJECTS,
  MONTHLY_METRICS
} from "../data/syntheticData";
import { translations } from "../data/translations";
import { getStoredGeminiKey, setStoredGeminiKey } from "../services/geminiService";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState("en"); // 'en' | 'ne'
  const [role, setRole] = useState("citizen"); // 'citizen' | 'ward_staff' | 'municipality_admin' | 'district_officer'
  
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("jansewa_theme") || "light";
  });

  const [services] = useState(INITIAL_SERVICES);
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("jansewa_applications");
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("jansewa_complaints");
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [projects, setProjects] = useState(MUNICIPAL_PROJECTS);
  const [monthlyMetrics] = useState(MONTHLY_METRICS);

  // Active view navigation
  const [activeTab, setActiveTab] = useState("portal"); // 'portal' | 'tracking' | 'complaints' | 'notices' | 'analytics'
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [selectedAppForReview, setSelectedAppForReview] = useState(null);
  const [selectedAppForCertificate, setSelectedAppForCertificate] = useState(null);

  // Modals & Drawers
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Gemini API Key state
  const [apiKey, setApiKey] = useState(getStoredGeminiKey());

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Sync theme with root HTML element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("jansewa_theme", theme);
  }, [theme]);

  // Global keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem("jansewa_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("jansewa_complaints", JSON.stringify(complaints));
  }, [complaints]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr && curr.id === toast?.id ? null : curr));
    }, 4500);
  };

  const updateApiKey = (key) => {
    setStoredGeminiKey(key);
    setApiKey(key);
    showToast(key ? "System API Key updated successfully!" : "System API Key cleared. Using local baseline engine.");
  };

  // Text-To-Speech audio reader for accessibility
  const speakText = (text, targetLang = "ne-NP") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ne" ? "ne-NP" : "en-US";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast("Playing voice audio reader...", "info");
    } else {
      showToast("Speech audio is not supported in this browser.", "error");
    }
  };

  const t = translations[lang] || translations.en;

  // Actions
  const addApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
    showToast(`Application ${newApp.trackingId} submitted successfully!`, "success");
  };

  const updateApplicationStatus = (appId, newStatus, remarks, nextOfficer = "Ward Secretary") => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedHistory = [
            ...app.workflowHistory,
            {
              step: `Status updated to ${newStatus.toUpperCase()}: ${remarks}`,
              date: new Date().toISOString().replace("T", " ").substring(0, 16),
              officer: nextOfficer
            }
          ];
          return {
            ...app,
            status: newStatus,
            officialRemarks: remarks,
            workflowHistory: updatedHistory
          };
        }
        return app;
      })
    );
    showToast(`Application ${appId} updated to ${newStatus}!`, "info");
  };

  const addComplaint = (newCmp) => {
    setComplaints((prev) => [newCmp, ...prev]);
    showToast(`Grievance ${newCmp.trackingId} registered with automated triage!`, "success");
  };

  const resolveComplaint = (cmpId, notes) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === cmpId
          ? {
              ...c,
              status: "resolved",
              resolutionNotes: notes || "Resolved by Municipal Field Squad"
            }
          : c
      )
    );
    showToast("Complaint marked as Resolved!", "success");
  };

  const resetDemoData = () => {
    setApplications(INITIAL_APPLICATIONS);
    setComplaints(INITIAL_COMPLAINTS);
    localStorage.removeItem("jansewa_applications");
    localStorage.removeItem("jansewa_complaints");
    showToast("Municipal baseline data restored!", "info");
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        role,
        setRole,
        theme,
        toggleTheme,
        t,
        services,
        applications,
        complaints,
        notices,
        projects,
        monthlyMetrics,
        activeTab,
        setActiveTab,
        searchTrackingId,
        setSearchTrackingId,
        selectedAppForReview,
        setSelectedAppForReview,
        selectedAppForCertificate,
        setSelectedAppForCertificate,
        isApplyModalOpen,
        setIsApplyModalOpen,
        preselectedService,
        setPreselectedService,
        isComplaintModalOpen,
        setIsComplaintModalOpen,
        isChatbotOpen,
        setIsChatbotOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        apiKey,
        updateApiKey,
        speakText,
        toast,
        showToast,
        addApplication,
        updateApplicationStatus,
        addComplaint,
        resolveComplaint,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
