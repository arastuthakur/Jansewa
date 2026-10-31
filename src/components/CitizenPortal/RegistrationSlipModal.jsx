import React from "react";
import { useApp } from "../../context/AppContext";
import NepalEmblem from "../Common/NepalEmblem";
import { 
  X, 
  Printer, 
  CheckCircle, 
  QrCode, 
  Calendar, 
  User, 
  Building2, 
  ShieldCheck 
} from "lucide-react";

export default function RegistrationSlipModal({ app, onClose }) {
  const { lang } = useApp();

  if (!app) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="slip-modal-title">
      <div className="modal-card" style={{ maxWidth: "680px" }}>
        <div className="modal-header">
          <h3 id="slip-modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Printer size={18} color="var(--accent)" />
            <span>{lang === "ne" ? "आधिकारिक डिजिटल दर्ता निस्सा / रसिद" : "Official Digital Acknowledgment Slip"}</span>
          </h3>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body printable-slip-container">
          {/* Official Letterhead */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #B91C1C", paddingBottom: "14px", marginBottom: "18px" }}>
            <NepalEmblem size={54} className="emblem-svg" style={{ margin: "0 auto 6px" }} />
            <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#B91C1C", letterSpacing: "0.03em" }}>
              {lang === "ne" ? "नेपाल सरकार • बागमती प्रदेश" : "Government of Nepal • Bagmati Province"}
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#B91C1C", margin: "2px 0" }}>
              {lang === "ne" ? "काठमाडौँ महानगरपालिका" : "Kathmandu Metropolitan City"}
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--heading)" }}>
              {lang === "ne" ? "वडा नं. ०४ वडा कार्यसमितिको कार्यालय, बालुवाटार" : "Office of Ward Committee 04, Baluwatar, Kathmandu"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic", marginTop: "2px" }}>
              "जनसेवा एकीकृत अनलाइन नागरिक दर्ता निस्सा (Application Acknowledgment Slip)"
            </div>
          </div>

          {/* Barcode & Reference Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                {lang === "ne" ? "दर्ता संकेत नं (Tracking ID):" : "Official Tracking Number:"}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "1.05rem", fontWeight: 800, color: "var(--heading)" }}>
                {app.trackingId}
              </div>
            </div>

            {/* Simulated Barcode */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "monospace", letterSpacing: "3px", fontSize: "1.1rem", fontWeight: 900, color: "var(--heading)" }}>
                ||| | |||| | |||||| || |
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                KMC-VERIFIED-TOKEN
              </div>
            </div>
          </div>

          {/* Applicant & Service Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", fontSize: "0.82rem" }}>
            <div style={{ padding: "10px", background: "var(--bg)", boxShadow: "var(--neu-btn)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "0.72rem" }}>निवेदकको नाम (Applicant):</span>
              <strong style={{ color: "var(--heading)" }}>{lang === "ne" ? app.applicantNameNe || app.applicantName : app.applicantName}</strong>
            </div>

            <div style={{ padding: "10px", background: "var(--bg)", boxShadow: "var(--neu-btn)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "0.72rem" }}>सम्पर्क नम्बर (Phone):</span>
              <strong style={{ color: "var(--heading)" }}>{app.phone || "98XXXXXXXX"}</strong>
            </div>

            <div style={{ padding: "10px", background: "var(--bg)", boxShadow: "var(--neu-btn)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "0.72rem" }}>अनुरोध गरिएको सेवा (Service):</span>
              <strong style={{ color: "var(--heading)" }}>{lang === "ne" ? app.serviceTitleNe : app.serviceTitleEn}</strong>
            </div>

            <div style={{ padding: "10px", background: "var(--bg)", boxShadow: "var(--neu-btn)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "0.72rem" }}>दर्ता मिति (Date Submitted):</span>
              <strong style={{ color: "var(--heading)" }}>{app.submittedAt?.substring(0, 10)}</strong>
            </div>
          </div>

          {/* Instructions for Citizen */}
          <div style={{ background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "14px", borderRadius: "var(--radius-md)", fontSize: "0.78rem", lineHeight: 1.6, marginBottom: "16px" }}>
            <div style={{ fontWeight: 700, color: "var(--heading)", marginBottom: "4px" }}>
              📌 {lang === "ne" ? "वडा कार्यालय उपस्थित हुँदा ल्याउनुपर्ने कागजातहरू:" : "Original Documents Checklist for Counter Visit:"}
            </div>
            <ul style={{ paddingLeft: "18px", margin: 0, color: "var(--body)" }}>
              <li>{lang === "ne" ? "यो डिजिटल दर्ता निस्सा (प्रिन्ट वा मोबाइलमा देखाए हुने)" : "This digital acknowledgment slip (Printed or on Mobile)"}</li>
              <li>{lang === "ne" ? "सक्कल नेपाली नागरिकता प्रमाणपत्र तथा अभिभावकको नागरिकता प्रतिलिपि" : "Original Citizenship certificate and parent copies"}</li>
              <li>{lang === "ne" ? "स्थलगत मुचुल्का वा बसाइँसराइको हकमा सम्बन्धित वडाको दर्ता प्रमाण" : "Migration verification slip / spot inspection report"}</li>
            </ul>
          </div>

          {/* Officer Signature & QR Code */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(208, 208, 208, 0.4)", paddingTop: "14px" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                सुशासन ऐन २०६४ बमोजिम सेवा प्रत्याभूति समय: <strong>१ देखि ३ कार्यदिन</strong>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "2px" }}>
                काठमाडौँ महानगरपालिका वडा ४ • फोन: ०१-४४११२२३
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", margin: "0 auto 4px", background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <QrCode size={44} color="var(--heading)" />
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Scan to Verify</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {lang === "ne" ? "बन्द गर्नुहोस्" : "Close"}
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>{lang === "ne" ? "निस्सा प्रिन्ट गर्नुहोस् (Print Slip)" : "Print Official Slip"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
