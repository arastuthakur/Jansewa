import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  ClipboardList, 
  Sparkles, 
  Award,
  Search,
  UserCheck
} from "lucide-react";

export default function StaffPortal() {
  const { 
    applications, 
    setSelectedAppForReview, 
    setSelectedAppForCertificate, 
    t, 
    lang 
  } = useApp();

  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = applications.filter((app) => {
    const matchesFilter =
      filterTab === "all" ? true :
      filterTab === "pending" ? (app.status === "submitted" || app.status === "under_review") :
      filterTab === "needs_info" ? app.status === "needs_info" :
      filterTab === "referred" ? app.status === "referred" :
      filterTab === "approved" ? (app.status === "approved" || app.status === "completed") : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      app.trackingId.toLowerCase().includes(term) ||
      app.applicantName.toLowerCase().includes(term) ||
      app.serviceTitleEn.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  const countPending = applications.filter(
    (a) => a.status === "submitted" || a.status === "under_review"
  ).length;
  const countNeedsInfo = applications.filter((a) => a.status === "needs_info").length;
  const countApproved = applications.filter((a) => a.status === "approved" || a.status === "completed").length;
  const countReferred = applications.filter((a) => a.status === "referred").length;

  return (
    <div className="staff-portal">
      {/* Header bar */}
      <div className="section-header" style={{ marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", color: "var(--heading)", display: "flex", alignItems: "center", gap: "8px" }}>
            <ClipboardList size={20} color="var(--accent)" />
            <span>{t.staff.title}</span>
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "3px" }}>
            {t.staff.subtitle}
          </p>
        </div>

        <div style={{ position: "relative", width: "260px" }}>
          <input
            type="text"
            className="input-text"
            style={{ paddingLeft: "34px", fontSize: "0.84rem", padding: "8px 14px 8px 34px" }}
            placeholder="Search case or applicant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search cases"
          />
          <Search size={14} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
        </div>
      </div>

      {/* Quick KPI Stat Cards (Soft Neumorphic Wells) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Active in Work Queue</span>
          <span className="kpi-value">{applications.length}</span>
          <span className="kpi-sub">Ward 04 Municipal Registry</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Pending Verification</span>
          <span className="kpi-value">{countPending}</span>
          <span className="kpi-sub" style={{ color: "var(--soft-amber-text)" }}>Requires Officer Scrutiny</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Correction Required</span>
          <span className="kpi-value">{countNeedsInfo}</span>
          <span className="kpi-sub" style={{ color: "var(--soft-pink-text)" }}>Awaiting Citizen Uploads</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Decided & Approved</span>
          <span className="kpi-value">{countApproved}</span>
          <span className="kpi-sub" style={{ color: "var(--soft-sage-text)" }}>Digital Certificates Issued</span>
        </div>
      </div>

      {/* Filter Tabs (Soft UI Inset Tray) */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", padding: "4px 2px" }}>
        <button
          type="button"
          className={`nav-item ${filterTab === "all" ? "active" : ""}`}
          style={{ fontSize: "0.78rem", padding: "7px 16px" }}
          onClick={() => setFilterTab("all")}
        >
          {t.staff.allTasks} ({applications.length})
        </button>
        <button
          type="button"
          className={`nav-item ${filterTab === "pending" ? "active" : ""}`}
          style={{ fontSize: "0.78rem", padding: "7px 16px" }}
          onClick={() => setFilterTab("pending")}
        >
          {t.staff.pendingReview} ({countPending})
        </button>
        <button
          type="button"
          className={`nav-item ${filterTab === "needs_info" ? "active" : ""}`}
          style={{ fontSize: "0.78rem", padding: "7px 16px" }}
          onClick={() => setFilterTab("needs_info")}
        >
          {t.staff.requiresAction} ({countNeedsInfo})
        </button>
        <button
          type="button"
          className={`nav-item ${filterTab === "referred" ? "active" : ""}`}
          style={{ fontSize: "0.78rem", padding: "7px 16px" }}
          onClick={() => setFilterTab("referred")}
        >
          Referred to DAO ({countReferred})
        </button>
        <button
          type="button"
          className={`nav-item ${filterTab === "approved" ? "active" : ""}`}
          style={{ fontSize: "0.78rem", padding: "7px 16px" }}
          onClick={() => setFilterTab("approved")}
        >
          {t.staff.approvedList} ({countApproved})
        </button>
      </div>

      {/* Work Queue Table (Neumorphic Surface) */}
      <div className="table-responsive">
        <table className="gov-table">
          <thead>
            <tr>
              <th>{t.staff.trackingId}</th>
              <th>{t.staff.applicantName}</th>
              <th>{t.staff.serviceType}</th>
              <th>{t.staff.submittedOn}</th>
              <th>AI Pre-Check</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--heading)" }}>
                      {app.trackingId}
                    </span>
                  </td>
                  <td>
                    <strong>{lang === "ne" ? app.applicantNameNe || app.applicantName : app.applicantName}</strong>
                    <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>{app.phone}</div>
                  </td>
                  <td>
                    {lang === "ne" ? app.serviceTitleNe : app.serviceTitleEn}
                  </td>
                  <td>{app.submittedAt?.substring(0, 16)}</td>
                  <td>
                    <span className="ai-chip">
                      <Sparkles size={10} />
                      {app.aiFlags?.readabilityScore || 92}% Match
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${app.status}`}>
                      {t.status[app.status] || app.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: "6px 14px", fontSize: "0.76rem" }}
                        onClick={() => setSelectedAppForReview(app)}
                      >
                        <UserCheck size={14} />
                        <span>Inspect & Decide</span>
                      </button>

                      {app.status === "approved" && (
                        <button
                          type="button"
                          className="btn btn-emerald"
                          style={{ padding: "6px 10px", fontSize: "0.76rem" }}
                          onClick={() => setSelectedAppForCertificate(app)}
                          title="View Official Certificate"
                        >
                          <Award size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "var(--muted)" }}>
                  No applications match this filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
