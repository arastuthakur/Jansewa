import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Search, 
  Clock, 
  Coins, 
  FileCheck2, 
  AlertCircle, 
  ArrowRight, 
  Megaphone, 
  FileText, 
  PlusCircle,
  Sparkles,
  Award,
  Volume2,
  X,
  Printer
} from "lucide-react";
import WardExplorer from "./WardExplorer";
import MunicipalRevenueCalculator from "./MunicipalRevenueCalculator";
import WardEmergencyDirectory from "./WardEmergencyDirectory";
import CitizenFeedbackSection from "./CitizenFeedbackSection";
import RegistrationSlipModal from "./RegistrationSlipModal";

export default function CitizenPortal() {
  const { 
    services, 
    applications, 
    notices, 
    complaints, 
    t, 
    lang, 
    setIsApplyModalOpen, 
    setPreselectedService,
    setIsComplaintModalOpen,
    setActiveTab,
    setSearchTrackingId,
    setSelectedAppForCertificate,
    speakText
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [quickTrackInput, setQuickTrackInput] = useState("");
  const [selectedAppForSlip, setSelectedAppForSlip] = useState(null);

  const filteredServices = services.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.titleEn.toLowerCase().includes(term) ||
      s.titleNe.includes(term) ||
      s.descriptionEn.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  });

  const handleApplyClick = (service) => {
    setPreselectedService(service);
    setIsApplyModalOpen(true);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      setSearchTrackingId(quickTrackInput.trim());
      setActiveTab("tracking");
    }
  };

  return (
    <div className="citizen-portal">
      {/* Hero Card - Minimal, Soft Neumorphic */}
      <div className="hero-card">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={13} />
            <span>{t.tagline}</span>
          </div>
          <h2 className="hero-title">{t.citizen.welcome}</h2>
          <p className="hero-desc">{t.disclaimer}</p>

          <div className="hero-actions">
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setPreselectedService(services[0]);
                setIsApplyModalOpen(true);
              }}
            >
              <PlusCircle size={16} />
              <span>{t.citizen.applyNow}</span>
            </button>

            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsComplaintModalOpen(true)}
            >
              <Megaphone size={16} />
              <span>{t.citizen.lodgeComplaint}</span>
            </button>

            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTab("chatbot")}
            >
              <Sparkles size={16} color="var(--accent)" />
              <span>{t.nav.aiAssistant}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tracking Card (Soft Inset Well) */}
      <div className="quick-tracking-card">
        <div>
          <h4 style={{ fontSize: "0.95rem", color: "var(--heading)", marginBottom: "4px" }}>
            {t.citizen.trackApplication}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            Instant status lookup for ward recommendations, licenses, and grievance resolutions.
          </p>
        </div>

        <form className="track-input-group" onSubmit={handleTrackSubmit}>
          <input
            type="text"
            className="input-text"
            placeholder={t.citizen.trackPlaceholder}
            value={quickTrackInput}
            onChange={(e) => setQuickTrackInput(e.target.value)}
            aria-label="Application Tracking ID"
          />
          <button type="submit" className="btn btn-dark">
            <Search size={15} />
            <span>Track</span>
          </button>
        </form>
      </div>

      {/* Search and Service Catalogue Header */}
      <div className="section-header">
        <h3 className="section-title">
          <FileText size={18} color="var(--accent)" />
          <span>{t.citizen.popularServices} ({filteredServices.length})</span>
        </h3>
        <div style={{ maxWidth: "300px", width: "100%", position: "relative" }}>
          <input
            type="text"
            className="input-text"
            placeholder={t.citizen.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filter services"
            style={{ width: "100%" }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)"
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Services (Neumorphic Soft Cards) */}
      <div className="service-grid">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-card-top">
              <div className="service-header-row">
                <span className="service-code">{service.code}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn-neu"
                    style={{ padding: "3px 8px", fontSize: "0.72rem", gap: "4px" }}
                    onClick={() => {
                      const text = lang === "ne"
                        ? `${service.titleNe}। शुल्क: रु. ${service.feeNpr}। आवश्यक कागजातहरू: ${service.requiredDocs.join(", ")}। कार्य सम्पादन समय: ${service.processingDays} दिन।`
                        : `${service.titleEn}. Fee: NPR ${service.feeNpr}. Required documents: ${service.requiredDocs.join(", ")}. SLA: ${service.processingDays} days.`;
                      speakText(text);
                    }}
                    title="Listen to service details (Audio Reader)"
                    aria-label="Listen to service details"
                  >
                    <Volume2 size={12} color="var(--accent)" />
                    <span>Listen</span>
                  </button>
                  <span className="meta-pill">{service.category}</span>
                </div>
              </div>
              <h3>{lang === "ne" ? service.titleNe : service.titleEn}</h3>
              <p className="service-card-desc">
                {lang === "ne" ? service.descriptionNe : service.descriptionEn}
              </p>

              <div className="service-meta-pills">
                <span className="meta-pill">
                  <Clock size={12} color="var(--muted)" />
                  {service.processingDays} {t.citizen.days}
                </span>
                <span className="meta-pill">
                  <Coins size={12} color="var(--accent)" />
                  NPR {service.feeNpr}
                </span>
                <span className="meta-pill" style={{ color: "var(--soft-blue-text)", background: "var(--soft-blue)" }}>
                  <Sparkles size={11} />
                  AI Verified OCR
                </span>
              </div>

              <div className="service-docs-list">
                <strong>{t.citizen.reqDocs}:</strong>
                <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                  {service.requiredDocs.slice(0, 3).map((doc, idx) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>{doc}</li>
                  ))}
                  {service.requiredDocs.length > 3 && (
                    <li style={{ fontStyle: "italic", color: "var(--accent)" }}>
                      +{service.requiredDocs.length - 3} more items...
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="service-card-bottom">
              <div>
                <span className="service-fee-label">{t.citizen.fee}:</span>
                <div className="service-fee-val">NPR {service.feeNpr}</div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleApplyClick(service)}
              >
                <span>{t.citizen.applyNow}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kathmandu Wards Status Explorer (Open Source Interactive Element) */}
      <WardExplorer />

      {/* Municipal Revenue & Fee Estimator (Local Government Operation Act 2074 & KMC Act 2080) */}
      <MunicipalRevenueCalculator />

      {/* Ward 04 & KMC Emergency Helpline Directory */}
      <WardEmergencyDirectory />

      {/* My Submitted Applications */}
      <div className="section-header" style={{ marginTop: "40px" }}>
        <h3 className="section-title">
          <FileCheck2 size={18} color="var(--soft-sage-text)" />
          <span>{t.citizen.myApplications}</span>
        </h3>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          Showing submissions ({applications.length})
        </span>
      </div>

      <div className="table-responsive" style={{ marginBottom: "40px" }}>
        <table className="gov-table">
          <thead>
            <tr>
              <th>{t.staff.trackingId}</th>
              <th>{t.staff.serviceType}</th>
              <th>{t.staff.applicantName}</th>
              <th>{t.staff.submittedOn}</th>
              <th>Status</th>
              <th>AI Verification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--heading)" }}>
                    {app.trackingId}
                  </span>
                </td>
                <td>
                  <strong>{lang === "ne" ? app.serviceTitleNe : app.serviceTitleEn}</strong>
                  <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>{app.ward}</div>
                </td>
                <td>{lang === "ne" ? app.applicantNameNe || app.applicantName : app.applicantName}</td>
                <td>{app.submittedAt?.substring(0, 10)}</td>
                <td>
                  <span className={`status-badge status-${app.status}`}>
                    {t.status[app.status] || app.status}
                  </span>
                </td>
                <td>
                  <span className="ai-chip">
                    <Sparkles size={10} />
                    {app.aiFlags?.readabilityScore || 90}% Match
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: "5px 10px", fontSize: "0.74rem" }}
                      onClick={() => {
                        setSearchTrackingId(app.trackingId);
                        setActiveTab("tracking");
                      }}
                    >
                      Track
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: "5px 10px", fontSize: "0.74rem", gap: "4px" }}
                      onClick={() => setSelectedAppForSlip(app)}
                      title="View / Print Digital Acknowledgment Slip"
                    >
                      <Printer size={12} color="var(--accent)" />
                      <span>{lang === "ne" ? "निस्सा" : "Slip"}</span>
                    </button>
                    {app.status === "approved" && (
                      <button
                        type="button"
                        className="btn btn-emerald"
                        style={{ padding: "5px 10px", fontSize: "0.74rem" }}
                        onClick={() => setSelectedAppForCertificate(app)}
                        title="View Official Certificate"
                      >
                        <Award size={13} />
                        Certificate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Two-Column Bottom: Public Complaints & Ward Notices */}
      <div className="portal-two-col" style={{ marginBottom: "32px" }}>
        {/* Complaints Section */}
        <div style={{ background: "var(--bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--neu-raised)" }}>
          <div className="section-header">
            <h4 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.05rem" }}>
              <Megaphone size={17} color="var(--soft-pink-text)" />
              <span>Public Grievances & Triage</span>
            </h4>
            <button 
              type="button"
              className="btn btn-outline"
              style={{ padding: "5px 12px", fontSize: "0.76rem" }}
              onClick={() => setIsComplaintModalOpen(true)}
            >
              + New Report
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {complaints.map((c) => (
              <div 
                key={c.id} 
                style={{ 
                  padding: "14px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--bg)",
                  boxShadow: "var(--neu-raised-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 600, color: "var(--accent)" }}>
                    {c.trackingId}
                  </span>
                  <span className={`status-badge status-${c.status === 'resolved' ? 'approved' : 'under_review'}`}>
                    {c.status}
                  </span>
                </div>
                <h5 style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                  {lang === "ne" ? c.titleNe || c.title : c.title}
                </h5>
                <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginBottom: "8px" }}>
                  📍 {c.location}
                </div>
                <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.74rem", color: "var(--soft-blue-text)" }}>
                  <Sparkles size={11} style={{ display: "inline", marginRight: "4px" }} />
                  <strong>AI Routing:</strong> {c.aiAnalysis?.suggestedDepartment} ({c.aiAnalysis?.detectedUrgency})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices Board */}
        <div style={{ background: "var(--bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--neu-raised)" }}>
          <div className="section-header">
            <h4 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.05rem" }}>
              <AlertCircle size={17} color="var(--soft-amber-text)" />
              <span>{t.citizen.recentNotices}</span>
            </h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {notices.map((n) => (
              <div 
                key={n.id} 
                style={{ 
                  padding: "14px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--bg)",
                  boxShadow: "var(--neu-raised-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: "var(--muted)", marginBottom: "4px" }}>
                  <span>{n.issuedBy} • {n.date}</span>
                  <button
                    type="button"
                    className="btn-neu"
                    style={{ padding: "2px 6px", fontSize: "0.7rem", gap: "3px" }}
                    onClick={() => {
                      const text = lang === "ne" 
                        ? `${n.titleNe}। ${n.contentNe}` 
                        : `${n.titleEn}. ${n.contentEn}`;
                      speakText(text);
                    }}
                    title="Listen to notice"
                    aria-label="Listen to notice"
                  >
                    <Volume2 size={11} color="var(--accent)" />
                    <span>Audio</span>
                  </button>
                </div>
                <h5 style={{ fontSize: "0.9rem", color: "var(--heading)", marginBottom: "6px" }}>
                  {lang === "ne" ? n.titleNe : n.titleEn}
                </h5>
                <p style={{ fontSize: "0.82rem", color: "var(--body)", lineHeight: 1.5 }}>
                  {lang === "ne" ? n.contentNe : n.contentEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citizen Feedback Survey (Good Governance Act 2064, Section 84) */}
      <CitizenFeedbackSection />

      {/* Printable Registration Slip Modal */}
      {selectedAppForSlip && (
        <RegistrationSlipModal
          app={selectedAppForSlip}
          onClose={() => setSelectedAppForSlip(null)}
        />
      )}
    </div>
  );
}
