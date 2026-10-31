import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Landmark, 
  ShieldAlert, 
  FileCheck2, 
  CheckCircle,
  Clock,
  Radio,
  Send,
  AlertTriangle,
  Siren,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function DistrictPortal() {
  const { applications, complaints, updateApplicationStatus, resolveComplaint, t, lang, showToast } = useApp();

  const referredApps = applications.filter((a) => a.status === "referred");
  const urgentComplaints = complaints.filter(
    (c) => c.priority === "Emergency" || c.priority === "High"
  );

  const [cdoRemarks, setCdoRemarks] = useState("");
  const [incidents, setIncidents] = useState([
    {
      id: "inc-1",
      titleNe: "विष्णुमती करिडोर बाढी सतर्कता तथा बस्ती अनुगमन",
      titleEn: "Bishnumati River Corridor Inundation Alert",
      units: "KMC Disaster Police + APF No. 20 Battallion",
      status: "dispatched",
      level: "Level 2 Alert",
      time: "24 mins ago"
    },
    {
      id: "inc-2",
      titleNe: "माइतीघर-बानेश्वर सडकखण्ड भीभीआईपी सुरक्षा समन्वय",
      titleEn: "Maitighar-Baneshwor VIP Corridor Route Management",
      units: "Kathmandu Traffic Division + Nepal Police",
      status: "active",
      level: "Routine Protocol",
      time: "1 hour ago"
    },
    {
      id: "inc-3",
      titleNe: "थानकोट-नागढुङ्गा प्रवेशद्वार सडक अवरोध हटाउने कार्य",
      titleEn: "Nagdhunga Gateway Emergency Road Clearance",
      units: "DoR Rapid Heavy Equipment Squad",
      status: "resolved",
      level: "Resolved",
      time: "2 hours ago"
    }
  ]);

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

  const handleDispatchOrder = (incId) => {
    setIncidents(prev => prev.map(inc => inc.id === incId ? { ...inc, status: "dispatched", level: "Field Response Mobilized" } : inc));
    showToast(lang === "ne" ? "सुरक्षा तथा उद्धार टोली परिचालन आदेश जारी भयो!" : "Inter-agency emergency dispatch orders transmitted!", "success");
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
            {t.dao.subtitle} • काठमाडौँ जिल्ला प्रशासन कार्यालय, बबरमहल
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="portal-pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <Radio size={12} color="#10B981" />
            <span>{lang === "ne" ? "जिल्ला कमान्ड नेटवर्क: सक्रिय" : "DAO Command Net: Live"}</span>
          </span>
        </div>
      </div>

      {/* DAO Inter-Agency Emergency Command Bar (District Disaster Management) */}
      <div style={{ background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: "22px", boxShadow: "var(--neu-raised)", marginBottom: "28px" }}>
        <div className="section-header" style={{ marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--heading)" }}>
              <Siren size={18} color="#EF4444" />
              <span>{lang === "ne" ? "काठमाडौँ जिल्ला विपद् तथा सुरक्षा समन्वय कक्ष (DEOC)" : "Kathmandu District Emergency Operations Command (DEOC)"}</span>
            </h3>
            <p style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: "2px" }}>
              Inter-agency coordination between Nepal Police, Armed Police Force (APF), and KMC Emergency Unit under Good Governance Act 2064.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {incidents.map((inc) => (
            <div
              key={inc.id}
              style={{
                background: "var(--bg)",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                boxShadow: "var(--neu-raised-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "10px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: inc.status === "resolved" ? "var(--soft-sage)" : "var(--soft-pink)", color: inc.status === "resolved" ? "var(--soft-sage-text)" : "var(--soft-pink-text)" }}>
                    {inc.level}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{inc.time}</span>
                </div>
                <h4 style={{ fontSize: "0.86rem", color: "var(--heading)", marginBottom: "4px" }}>
                  {lang === "ne" ? inc.titleNe : inc.titleEn}
                </h4>
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  🛡️ {inc.units}
                </div>
              </div>

              <div>
                {inc.status === "active" ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", fontSize: "0.74rem", padding: "6px" }}
                    onClick={() => handleDispatchOrder(inc.id)}
                  >
                    <span>{lang === "ne" ? "टोली परिचालन आदेश (Dispatch)" : "Authorize Dispatch"}</span>
                  </button>
                ) : (
                  <span style={{ fontSize: "0.72rem", color: "var(--soft-sage-text)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={13} />
                    <span>{lang === "ne" ? "कार्यक्षेत्रमा टोली परिचालन भयो" : "Units Deployed On-Site"}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Left = Escalated Referrals Queue with Statutory 24-hr Countdown, Right = District Emergency Grievances */}
      <div className="portal-two-col">
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--heading)" }}>
                      {app.trackingId}
                    </span>
                    <span className="status-badge status-referred">Ward 04 Escalation</span>
                  </div>

                  {/* 24-Hour Statutory SLA Countdown Progress */}
                  <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "8px 12px", borderRadius: "var(--radius-sm)", marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "4px" }}>
                      <span style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} color="var(--accent)" />
                        <span>सुशासन ऐन २०६४ सेवा प्रत्याभूति (Statutory 24h SLA):</span>
                      </span>
                      <strong style={{ color: "var(--accent)" }}>१८ घण्टा बाँकी (75% Time Remaining)</strong>
                    </div>
                    <div style={{ height: "6px", width: "100%", background: "rgba(208, 208, 208, 0.4)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
                      <div style={{ width: "75%", height: "100%", background: "#10B981", borderRadius: "var(--radius-pill)" }}></div>
                    </div>
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
                      style={{ fontSize: "0.76rem", padding: "6px 14px", gap: "6px" }}
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

