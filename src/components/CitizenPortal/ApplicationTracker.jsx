import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Search, 
  CheckCircle, 
  FileCheck, 
  Sparkles, 
  Award,
  History,
  AlertCircle
} from "lucide-react";

export default function ApplicationTracker() {
  const { 
    applications, 
    searchTrackingId, 
    setSearchTrackingId, 
    t, 
    lang, 
    setSelectedAppForCertificate 
  } = useApp();

  const [inputVal, setInputVal] = useState(searchTrackingId || applications[0]?.trackingId || "");

  const activeApp = applications.find(
    (a) => a.trackingId.toLowerCase() === inputVal.trim().toLowerCase()
  ) || applications[0];

  const pipelineStages = [
    { key: "submitted", labelEn: "Submitted", labelNe: "दर्ता भएको" },
    { key: "under_review", labelEn: "Under Review", labelNe: "जाँच हुँदै" },
    { key: "action", labelEn: "Verification", labelNe: "प्रमाणीकरण" },
    { key: "decision", labelEn: "Decision Recorded", labelNe: "आधिकारिक निर्णय" },
    { key: "completed", labelEn: "Certificate Issued", labelNe: "सिफारिस जारी" }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case "submitted": return 0;
      case "under_review": return 1;
      case "needs_info":
      case "referred": return 2;
      case "approved":
      case "rejected": return 3;
      case "completed": return 4;
      default: return 0;
    }
  };

  const currentStageIdx = getStageIndex(activeApp?.status);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Search Header */}
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <h3 className="section-title">
          <FileCheck size={20} color="var(--accent)" />
          <span>{t.citizen.trackApplication}</span>
        </h3>
      </div>

      <div className="quick-tracking-card" style={{ marginBottom: "28px" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--heading)", display: "block", marginBottom: "6px" }}>
            Enter Tracking Code (उदा: JSN-KTM04-2026-004128)
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              className="input-text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. JSN-KTM04-2026-004128"
              aria-label="Application tracking identifier"
            />
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setSearchTrackingId(inputVal)}
            >
              <Search size={15} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Quick select chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Recent:</span>
          {applications.slice(0, 3).map((app) => (
            <button
              key={app.id}
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: "0.72rem", padding: "4px 10px" }}
              onClick={() => {
                setInputVal(app.trackingId);
                setSearchTrackingId(app.trackingId);
              }}
            >
              {app.trackingId}
            </button>
          ))}
        </div>
      </div>

      {activeApp ? (
        <div style={{ background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: "32px", boxShadow: "var(--neu-raised)" }}>
          {/* Top Info Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(208, 208, 208, 0.4)", paddingBottom: "22px", marginBottom: "26px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "1.15rem", fontWeight: 700, color: "var(--heading)" }}>
                  {activeApp.trackingId}
                </span>
                <span className={`status-badge status-${activeApp.status}`}>
                  {t.status[activeApp.status] || activeApp.status}
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", color: "var(--heading)", marginBottom: "4px" }}>
                {lang === "ne" ? activeApp.serviceTitleNe : activeApp.serviceTitleEn}
              </h2>
              <p style={{ fontSize: "0.84rem", color: "var(--muted)" }}>
                Applicant: <strong>{activeApp.applicantName}</strong> • {activeApp.ward} • Submitted: {activeApp.submittedAt?.substring(0, 10)}
              </p>
            </div>

            {activeApp.status === "approved" && (
              <button
                type="button"
                className="btn btn-emerald"
                onClick={() => setSelectedAppForCertificate(activeApp)}
                style={{ padding: "10px 18px" }}
              >
                <Award size={16} />
                <span>Download Official Certificate</span>
              </button>
            )}
          </div>

          {/* Pipeline Visual Stepper (Neumorphic Inset Tray) */}
          <div style={{ marginBottom: "32px", background: "var(--bg)", padding: "20px 24px", borderRadius: "var(--radius-md)", boxShadow: "var(--neu-inset)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
              {pipelineStages.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div
                    key={stage.key}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      flex: 1,
                      position: "relative",
                      zIndex: 2
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isPassed ? "var(--accent)" : "var(--bg)",
                        color: isPassed ? "#ffffff" : "var(--muted)",
                        boxShadow: isPassed 
                          ? "3px 3px 8px var(--shadow), -2px -2px 6px var(--highlight)"
                          : "var(--neu-inset-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        transition: "var(--transition)",
                        marginBottom: "8px"
                      }}
                    >
                      {isPassed ? <CheckCircle size={16} /> : idx + 1}
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: isCurrent ? 600 : 400, color: isCurrent ? "var(--heading)" : "var(--muted)" }}>
                      {lang === "ne" ? stage.labelNe : stage.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Details & AI Intelligence */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "28px" }}>
            {/* Left: General & Official Remarks */}
            <div>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "12px", color: "var(--heading)" }}>
                Application Particulars
              </h4>
              <div style={{ background: "var(--bg)", boxShadow: "var(--neu-raised-sm)", padding: "18px", borderRadius: "var(--radius-md)", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div><strong>Applicant:</strong> {activeApp.applicantName} ({activeApp.applicantNameNe || "नेपाली नाम"})</div>
                <div><strong>Contact:</strong> {activeApp.phone} | {activeApp.email}</div>
                <div><strong>Location:</strong> {activeApp.ward}</div>
                <div><strong>Fee Status:</strong> Paid (NPR {activeApp.feeAmount})</div>
                <div>
                  <strong>Official Remarks:</strong>
                  <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "10px 14px", borderRadius: "var(--radius-sm)", marginTop: "6px", color: "var(--heading)", lineHeight: 1.5 }}>
                    {activeApp.officialRemarks || "Application is undergoing administrative examination."}
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <h4 style={{ fontSize: "0.95rem", margin: "18px 0 8px", color: "var(--heading)" }}>
                Uploaded Documents ({activeApp.documents?.length || 0})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {activeApp.documents?.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "var(--bg)",
                      boxShadow: "var(--neu-raised-sm)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8rem"
                    }}
                  >
                    <span>📄 {doc.name}</span>
                    <span style={{ color: "var(--soft-sage-text)", fontWeight: 600 }}>✓ Verified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Gemini AI Verification Summary */}
            <div>
              <div style={{ background: "var(--bg)", boxShadow: "var(--neu-raised-sm)", borderRadius: "var(--radius-md)", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <Sparkles size={16} color="var(--accent)" />
                  <h4 style={{ fontSize: "0.95rem", color: "var(--heading)", margin: 0 }}>
                    Gemini AI Assistive Inspection
                  </h4>
                </div>

                <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "12px 14px", borderRadius: "var(--radius-sm)", marginBottom: "14px", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>OCR Readability:</span>
                    <strong>{activeApp.aiFlags?.readabilityScore || 94}% Confidence</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Checklist Match:</span>
                    <strong style={{ color: "var(--soft-sage-text)" }}>{activeApp.aiFlags?.completeness || "100% Complete"}</strong>
                  </div>
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--body)", lineHeight: 1.5 }}>
                  <strong>Notes:</strong> {activeApp.aiFlags?.flagNotes || "All mandatory certificates present and match municipal criteria."}
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Chronology Timeline */}
          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <History size={16} color="var(--accent)" />
              <span>Full Audit Trail & Movement History</span>
            </h4>

            <div className="timeline">
              {activeApp.workflowHistory?.map((hist, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-step">{hist.step}</div>
                    <div className="timeline-meta">
                      🕒 {hist.date} • Handled by: <strong>{hist.officer}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg)", borderRadius: "var(--radius-lg)", boxShadow: "var(--neu-raised)" }}>
          <AlertCircle size={36} color="var(--soft-amber-text)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem" }}>No Application Found</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Please verify your tracking code and try again.</p>
        </div>
      )}
    </div>
  );
}
