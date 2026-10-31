import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { classifyComplaintWithGemini } from "../../services/geminiService";
import { 
  X, 
  Megaphone, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  MapPin
} from "lucide-react";

export default function ComplaintLodgeModal() {
  const { isComplaintModalOpen, setIsComplaintModalOpen, addComplaint, t, lang } = useApp();

  const [title, setTitle] = useState("Severe Road Pothole and Drainage Blockage near Baluwatar Chowk");
  const [description, setDescription] = useState("Deep crater forming on the main road after recent pipeline repair, causing severe motorbike accidents and sewage spillage during morning peak hours.");
  const [location, setLocation] = useState("Baluwatar Chowk, Ward 04, Kathmandu");
  const [citizenName, setCitizenName] = useState("Binod Shrestha");
  const [contact, setContact] = useState("9851000000");

  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState(null);

  if (!isComplaintModalOpen) return null;

  const handleRunAiTriage = async () => {
    setIsTriaging(true);
    setTriageResult(null);
    try {
      const res = await classifyComplaintWithGemini(title, description, location);
      setTriageResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const trackingId = `CMP-KTM-2026-00${randomSuffix}`;

    const newCmp = {
      id: `cmp-${Date.now()}`,
      trackingId,
      title,
      titleNe: title,
      category: triageResult?.category || "Road & Infrastructure",
      categoryNe: triageResult?.categoryNe || "सडक तथा पूर्वाधार",
      ward: "Ward 04, Kathmandu",
      location,
      reportedAt: new Date().toISOString(),
      status: triageResult?.priority === "Emergency" ? "urgent" : "in_progress",
      priority: triageResult?.priority || "High",
      citizenName,
      aiAnalysis: triageResult ? {
        confidence: triageResult.confidence || 0.95,
        suggestedDepartment: triageResult.suggestedDepartment,
        detectedUrgency: `${triageResult.priority} (${triageResult.recommendedAction || 'Field dispatch recommended'})`,
        keywords: [triageResult.extractedLocation || location, triageResult.category]
      } : {
        confidence: 0.92,
        suggestedDepartment: "KMC Ward 04 Maintenance Cell",
        detectedUrgency: "High",
        keywords: ["road", "drainage", "Baluwatar"]
      },
      resolutionNotes: "Dispatched to responsible department via JanSewa Automated Routing."
    };

    addComplaint(newCmp);
    setIsComplaintModalOpen(false);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="complaint-modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Megaphone size={20} color="var(--accent)" />
            <div>
              <h3 id="complaint-modal-title">
                {lang === "ne" ? "सार्वजनिक समस्या / उजुरी दर्ता" : "Lodge Public Complaint / Grievance"}
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px" }}>
                Automated Gemini NLP classification & departmental routing
              </p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={() => setIsComplaintModalOpen(false)} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Subject / Issue Title (समस्याको शीर्षक)</label>
              <input
                type="text"
                required
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specific Location / Landmark (घटना भएको ठाउँ)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: "36px" }}
                />
                <MapPin size={15} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "13px" }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description (विस्तृत व्यहोरा)</label>
              <textarea
                rows={3}
                required
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label">Citizen Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            {/* AI Triage Trigger */}
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleRunAiTriage}
                disabled={isTriaging}
              >
                {isTriaging ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Gemini classifying grievance & department SLA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} color="var(--accent)" />
                    <span>Run Gemini AI Smart Classification</span>
                  </>
                )}
              </button>

              {triageResult && (
                <div style={{ marginTop: "14px", padding: "16px", background: "var(--bg)", boxShadow: "var(--neu-inset)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                    <span className="status-badge" style={{ background: "var(--soft-pink)", color: "var(--soft-pink-text)" }}>
                      Priority: {triageResult.priority}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--heading)", fontWeight: 600 }}>
                      Category: {triageResult.category}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--heading)", marginBottom: "4px" }}>
                    <strong>Routed to:</strong> {triageResult.suggestedDepartment}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    <strong>Action:</strong> {triageResult.recommendedAction}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsComplaintModalOpen(false)}
            >
              {t.common.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} />
              <span>Submit Grievance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
