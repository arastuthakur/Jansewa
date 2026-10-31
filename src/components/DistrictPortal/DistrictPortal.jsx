import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Landmark, 
  ShieldAlert, 
  FileCheck2, 
  CheckCircle
} from "lucide-react";

export default function DistrictPortal() {
  const { applications, complaints, updateApplicationStatus, resolveComplaint, t, lang, showToast } = useApp();

  const referredApps = applications.filter((a) => a.status === "referred");
  const urgentComplaints = complaints.filter(
    (c) => c.priority === "Emergency" || c.priority === "High"
  );

  const [cdoRemarks, setCdoRemarks] = useState("");

  const handleEndorseReferral = (app) => {
    updateApplicationStatus(
      app.id,
      "approved",
      cdoRemarks || "DAO Kathmandu / CDO Office concurred. Authorized for municipal recommendation.",
      "Chief District Officer (CDO Kathmandu)"
    );
    showToast(`Case ${app.trackingId} endorsed and returned to Ward Office!`, "success");
    setCdoRemarks("");
  };

  const handleResolveUrgentGrievance = (cmpId) => {
    resolveComplaint(cmpId, "DAO Emergency Coordination Unit dispatched field response squad.");
  };

  return (
    <div className="district-portal">
      {/* Title */}
      <div className="section-header" style={{ marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", color: "var(--heading)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Landmark size={22} color="var(--accent)" />
            <span>{t.dao.title}</span>
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "3px" }}>
            {t.dao.subtitle}
          </p>
        </div>
      </div>

      {/* Grid: Left = Escalated Referrals Queue, Right = District Emergency Grievances */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
        {/* Referrals Section */}
        <div style={{ background: "var(--bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--neu-raised)" }}>
          <div className="section-header">
            <h3 style={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--heading)" }}>
              <FileCheck2 size={17} color="var(--accent)" />
              <span>{t.dao.referralsQueue} ({referredApps.length})</span>
            </h3>
          </div>

          {referredApps.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {referredApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: "18px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg)",
                    boxShadow: "var(--neu-raised-sm)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--heading)" }}>
                      {app.trackingId}
                    </span>
                    <span className="status-badge status-referred">From Ward 04</span>
                  </div>

                  <h4 style={{ fontSize: "0.95rem", marginBottom: "4px" }}>
                    {app.applicantName} - {app.serviceTitleEn}
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "10px" }}>
                    <strong>Ward Referral Memo:</strong> {app.officialRemarks}
                  </p>

                  <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "10px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", marginBottom: "14px" }}>
                    <strong>AI Verification Note:</strong> {app.aiFlags?.flagNotes}
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="CDO Official Endorsement Order / Concurrence Remarks..."
                      style={{ fontSize: "0.8rem" }}
                      value={cdoRemarks}
                      onChange={(e) => setCdoRemarks(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-emerald"
                      style={{ fontSize: "0.76rem", padding: "6px 14px" }}
                      onClick={() => handleEndorseReferral(app)}
                    >
                      <CheckCircle size={14} />
                      <span>{t.dao.resolveReferral}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", borderRadius: "var(--radius-md)" }}>
              <CheckCircle size={28} color="var(--soft-sage-text)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: "0.85rem" }}>No pending inter-office referrals from municipality wards.</p>
            </div>
          )}
        </div>

        {/* High-Priority Public Grievances at District Level */}
        <div style={{ background: "var(--bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--neu-raised)" }}>
          <div className="section-header">
            <h3 style={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--heading)" }}>
              <ShieldAlert size={17} color="var(--soft-pink-text)" />
              <span>{t.dao.districtGrievances} ({urgentComplaints.length})</span>
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {urgentComplaints.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg)",
                  boxShadow: "var(--neu-raised-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--heading)" }}>
                    {c.trackingId}
                  </span>
                  <span className="status-badge" style={{ background: "var(--soft-pink)", color: "var(--soft-pink-text)" }}>
                    {c.priority}
                  </span>
                </div>

                <h4 style={{ fontSize: "0.9rem", color: "var(--heading)", marginBottom: "4px" }}>
                  {c.title}
                </h4>
                <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginBottom: "8px" }}>
                  📍 {c.location} ({c.ward})
                </div>

                <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", marginBottom: "12px" }}>
                  <strong>AI Urgency Assessment:</strong> {c.aiAnalysis?.detectedUrgency}
                </div>

                {c.status !== "resolved" ? (
                  <button
                    type="button"
                    className="btn btn-dark"
                    style={{ width: "100%", fontSize: "0.78rem", padding: "7px 12px" }}
                    onClick={() => handleResolveUrgentGrievance(c.id)}
                  >
                    <span>Authorize Emergency Inter-Agency Action</span>
                  </button>
                ) : (
                  <span style={{ fontSize: "0.76rem", color: "var(--soft-sage-text)", fontWeight: 600 }}>
                    ✓ Action Logged & Transmitted
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
