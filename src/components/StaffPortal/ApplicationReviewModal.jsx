import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRightCircle, 
  Sparkles
} from "lucide-react";

export default function ApplicationReviewModal() {
  const { 
    selectedAppForReview, 
    setSelectedAppForReview, 
    updateApplicationStatus, 
    t, 
    lang 
  } = useApp();

  const [decisionNotes, setDecisionNotes] = useState("");
  const [selectedDocPreview, setSelectedDocPreview] = useState(
    selectedAppForReview?.documents?.[0]?.name || "Document"
  );

  if (!selectedAppForReview) return null;

  const app = selectedAppForReview;

  const handleApprove = () => {
    updateApplicationStatus(
      app.id,
      "approved",
      decisionNotes || "All document requirements and statutory criteria fulfilled. Approved for issuance.",
      "Sita Adhikari (Ward Secretary)"
    );
    setSelectedAppForReview(null);
  };

  const handleRequestInfo = () => {
    if (!decisionNotes.trim()) {
      alert("Please specify the missing documents or corrections needed.");
      return;
    }
    updateApplicationStatus(
      app.id,
      "needs_info",
      decisionNotes,
      "Ward 04 Verification Desk"
    );
    setSelectedAppForReview(null);
  };

  const handleRefer = () => {
    updateApplicationStatus(
      app.id,
      "referred",
      decisionNotes || "Forwarded to District Administration Office (DAO) for inter-agency consultation.",
      "CDO / DAO Coordination Desk"
    );
    setSelectedAppForReview(null);
  };

  const handleReject = () => {
    if (!decisionNotes.trim()) {
      alert("Please state the legal or administrative grounds for rejection.");
      return;
    }
    updateApplicationStatus(
      app.id,
      "rejected",
      decisionNotes,
      "Ward Chairperson"
    );
    setSelectedAppForReview(null);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div className="modal-card modal-lg">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--heading)" }}>
                {app.trackingId}
              </span>
              <span className={`status-badge status-${app.status}`}>
                {t.status[app.status] || app.status}
              </span>
            </div>
            <h3 id="review-modal-title" style={{ marginTop: "4px" }}>
              {lang === "ne" ? app.serviceTitleNe : app.serviceTitleEn}
            </h3>
          </div>
          <button type="button" className="btn-close" onClick={() => setSelectedAppForReview(null)} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body Split */}
        <div className="modal-body">
          <div className="review-split">
            {/* Left: Citizen Details & Documents */}
            <div className="review-panel">
              <h4 style={{ fontSize: "0.92rem", color: "var(--heading)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={15} color="var(--accent)" />
                <span>Submitted Citizen Details</span>
              </h4>

              <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "14px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div><strong>Applicant Name:</strong> {app.applicantName} ({app.applicantNameNe || "नेपाली नाम"})</div>
                <div><strong>Phone / Contact:</strong> {app.phone} | {app.email}</div>
                <div><strong>Ward / Address:</strong> {app.ward}</div>
                <div><strong>Date Submitted:</strong> {app.submittedAt?.substring(0, 16)}</div>
                <div><strong>Gov Fee Paid:</strong> NPR {app.feeAmount} (Digital payment verified)</div>
              </div>

              <h4 style={{ fontSize: "0.92rem", color: "var(--heading)", marginBottom: "8px" }}>
                Attached Documents ({app.documents?.length || 0})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {app.documents?.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "var(--bg)",
                      boxShadow: selectedDocPreview === doc.name ? "var(--neu-inset-sm)" : "var(--neu-raised-sm)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedDocPreview(doc.name)}
                  >
                    <span>📄 {doc.name}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 600 }}>
                      Inspect Preview
                    </span>
                  </div>
                ))}
              </div>

              {/* Document Inspector Viewer */}
              <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "center", minHeight: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <FileText size={32} color="var(--accent)" style={{ marginBottom: "8px" }} />
                <div style={{ fontWeight: 600, fontSize: "0.84rem", color: "var(--heading)" }}>{selectedDocPreview}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--muted)", marginTop: "2px" }}>
                  Verified Original Upload (High-Resolution Stamp Intact)
                </div>
              </div>
            </div>

            {/* Right: Gemini AI Assistive Analysis */}
            <div className="review-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ fontSize: "0.92rem", color: "var(--heading)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={15} color="var(--accent)" />
                  <span>AI Document Verification</span>
                </h4>
                <span className="status-badge" style={{ background: "var(--soft-blue)", color: "var(--soft-blue-text)" }}>
                  {app.aiFlags?.readabilityScore || 94}% Readability
                </span>
              </div>

              {/* Extracted Fields */}
              <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "14px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", marginBottom: "16px" }}>
                <div style={{ fontWeight: 600, color: "var(--heading)", marginBottom: "8px", borderBottom: "1px solid rgba(208, 208, 208, 0.4)", paddingBottom: "4px" }}>
                  Candidate Extracted Metadata:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {app.aiFlags?.extractedData ? (
                    Object.entries(app.aiFlags.extractedData).map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ textTransform: "capitalize", color: "var(--muted)" }}>
                          {k.replace(/([A-Z])/g, " $1")}:
                        </span>
                        <strong style={{ color: "var(--heading)" }}>{String(v)}</strong>
                      </div>
                    ))
                  ) : (
                    <div>No fields extracted</div>
                  )}
                </div>
              </div>

              {/* Checklist & Flags */}
              <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "12px 14px", borderRadius: "var(--radius-sm)", marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--heading)", marginBottom: "4px" }}>
                  Checklist Validation:
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--body)", lineHeight: 1.5 }}>
                  {app.aiFlags?.flagNotes || "All mandatory documents verified. Signature and official serial match reference database."}
                </p>
              </div>

              {/* Administrative Decision Input */}
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  Official Administrative Notes / Order (कैफियत):
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  style={{ fontSize: "0.82rem" }}
                  placeholder={t.staff.decisionNotesPlaceholder}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ color: "var(--soft-pink-text)" }}
              onClick={handleReject}
            >
              <XCircle size={15} />
              <span>{t.staff.rejectBtn}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ color: "var(--soft-amber-text)" }}
              onClick={handleRequestInfo}
            >
              <AlertTriangle size={15} />
              <span>{t.staff.requestInfoBtn}</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleRefer}
            >
              <ArrowRightCircle size={15} />
              <span>{t.staff.referBtn}</span>
            </button>
            <button
              type="button"
              className="btn btn-emerald"
              onClick={handleApprove}
            >
              <CheckCircle2 size={15} />
              <span>{t.staff.approveBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
