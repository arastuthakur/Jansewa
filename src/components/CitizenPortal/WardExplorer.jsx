import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  MapPin,
  Building2,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  HardHat,
  Volume2,
  Sparkles,
  ArrowRight
} from "lucide-react";

const KATHMANDU_WARDS = [
  {
    wardNo: 4,
    nameEn: "Ward 04 - Baluwatar / Bishalnagar",
    nameNe: "वडा नं. ०४ - बालुवाटार / विशालनगर",
    chair: "Dinesh Maharjan",
    secretary: "Ramesh Sharma",
    phone: "01-4412304",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Near Russian Embassy Road, Baluwatar",
    slaRate: 96.4,
    activeLoad: 14,
    monthlyProcessed: 184,
    fieldSquadStatus: "Active - Road maintenance squad on Baluwatar-Gairidhara link",
    roadDiggingPermits: 2,
    waterSupplyStatus: "Normal Pressure (KUKL Melamchi feed)",
    emergencyStatus: "Green (All municipal desks operating normally)"
  },
  {
    wardNo: 1,
    nameEn: "Ward 01 - Naxal / Nagpokhari",
    nameNe: "वडा नं. ०१ - नक्साल / नागपोखरी",
    chair: "Bharat Lal Shrestha",
    secretary: "Anita Karki",
    phone: "01-4421101",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Behind Naxal Bhagawati Temple",
    slaRate: 94.1,
    activeLoad: 9,
    monthlyProcessed: 142,
    fieldSquadStatus: "Patrolling - Heritage area sanitation inspection",
    roadDiggingPermits: 1,
    waterSupplyStatus: "Scheduled Distribution (Evening 5:00 PM)",
    emergencyStatus: "Green (Normal operations)"
  },
  {
    wardNo: 3,
    nameEn: "Ward 03 - Maharajgunj / Lazimpat",
    nameNe: "वडा नं. ०३ - महाराजगञ्ज / लाजिम्पाट",
    chair: "Prem Thapa",
    secretary: "Bibek Adhikari",
    phone: "01-4720903",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Near Teaching Hospital Road",
    slaRate: 95.8,
    activeLoad: 21,
    monthlyProcessed: 215,
    fieldSquadStatus: "Active - Traffic clearance & hospital corridor coordination",
    roadDiggingPermits: 3,
    waterSupplyStatus: "Normal Pressure",
    emergencyStatus: "Green (High Traffic Advisory)"
  },
  {
    wardNo: 10,
    nameEn: "Ward 10 - New Baneshwor / Shankhamul",
    nameNe: "वडा नं. १० - नयाँ बानेश्वर / शंखमूल",
    chair: "Ram Kumar KC",
    secretary: "Sunita Bhattarai",
    phone: "01-4780510",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Behind International Convention Center",
    slaRate: 92.5,
    activeLoad: 28,
    monthlyProcessed: 290,
    fieldSquadStatus: "Active - Bagmati corridor riverfront cleaning squad",
    roadDiggingPermits: 4,
    waterSupplyStatus: "Maintenance underway at Shankhamul pipeline",
    emergencyStatus: "Amber (High citizen queue volume)"
  },
  {
    wardNo: 16,
    nameEn: "Ward 16 - Balaju / Sorhakhutte",
    nameNe: "वडा नं. १६ - बालाजु / सोह्रखुट्टे",
    chair: "Mukunda Rijal (In-charge)",
    secretary: "Keshav Neupane",
    phone: "01-4351016",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Balaju Industrial Estate Chowk",
    slaRate: 91.2,
    activeLoad: 33,
    monthlyProcessed: 320,
    fieldSquadStatus: "Active - Balaju ring road storm drainage desilting",
    roadDiggingPermits: 5,
    waterSupplyStatus: "Normal Distribution",
    emergencyStatus: "Green (Normal operations)"
  },
  {
    wardNo: 28,
    nameEn: "Ward 28 - Bagbazar / Kamaladi",
    nameNe: "वडा नं. २८ - बागबजार / कमलादी",
    chair: "Bhai Ram Khadka",
    secretary: "Sushila Tamang",
    phone: "01-4228028",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Near PK Campus Road",
    slaRate: 97.2,
    activeLoad: 8,
    monthlyProcessed: 130,
    fieldSquadStatus: "Commercial zone market monitoring squad",
    roadDiggingPermits: 1,
    waterSupplyStatus: "Normal Pressure",
    emergencyStatus: "Green (Normal operations)"
  },
  {
    wardNo: 32,
    nameEn: "Ward 32 - Koteshwor / Subidhanagar",
    nameNe: "वडा नं. ३२ - कोटेश्वर / सुविधा नगर",
    chair: "Navaraj Bhattarai",
    secretary: "Pradeep Shrestha",
    phone: "01-4991032",
    officeHours: "10:00 AM - 5:00 PM (Sun - Fri)",
    location: "Koteshwor Multiple Campus Marg",
    slaRate: 93.8,
    activeLoad: 26,
    monthlyProcessed: 275,
    fieldSquadStatus: "Active - Highway corridor surveillance & waste segregation",
    roadDiggingPermits: 2,
    waterSupplyStatus: "Scheduled Distribution (Morning 6:00 AM)",
    emergencyStatus: "Green (Normal operations)"
  }
];

export default function WardExplorer() {
  const { lang, speakText, services, setPreselectedService, setIsApplyModalOpen } = useApp();
  const [selectedWardNo, setSelectedWardNo] = useState(4);

  const currentWard = KATHMANDU_WARDS.find((w) => w.wardNo === selectedWardNo) || KATHMANDU_WARDS[0];

  const handleAudioSummary = () => {
    const text = lang === "ne"
      ? `${currentWard.nameNe}। वडा सचिव: ${currentWard.secretary}। फोन: ${currentWard.phone}। हाल सक्रिय आवेदन: ${currentWard.activeLoad} वटा। सेवा स्तर समयमै पूरा दर: ${currentWard.slaRate} प्रतिशत। फिल्ड टोली: ${currentWard.fieldSquadStatus}।`
      : `${currentWard.nameEn}. Ward Secretary: ${currentWard.secretary}. Helpline: ${currentWard.phone}. Active citizen queue: ${currentWard.activeLoad} applications. SLA compliance rate: ${currentWard.slaRate} percent. Municipal field squad: ${currentWard.fieldSquadStatus}.`;
    speakText(text);
  };

  return (
    <div className="ward-explorer-card" style={{ marginTop: "32px" }}>
      {/* Header */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: "12px",
          marginBottom: "18px" 
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <MapPin size={13} />
            <span>Kathmandu Metropolitan City Ward Status Radar</span>
          </div>
          <h3 style={{ fontSize: "1.2rem", color: "var(--heading)", marginTop: "2px" }}>
            {lang === "ne" ? "काठमाडौँ महानगरपालिका वडा प्रत्यक्ष स्थिति" : "Live Municipal Ward Operations & Service Load"}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            Inspect real-time SLA metrics, field squad status, and contact information across municipal wards.
          </p>
        </div>

        <button
          type="button"
          className="btn-neu"
          onClick={handleAudioSummary}
          title="Listen to Ward Summary (Audio Reader)"
          style={{ gap: "6px" }}
        >
          <Volume2 size={14} color="var(--accent)" />
          <span>{lang === "ne" ? "वडा विवरण सुन्नुहोस्" : "Listen to Ward Status"}</span>
        </button>
      </div>

      {/* Ward Selector Pills */}
      <div 
        className="ward-selector-row"
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "20px"
        }}
      >
        {KATHMANDU_WARDS.map((w) => {
          const isSelected = w.wardNo === selectedWardNo;
          return (
            <button
              key={w.wardNo}
              type="button"
              onClick={() => setSelectedWardNo(w.wardNo)}
              className={`ward-pill-btn ${isSelected ? "active" : ""}`}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                background: isSelected ? "var(--bg-surface)" : "var(--bg)",
                boxShadow: isSelected ? "var(--neu-pressed)" : "var(--neu-btn)",
                color: isSelected ? "var(--accent)" : "var(--heading)",
                fontWeight: isSelected ? 600 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "var(--transition)"
              }}
            >
              <span 
                style={{ 
                  width: "7px", 
                  height: "7px", 
                  borderRadius: "50%", 
                  backgroundColor: w.emergencyStatus.startsWith("Amber") ? "#F59E0B" : "#10B981" 
                }} 
              />
              <span>{lang === "ne" ? (w.wardNo < 10 ? `वडा ०${w.wardNo}` : `वडा ${w.wardNo}`) : `Ward ${String(w.wardNo).padStart(2, '0')}`}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Ward Detail Canvas */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px"
        }}
      >
        {/* Ward Info Card */}
        <div 
          style={{
            padding: "18px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--neu-raised-sm)",
            background: "var(--bg)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div>
              <span className="meta-pill" style={{ background: "var(--soft-blue)", color: "var(--soft-blue-text)", marginBottom: "4px" }}>
                KMC Ward {String(currentWard.wardNo).padStart(2, '0')}
              </span>
              <h4 style={{ fontSize: "1.05rem", color: "var(--heading)", marginTop: "4px" }}>
                {lang === "ne" ? currentWard.nameNe : currentWard.nameEn}
              </h4>
            </div>
            <div 
              style={{
                padding: "6px 10px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.72rem",
                fontWeight: 600,
                background: currentWard.emergencyStatus.startsWith("Amber") ? "var(--soft-amber)" : "var(--soft-sage)",
                color: currentWard.emergencyStatus.startsWith("Amber") ? "var(--soft-amber-text)" : "var(--soft-sage-text)"
              }}
            >
              {currentWard.emergencyStatus.split("(")[0]}
            </div>
          </div>

          <div style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "12px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={14} color="var(--accent)" />
              <span>Ward Secretary: <strong>{currentWard.secretary}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={14} color="var(--accent)" />
              <span>Direct Hotline: <strong style={{ color: "var(--heading)" }}>{currentWard.phone}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={14} color="var(--accent)" />
              <span>Office Hours: {currentWard.officeHours}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={14} color="var(--accent)" />
              <span>Location: {currentWard.location}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px", justifyContent: "center" }}
            onClick={() => {
              setPreselectedService(services[0]);
              setIsApplyModalOpen(true);
            }}
          >
            <span>{lang === "ne" ? `यस वडामा सिफारिस पेश गर्नुहोस्` : `Apply for Ward ${String(currentWard.wardNo).padStart(2, '0')} Service`}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Live SLA & Workload Gauges */}
        <div 
          style={{
            padding: "18px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--neu-raised-sm)",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h5 style={{ fontSize: "0.88rem", color: "var(--heading)", marginBottom: "12px" }}>
              Operational Performance & Citizen Queue
            </h5>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              {/* SLA Metric Box */}
              <div 
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--neu-inset-sm)",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                  {currentWard.slaRate}%
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px" }}>
                  SLA On-Time Fulfillment
                </div>
              </div>

              {/* Active Queue Box */}
              <div 
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--neu-inset-sm)",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--heading)", fontFamily: "var(--font-display)" }}>
                  {currentWard.activeLoad}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px" }}>
                  Pending In-Queue
                </div>
              </div>
            </div>

            {/* Monthly Total */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--body)", padding: "4px 0" }}>
              <span>Monthly Processed Deliverables:</span>
              <strong style={{ color: "var(--heading)" }}>{currentWard.monthlyProcessed} certificates</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--body)", padding: "4px 0" }}>
              <span>Active Road Digging Permits:</span>
              <strong style={{ color: "var(--heading)" }}>{currentWard.roadDiggingPermits} active works</strong>
            </div>
          </div>

          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(208, 208, 208, 0.4)", fontSize: "0.74rem", color: "var(--muted)" }}>
            ⚡ Updated in real-time by Kathmandu Metropolitan Data Hub
          </div>
        </div>

        {/* Municipal Field Squad & Utilities */}
        <div 
          style={{
            padding: "18px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--neu-raised-sm)",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h5 style={{ fontSize: "0.88rem", color: "var(--heading)", marginBottom: "12px" }}>
              Active Field Squad & Infrastructure
            </h5>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Field Squad Notice */}
              <div 
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--soft-blue)",
                  color: "var(--soft-blue-text)",
                  fontSize: "0.8rem",
                  display: "flex",
                  gap: "8px"
                }}
              >
                <HardHat size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Field Squad:</strong> {currentWard.fieldSquadStatus}
                </div>
              </div>

              {/* Water Supply */}
              <div 
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--soft-sage)",
                  color: "var(--soft-sage-text)",
                  fontSize: "0.8rem",
                  display: "flex",
                  gap: "8px"
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Water Supply & Pipeline:</strong> {currentWard.waterSupplyStatus}
                </div>
              </div>
            </div>
          </div>

          <div 
            style={{ 
              marginTop: "12px", 
              padding: "8px 12px", 
              borderRadius: "var(--radius-sm)", 
              boxShadow: "var(--neu-inset-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.74rem"
            }}
          >
            <span style={{ color: "var(--muted)" }}>Emergency Helpline</span>
            <span style={{ fontWeight: 600, color: "var(--accent)" }}>1180 (Toll Free)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
