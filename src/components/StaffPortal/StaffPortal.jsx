import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  ClipboardList, 
  Sparkles, 
  Award,
  Search,
  UserCheck,
  CheckSquare,
  Square,
  Smartphone,
  Download,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  Send,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import CitizenSmsModal from "./CitizenSmsModal";

export default function StaffPortal() {
  const { 
    applications, 
    updateApplicationStatus,
    setSelectedAppForReview, 
    setSelectedAppForCertificate, 
    showToast,
    t, 
    lang 
  } = useApp();

  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [smsTargetApp, setSmsTargetApp] = useState(null);
  const [showDailyLedger, setShowDailyLedger] = useState(false);

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

  const handleSelectAll = () => {
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk / Batch Decisions
  const handleBulkApprove = () => {
    selectedIds.forEach((id) => {
      updateApplicationStatus(
        id,
        "approved",
        "एकमुष्ट प्रमाणीकरण: वडा सचिवबाट सक्कल कागजात रुजु गरी सिफारिस स्वीकृत गरियो।",
        "वडा सचिव (Ward Secretary 04)"
      );
    });
    showToast(
      lang === "ne"
        ? `${selectedIds.length} वटा निवेदनहरू एकमुष्ट स्वीकृत गरियो!`
        : `Successfully bulk-approved ${selectedIds.length} applications!`,
      "success"
    );
    setSelectedIds([]);
  };

  const handleBulkNeedsInfo = () => {
    selectedIds.forEach((id) => {
      updateApplicationStatus(
        id,
        "needs_info",
        "कागजात अपूर्ण भएकोले पुनः अपलोड गर्न नागरिकलाई अनुरोध गरिएको छ।",
        "वडा सचिव (Ward Secretary 04)"
      );
    });
    showToast(
      lang === "ne"
        ? `${selectedIds.length} वटा निवेदनमा थप प्रमाण माग गरियो!`
        : `Requested additional info for ${selectedIds.length} applications!`,
      "info"
    );
    setSelectedIds([]);
  };

  const handleBulkReferDAO = () => {
    selectedIds.forEach((id) => {
      updateApplicationStatus(
        id,
        "referred",
        "नागरिकता सिफारिसका लागि जिल्ला प्रशासन कार्यालय काठमाडौँ प्रेषित।",
        "वडा सचिव (Ward Secretary 04)"
      );
    });
    showToast(
      lang === "ne"
        ? `${selectedIds.length} वटा फाइल जिल्ला प्रशासन कार्यालय प्रेषित गरियो!`
        : `Referred ${selectedIds.length} files to District Administration Office!`,
      "info"
    );
    setSelectedIds([]);
  };

  // Export Daily Darta-Chalani Ledger as CSV
  const handleExportCSV = () => {
    const headers = ["Darta_No", "Tracking_ID", "Applicant_Name", "Service", "Ward", "Submitted_Date", "Status", "Fee_NPR"];
    const rows = applications.map((app, idx) => [
      `KMC04-D-${1000 + idx}`,
      app.trackingId,
      `"${app.applicantName}"`,
      `"${app.serviceTitleEn}"`,
      app.ward,
      app.submittedAt?.substring(0, 10),
      app.status,
      app.fee || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KMC_Ward04_Daily_Darta_Register_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === "ne" ? "दैनिक दर्ता चलानी CSV डाउनलोड भयो!" : "Daily Civil Ledger exported to CSV!", "success");
  };

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
            {t.staff.subtitle} • काठमाडौँ महानगरपालिका वडा नं. ०४
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: "0.78rem", padding: "8px 14px", gap: "6px" }}
            onClick={() => setShowDailyLedger(!showDailyLedger)}
          >
            <FileSpreadsheet size={14} color="var(--accent)" />
            <span>{showDailyLedger ? (lang === "ne" ? "कार्यसूची हेर्नुहोस्" : "View Work Queue") : (lang === "ne" ? "दैनिक दर्ता अभिलेख" : "Daily Civil Ledger")}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: "0.78rem", padding: "8px 14px", gap: "6px" }}
            onClick={handleExportCSV}
          >
            <Download size={14} />
            <span>{lang === "ne" ? "दर्ता चलानी Export" : "Export CSV"}</span>
          </button>

          <div style={{ position: "relative", width: "240px" }}>
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
      </div>

      {/* Quick KPI Stat Cards */}
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

      {/* Daily Civil Registration & Chalani Ledger Section (Toggled) */}
      {showDailyLedger ? (
        <div style={{ background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--neu-raised)", marginBottom: "28px" }}>
          <div className="section-header" style={{ marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileSpreadsheet size={18} color="var(--accent)" />
                <span>{lang === "ne" ? "स्थानीय तह दैनिक दर्ता तथा चलानी अभिलेख (Local Govt Act 2074 Sec 12)" : "Daily Civil Registration & Chalani Register (Darta-Chalani)"}</span>
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px" }}>
                Official municipal log for vital events, citizenship recommendations, and property verifications.
              </p>
            </div>
            <button type="button" className="btn btn-secondary" style={{ fontSize: "0.74rem" }} onClick={() => window.print()}>
              <Printer size={13} />
              <span>Print Ledger</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>दर्ता नं (Darta No.)</th>
                  <th>दर्ता मिति (Date)</th>
                  <th>निवेदक (Applicant)</th>
                  <th>सेवा विवरण (Subject/Service)</th>
                  <th>फाँट / फाँटवाला (Desk)</th>
                  <th>अवस्था (Status)</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app.id}>
                    <td><strong style={{ fontFamily: "monospace" }}>KMC04-D-{1000 + idx}</strong></td>
                    <td>{app.submittedAt?.substring(0, 10)}</td>
                    <td>{lang === "ne" ? app.applicantNameNe || app.applicantName : app.applicantName}</td>
                    <td>{lang === "ne" ? app.serviceTitleNe : app.serviceTitleEn}</td>
                    <td>नागरिकता तथा पञ्जीकरण फाँट</td>
                    <td>
                      <span className={`status-badge status-${app.status}`}>
                        {t.status[app.status] || app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Floating Batch / Bulk Action Banner (Appears when items are selected) */}
      {selectedIds.length > 0 && (
        <div
          style={{
            background: "var(--bg)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--neu-raised-lg)",
            padding: "14px 20px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            border: "1px solid var(--accent)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="portal-pill-badge" style={{ background: "var(--accent)", color: "#FFFFFF" }}>
              {selectedIds.length} Cases Selected
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--heading)", fontWeight: 600 }}>
              {lang === "ne" ? "एकमुष्ट कारबाही कार्यसूची (Bulk Actions):" : "Batch Processing Action:"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-emerald"
              style={{ fontSize: "0.76rem", padding: "6px 14px", gap: "6px" }}
              onClick={handleBulkApprove}
            >
              <CheckCircle2 size={13} />
              <span>{lang === "ne" ? "एकमुष्ट स्वीकृति (Bulk Approve)" : "Bulk Approve"}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: "0.76rem", padding: "6px 14px", gap: "6px" }}
              onClick={handleBulkNeedsInfo}
            >
              <AlertTriangle size={13} color="var(--soft-pink-text)" />
              <span>{lang === "ne" ? "अपूर्ण प्रमाण माग (Needs Info)" : "Request Missing Docs"}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: "0.76rem", padding: "6px 14px", gap: "6px" }}
              onClick={handleBulkReferDAO}
            >
              <ArrowRight size={13} />
              <span>{lang === "ne" ? "DAO प्रेषण (Refer to CDO)" : "Refer to DAO"}</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: "0.74rem", padding: "6px 10px" }}
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
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
              <th style={{ width: "38px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--accent)" }}
                  title="Select / Deselect All for Bulk Action"
                  aria-label="Select all"
                >
                  {selectedIds.length === filteredApps.length && filteredApps.length > 0 ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
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
              filteredApps.map((app) => {
                const isSelected = selectedIds.includes(app.id);
                return (
                  <tr key={app.id} style={{ background: isSelected ? "rgba(185, 28, 28, 0.05)" : undefined }}>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(app.id)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: isSelected ? "var(--accent)" : "var(--muted)" }}
                        aria-label={`Select ${app.trackingId}`}
                      >
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
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
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.74rem" }}
                          onClick={() => setSelectedAppForReview(app)}
                        >
                          <UserCheck size={14} />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: "6px 10px", fontSize: "0.74rem", gap: "4px" }}
                          onClick={() => setSmsTargetApp(app)}
                          title="Dispatch Citizen SMS Alert"
                        >
                          <Smartphone size={13} color="var(--accent)" />
                          <span>SMS</span>
                        </button>

                        {app.status === "approved" && (
                          <button
                            type="button"
                            className="btn btn-emerald"
                            style={{ padding: "6px 10px", fontSize: "0.74rem" }}
                            onClick={() => setSelectedAppForCertificate(app)}
                            title="View Official Certificate"
                          >
                            <Award size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "48px", color: "var(--muted)" }}>
                  No applications match this filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Citizen SMS Dispatcher Modal */}
      {smsTargetApp && (
        <CitizenSmsModal
          app={smsTargetApp}
          onClose={() => setSmsTargetApp(null)}
        />
      )}
    </div>
  );
}

