import React from "react";
import { useApp } from "../../context/AppContext";
import { X, Printer, Award, QrCode } from "lucide-react";

export default function CertificateModal() {
  const { selectedAppForCertificate, setSelectedAppForCertificate } = useApp();

  if (!selectedAppForCertificate) return null;

  const app = selectedAppForCertificate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cert-modal-title">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={20} color="var(--soft-sage-text)" />
            <h3 id="cert-modal-title">आधिकारिक डिजिटल सिफारिस पत्र / Official Recommendation Certificate</h3>
          </div>
          <button type="button" className="btn-close" onClick={() => setSelectedAppForCertificate(null)} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ background: "var(--bg)", padding: "24px" }}>
          {/* Printable Official Document (Soft Neumorphic Inset Sheet) */}
          <div className="official-certificate" id="printable-cert">
            {/* Header */}
            <div className="cert-header">
              <div style={{ fontSize: "2.4rem", marginBottom: "4px" }}>🇳🇵</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--heading)" }}>
                काठमाडौँ महानगरपालिका
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--accent)" }}>
                ४ नं. वडा कार्यालय, बालुवाटार, काठमाडौँ
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                बागमती प्रदेश, नेपाल
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginTop: "18px", color: "var(--body)" }}>
                <div><strong>पत्र संख्या:</strong> २०८३/०८४</div>
                <div><strong>चलानी नं.:</strong> {app.trackingId}</div>
                <div><strong>मिति:</strong> २०८३/०७/१२ (2026-10-31)</div>
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              <span
                style={{
                  borderBottom: "2px solid var(--accent)",
                  paddingBottom: "4px",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--heading)"
                }}
              >
                विषय: {app.serviceTitleNe}
              </span>
            </div>

            {/* Body */}
            <div className="cert-body">
              <p style={{ marginBottom: "16px", textIndent: "32px" }}>
                प्रस्तुत विषयमा यस <strong>काठमाडौँ महानगरपालिका वडा नं. ४</strong> स्थायी ठेगाना भएका श्री <strong>{app.applicantNameNe || app.applicantName}</strong> (सम्पर्क नं: {app.phone}) ले यस वडा कार्यालयमा पेश गर्नुभएको कागजात, स्थलगत सर्जमिन मुचुल्का तथा स्थानीय सरकार सञ्चालन ऐन, २०७४ को दफा १२ बमोजिम निजको व्यहोरा मनासिब देखिएकोले यो सिफारिस पत्र प्रदान गरिएको छ।
              </p>
              <p style={{ marginBottom: "16px" }}>
                निज निवेदकको नागरिकता तथा आवश्यक विवरण यस कार्यालयको विद्युतीय अभिलेख प्रणाली (JanSewa AI Electronic Registry) मा प्रमाणीकरण गरी सुरक्षित राखिएको छ।
              </p>
              <div style={{ fontSize: "0.84rem", color: "var(--body)", background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", padding: "12px 16px", borderRadius: "var(--radius-sm)" }}>
                <strong>कैफियत / Official Note:</strong> {app.officialRemarks || "Approved in accordance with Nepal Citizenship Act & Municipal By-laws."}
              </div>
            </div>

            {/* Footer with Seal, QR & Signature */}
            <div className="cert-footer">
              {/* QR Verification */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg)", boxShadow: "var(--neu-raised-sm)", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                <QrCode size={48} color="var(--heading)" />
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  <div><strong style={{ color: "var(--heading)" }}>JanSewa Digital Seal</strong></div>
                  <div>Verify: jansewa.gov.np/v/{app.trackingId}</div>
                  <div style={{ color: "var(--soft-sage-text)", fontWeight: 600 }}>✓ Cryptographically Signed</div>
                </div>
              </div>

              {/* Municipal Seal */}
              <div className="cert-seal">
                <div>
                  वडा नं. ४<br />कार्यालय छाप<br />२०८३
                </div>
              </div>

              {/* Signature */}
              <div style={{ textAlign: "center", width: "170px" }}>
                <div style={{ fontFamily: "cursive", fontSize: "1.15rem", color: "var(--heading)", marginBottom: "4px" }}>
                  Sita Adhikari
                </div>
                <div style={{ borderTop: "1px solid rgba(208, 208, 208, 0.6)", paddingTop: "4px", fontSize: "0.8rem", fontWeight: 600, color: "var(--heading)" }}>
                  (सिता अधिकारी)
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  वडा सचिव / अधिकृत
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={() => setSelectedAppForCertificate(null)}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
