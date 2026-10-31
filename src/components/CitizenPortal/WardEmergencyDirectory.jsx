import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  PhoneCall, 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  ShieldCheck, 
  Building, 
  Droplet, 
  ExternalLink 
} from "lucide-react";

export default function WardEmergencyDirectory() {
  const { lang, showToast } = useApp();

  const emergencyContacts = [
    {
      id: "kmc-helpline",
      titleNe: "काठमाडौँ महानगर नागरिक गुनासो टोल-फ्री",
      titleEn: "KMC Toll-Free Citizen Grievance Helpline",
      number: "1180",
      tel: "tel:1180",
      agencyNe: "काठमाडौँ महानगरपालिका केन्द्रीय कार्यालय",
      agencyEn: "Kathmandu Metropolitan City HQ",
      icon: <PhoneCall size={18} color="var(--accent)" />,
      statusNe: "२४/७ सेवा उपलब्ध",
      statusEn: "24/7 Active",
      badgeColor: "var(--soft-sage-text)"
    },
    {
      id: "fire-brigade",
      titleNe: "काठमाडौँ महानगर दमकल तथा विपद् सेवा (न्यूरोड)",
      titleEn: "Kathmandu Fire Brigade & Disaster Response",
      number: "101",
      tel: "tel:101",
      agencyNe: "न्यूरोड दमकल स्टेसन",
      agencyEn: "New Road Fire Station, Kathmandu",
      icon: <Flame size={18} color="#EF4444" />,
      statusNe: "तुरुन्त परिचालन",
      statusEn: "Instant Dispatch",
      badgeColor: "#EF4444"
    },
    {
      id: "ambulance",
      titleNe: "नेपाल एम्बुलेन्स सेवा (NAS - आपतकालीन स्वास्थ्य)",
      titleEn: "Nepal Ambulance Service (NAS Emergency)",
      number: "102",
      tel: "tel:102",
      agencyNe: "केन्द्रीय एम्बुलेन्स प्रेषण केन्द्र",
      agencyEn: "Central Emergency Medical Dispatch",
      icon: <HeartPulse size={18} color="#E11D48" />,
      statusNe: "जीपीएस ट्र्याकिङ सहित",
      statusEn: "GPS Enabled",
      badgeColor: "#E11D48"
    },
    {
      id: "city-police",
      titleNe: "काठमाडौँ महानगर नगर प्रहरी बल",
      titleEn: "KMC City Police Force Command",
      number: "01-4231481",
      tel: "tel:014231481",
      agencyNe: "बागदरबार, काठमाडौँ",
      agencyEn: "Bagdurbar Command, Kathmandu",
      icon: <ShieldAlert size={18} color="#2563EB" />,
      statusNe: "सडक, फुटपाथ तथा नगर सुरक्षा",
      statusEn: "City Safety & Patrol",
      badgeColor: "#2563EB"
    },
    {
      id: "nepal-police",
      titleNe: "नेपाल प्रहरी केन्द्रीय नियन्त्रण कक्ष",
      titleEn: "Nepal Police Central Control Room",
      number: "100",
      tel: "tel:100",
      agencyNe: "प्रहरी प्रधान कार्यालय, नक्साल",
      agencyEn: "Police Headquarters, Naxal",
      icon: <ShieldCheck size={18} color="#1D4ED8" />,
      statusNe: "शान्ति सुरक्षा तथा आपतकाल",
      statusEn: "Law & Order Emergency",
      badgeColor: "#1D4ED8"
    },
    {
      id: "ward-04",
      titleNe: "वडा नं ४ कार्यालय प्रत्यक्ष सम्पर्क (बालुवाटार)",
      titleEn: "Ward No. 04 Office Direct Line (Baluwatar)",
      number: "01-4411223",
      tel: "tel:014411223",
      agencyNe: "विशालनगर / बालुवाटार, काठमाडौँ",
      agencyEn: "Bishalnagar / Baluwatar, Ward 04",
      icon: <Building size={18} color="var(--accent)" />,
      statusNe: "बिहान १० देखि साँझ ५ बजे",
      statusEn: "10:00 AM - 5:00 PM",
      badgeColor: "var(--soft-amber-text)"
    },
    {
      id: "blood-bank",
      titleNe: "केन्द्रीय रक्तसञ्चार सेवा (रेडक्रस)",
      titleEn: "Central Blood Bank (Nepal Red Cross)",
      number: "01-4225344",
      tel: "tel:014225344",
      agencyNe: "भृकुटीमण्डप / प्रदर्शनीमार्ग",
      agencyEn: "Bhrikutimandap, Kathmandu",
      icon: <Droplet size={18} color="#DC2626" />,
      statusNe: "२४ घण्टा आपतकालीन रगत आपूर्ति",
      statusEn: "24-Hour Blood Supply",
      badgeColor: "#DC2626"
    }
  ];

  return (
    <div className="emergency-directory-card" style={{ background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: "26px", boxShadow: "var(--neu-raised)", marginBottom: "32px" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--heading)" }}>
            <PhoneCall size={20} color="var(--accent)" />
            <span>{lang === "ne" ? "काठमाडौँ आपतकालीन तथा वडा सेवा निर्देशिका" : "KMC Ward Emergency & Essential Services Directory"}</span>
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
            {lang === "ne"
              ? "काठमाडौँ महानगरपालिका र वडा नं ४ भित्र तत्काल आवश्यक पर्ने सेवाहरूमा १-ट्याप सम्पर्क गर्नुहोस्।"
              : "Direct one-tap click-to-call directory for municipal and emergency services in Kathmandu."}
          </p>
        </div>

        <span className="portal-pill-badge" style={{ color: "#EF4444" }}>
          🚨 {lang === "ne" ? "आपतकालीन हटलाइन" : "Emergency Hotlines"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {emergencyContacts.map((c) => (
          <div
            key={c.id}
            style={{
              background: "var(--bg)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              boxShadow: "var(--neu-raised-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px",
              transition: "var(--transition)"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg)", boxShadow: "var(--neu-inset-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c.icon}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--bg)",
                    boxShadow: "var(--neu-inset-sm)",
                    color: c.badgeColor
                  }}
                >
                  {lang === "ne" ? c.statusNe : c.statusEn}
                </span>
              </div>

              <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--heading)", marginBottom: "4px" }}>
                {lang === "ne" ? c.titleNe : c.titleEn}
              </h4>
              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                {lang === "ne" ? c.agencyNe : c.agencyEn}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(208, 208, 208, 0.4)", paddingTop: "10px" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.1rem", color: "var(--heading)" }}>
                {c.number}
              </span>
              <a
                href={c.tel}
                className="btn btn-primary"
                style={{ padding: "6px 14px", fontSize: "0.76rem", gap: "6px" }}
                onClick={() => showToast(lang === "ne" ? `कल जोडिँदैछ: ${c.number}` : `Dialing ${c.number}...`, "info")}
              >
                <PhoneCall size={13} />
                <span>{lang === "ne" ? "कल गर्नुहोस्" : "Call Now"}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
