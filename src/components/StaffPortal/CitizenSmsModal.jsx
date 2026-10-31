import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  Smartphone, 
  Bell 
} from "lucide-react";

export default function CitizenSmsModal({ app, onClose }) {
  const { lang, showToast } = useApp();

  const templates = [
    {
      id: "approved",
      titleNe: "स्वीकृत - सक्कल कागजात लिएर आउनुहुन",
      titleEn: "Approved - Bring Original Documents",
      textNe: `नमस्ते ${app.applicantName}, काठमाडौँ महानगरपालिका वडा ४ मा दर्ता गरिएको तपाईंको निवेदन (${app.trackingId}) स्वीकृत भएको छ। कृपया सक्कल नागरिकता तथा कागजात सहित ३ दिनभित्र वडा कार्यालयमा उपस्थित हुनुहोला।`,
      textEn: `Namaste ${app.applicantName}, your application (${app.trackingId}) at KMC Ward 04 is APPROVED. Please visit the ward counter with original documents within 3 working days.`
    },
    {
      id: "needs_docs",
      titleNe: "अपूर्ण कागजात - पुनः पेश गर्नुहुन",
      titleEn: "Correction Required - Re-upload Documents",
      textNe: `नमस्ते ${app.applicantName}, तपाईंको निवेदन (${app.trackingId}) मा केही कागजात अस्पष्ट भएकाले पुनः अपलोड गर्न अनुरोध छ। कृपया जनसेवा पोर्टलमा गई ट्र्याकिङ कोड प्रयोग गर्नुहोस्।`,
      textEn: `Namaste ${app.applicantName}, your application (${app.trackingId}) requires document re-verification. Please visit JanSewa portal to submit required corrections.`
    },
    {
      id: "dao_ready",
      titleNe: "जिल्ला प्रशासन कार्यालय (DAO) सिफारिस प्रेषित",
      titleEn: "Referred to DAO Kathmandu",
      textNe: `नमस्ते ${app.applicantName}, तपाईंको नागरिकता सिफारिस फाइल जिल्ला प्रशासन कार्यालय (DAO काठमाडौँ) मा अग्रिम प्रमाणीकरणका लागि पठाइएको छ।`,
      textEn: `Namaste ${app.applicantName}, your case has been referred to DAO Kathmandu for official concurrence.`
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState("approved");
  const [customMsg, setCustomMsg] = useState(
    lang === "ne" ? templates[0].textNe : templates[0].textEn
  );
  const [isSent, setIsSent] = useState(false);

  const handleTemplateChange = (tmplId) => {
    setSelectedTemplate(tmplId);
    const tmpl = templates.find((t) => t.id === tmplId);
    if (tmpl) {
      setCustomMsg(lang === "ne" ? tmpl.textNe : tmpl.textEn);
    }
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    setIsSent(true);
    showToast(
      lang === "ne"
        ? `नागरिक सूचना एसएमएस ${app.phone || '98XXXXXXXX'} मा सफलतापूर्वक प्रेषण भयो!`
        : `SMS Alert dispatched to ${app.phone || '98XXXXXXXX'}!`,
      "success"
    );
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sms-modal-title">
      <div className="modal-card" style={{ maxWidth: "560px" }}>
        <div className="modal-header">
          <h3 id="sms-modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Smartphone size={18} color="var(--accent)" />
            <span>{lang === "ne" ? "नागरिक एसएमएस सूचना प्रेषण" : "Dispatch Citizen SMS Alert"}</span>
          </h3>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSendSms} className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: "0.82rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--muted)" }}>{lang === "ne" ? "प्रापक नागरिक:" : "Recipient:"}</span>
              <strong>{app.applicantName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--muted)" }}>{lang === "ne" ? "फोन नम्बर:" : "Mobile Phone:"}</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{app.phone || "9841XXXXXX"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>{lang === "ne" ? "दर्ता संकेत:" : "Tracking ID:"}</span>
              <span style={{ fontFamily: "monospace", color: "var(--accent)" }}>{app.trackingId}</span>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>
              {lang === "ne" ? "आधिकारिक सूचना ढाँचा (Templates):" : "SMS Template:"}
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  className={`btn ${selectedTemplate === tmpl.id ? "btn-primary" : "btn-secondary"}`}
                  style={{ justifyContent: "flex-start", padding: "8px 12px", fontSize: "0.78rem" }}
                  onClick={() => handleTemplateChange(tmpl.id)}
                >
                  <Bell size={13} />
                  <span>{lang === "ne" ? tmpl.titleNe : tmpl.titleEn}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>
              {lang === "ne" ? "एसएमएस सन्देश (SMS Content):" : "Message Text:"}
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              required
            />
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px", display: "block" }}>
              KMC Telecom Gateway: 160 Characters • 1 SMS Unit
            </span>
          </div>

          <div className="modal-footer" style={{ padding: "0", borderTop: "none" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {lang === "ne" ? "रद्द" : "Cancel"}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSent} style={{ gap: "6px" }}>
              <Send size={14} />
              <span>{isSent ? (lang === "ne" ? "पठाउँदै..." : "Sending...") : (lang === "ne" ? "एसएमएस पठाउनुहोस्" : "Dispatch SMS")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
