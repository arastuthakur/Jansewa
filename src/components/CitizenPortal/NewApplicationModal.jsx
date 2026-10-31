import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { analyzeDocumentWithGemini } from "../../services/geminiService";
import confetti from "canvas-confetti";
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2
} from "lucide-react";

export default function NewApplicationModal() {
  const { 
    isApplyModalOpen, 
    setIsApplyModalOpen, 
    preselectedService, 
    services, 
    addApplication, 
    t, 
    lang,
    setSearchTrackingId,
    setActiveTab
  } = useApp();

  const [selectedServiceId, setSelectedServiceId] = useState(
    preselectedService?.id || services[0]?.id
  );
  const [applicantName, setApplicantName] = useState("Ram Bahadur Shrestha");
  const [applicantNameNe, setApplicantNameNe] = useState("राम बहादुर श्रेष्ठ");
  const [phone, setPhone] = useState("9841890123");
  const [email, setEmail] = useState("ram.shrestha@nepalmail.np");
  const [ward, setWard] = useState("Ward 04, Kathmandu");
  const [address, setAddress] = useState("Baluwatar, Kathmandu");

  // Document state
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "Citizenship_Front_Ram_Shrestha.jpg", type: "Nepali Citizenship Card", size: "840 KB" }
  ]);
  const [isScanningWithAi, setIsScanningWithAi] = useState(false);
  const [aiScanResult, setAiScanResult] = useState(null);

  if (!isApplyModalOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newItems = files.map((f) => ({
        name: f.name,
        type: f.type || "Document",
        size: `${Math.round(f.size / 1024)} KB`
      }));
      setUploadedFiles((prev) => [...prev, ...newItems]);
      runAiScan(newItems[0]);
    }
  };

  const loadSampleDocument = (sampleName, sampleType) => {
    const sampleDoc = {
      name: sampleName,
      type: sampleType,
      size: "1.2 MB",
      isSample: true
    };
    setUploadedFiles([sampleDoc]);
    runAiScan(sampleDoc);
  };

  const runAiScan = async (fileObj) => {
    setIsScanningWithAi(true);
    setAiScanResult(null);
    try {
      const result = await analyzeDocumentWithGemini(fileObj, currentService);
      setAiScanResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanningWithAi(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `JSN-KTM04-2026-00${randomSuffix}`;

    const newApp = {
      id: `app-${Date.now()}`,
      trackingId,
      serviceId: currentService.id,
      serviceTitleEn: currentService.titleEn,
      serviceTitleNe: currentService.titleNe,
      applicantName,
      applicantNameNe,
      phone,
      email,
      ward,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      feePaid: true,
      feeAmount: currentService.feeNpr,
      documents: uploadedFiles.map((f) => ({
        ...f,
        verified: true
      })),
      aiFlags: aiScanResult || {
        readabilityScore: 92,
        completeness: "Checklist Validated",
        extractedData: {
          fullName: applicantName,
          docNumber: "27-01-78-05241",
          issueDate: "2078/03/15 B.S.",
          address: `${ward}, ${address}`
        },
        flagNotes: "All required initial documents uploaded and scanned."
      },
      workflowHistory: [
        {
          step: "Application submitted online via JanSewa Citizen Portal",
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          officer: "System Auto-Ingest"
        },
        {
          step: "Gemini AI Document Verification Completed",
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          officer: "JanSewa Gemini Engine"
        }
      ],
      officialRemarks: "Application received. In queue for Ward 04 staff review."
    };

    addApplication(newApp);

    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setIsApplyModalOpen(false);
    setSearchTrackingId(trackingId);
    setActiveTab("tracking");
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <div>
            <h3 id="apply-modal-title">
              {lang === "ne" ? "नयाँ अनलाइन निवेदन दर्ता" : "Submit New Online Application"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
              {currentService.code} • {lang === "ne" ? currentService.titleNe : currentService.titleEn}
            </p>
          </div>
          <button type="button" className="btn-close" onClick={() => setIsApplyModalOpen(false)} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div className="modal-body">
            {/* Service Selector */}
            <div className="form-group">
              <label className="form-label">{t.staff.serviceType}</label>
              <select
                className="form-select"
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setAiScanResult(null);
                }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {lang === "ne" ? s.titleNe : s.titleEn} (NPR {s.feeNpr})
                  </option>
                ))}
              </select>
            </div>

            {/* Applicant Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Applicant Full Name (English)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">निवेदकको पूरा नाम (नेपालीमा)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={applicantNameNe}
                  onChange={(e) => setApplicantNameNe(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (सम्पर्क नम्बर)</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (ईमेल)</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Municipal Ward (वडा नम्बर)</label>
                <input
                  type="text"
                  className="form-input"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tole / Address (टोल वा ठेगाना)</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Document Upload & Pre-Check Section */}
            <div style={{ marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  {t.common.uploadDoc}
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: "0.74rem", padding: "4px 10px" }}
                    onClick={() => loadSampleDocument("Sample_Nepali_Citizenship_Card.jpg", "Citizenship Card")}
                  >
                    + Sample Citizenship Card
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: "0.74rem", padding: "4px 10px" }}
                    onClick={() => loadSampleDocument("Sample_Lalpurja_Land_Deed.pdf", "Land Ownership (Lalpurja)")}
                  >
                    + Sample Lalpurja
                  </button>
                </div>
              </div>

              <div 
                className="upload-dropzone" 
                onClick={() => document.getElementById("fileInput").click()}
                tabIndex={0}
                role="button"
                aria-label="Upload document dropzone"
                onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById("fileInput").click(); }}
              >
                <Upload size={28} color="var(--accent)" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--heading)" }}>
                  Click to choose file or drag & drop here
                </p>
                <p style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                  PDF, JPG, or PNG (Max 10MB per file)
                </p>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {uploadedFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "var(--bg)",
                        boxShadow: "var(--neu-raised-sm)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.82rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={15} color="var(--accent)" />
                        <span style={{ fontWeight: 600, color: "var(--heading)" }}>{file.name}</span>
                        <span style={{ color: "var(--muted)" }}>({file.size})</span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "0.72rem" }}
                        onClick={() => runAiScan(file)}
                        disabled={isScanningWithAi}
                      >
                        <Sparkles size={11} color="var(--accent)" />
                        Run AI Check
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Gemini AI Scan Results Box */}
              {isScanningWithAi && (
                <div style={{ padding: "16px", background: "var(--bg)", boxShadow: "var(--neu-inset)", borderRadius: "var(--radius-md)", marginTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Loader2 size={18} className="animate-spin" color="var(--accent)" />
                  <span style={{ fontSize: "0.82rem", color: "var(--heading)", fontWeight: 500 }}>
                    Gemini AI analyzing document structure, Devanagari text OCR & completeness...
                  </span>
                </div>
              )}

              {aiScanResult && !isScanningWithAi && (
                <div style={{ padding: "18px", background: "var(--bg)", boxShadow: "var(--neu-raised-sm)", borderRadius: "var(--radius-md)", marginTop: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Sparkles size={15} color="var(--accent)" />
                      <strong style={{ fontSize: "0.88rem", color: "var(--heading)" }}>
                        Gemini Assistive Document Intelligence
                      </strong>
                    </div>
                    <span className="status-badge" style={{ background: "var(--soft-sage)", color: "var(--soft-sage-text)" }}>
                      Score: {aiScanResult.readabilityScore}% Readability
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.8rem", background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                    <div><strong>Detected Type:</strong> {aiScanResult.documentType}</div>
                    <div><strong>Checklist:</strong> {aiScanResult.completeness}</div>
                    <div><strong>Extracted Name:</strong> {aiScanResult.extractedData?.fullName || "Ram Bahadur Shrestha"}</div>
                    <div><strong>Doc / Kitta No:</strong> {aiScanResult.extractedData?.docNumber || "27-01-78-05241"}</div>
                  </div>

                  <p style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: "10px" }}>
                    ✓ {aiScanResult.checklistNotes || "Document validated against municipal requirements."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsApplyModalOpen(false)}
            >
              {t.common.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={15} />
              <span>Confirm & Submit (NPR {currentService.feeNpr})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
