import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Calculator, 
  Coins, 
  FileText, 
  Check, 
  Info, 
  Receipt, 
  Building2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function MunicipalRevenueCalculator() {
  const { lang, showToast } = useApp();

  const [serviceType, setServiceType] = useState("property_tax");
  const [valuationAmount, setValuationAmount] = useState(2500000); // 25 Lakhs NPR
  const [businessCapital, setBusinessCapital] = useState(1000000); // 10 Lakhs NPR
  const [vitalDaysElapsed, setVitalDaysElapsed] = useState(20); // within 35 days
  const [buildingSqFt, setBuildingSqFt] = useState(1200);
  const [buildingType, setBuildingType] = useState("residential");
  const [monthlyRent, setMonthlyRent] = useState(35000);

  // Fee calculation logic based on KMC Revenue Act 2080
  const calculateFee = () => {
    switch (serviceType) {
      case "citizenship":
        return {
          baseFee: 0,
          stampFee: 0,
          penalty: 0,
          total: 0,
          lawReference: "नेपालको संविधान धारा ८ तथा नागरिकता ऐन २०६३ बमोजिम निःशुल्क",
          breakdown: [
            { label: lang === "ne" ? "नागरिकता सिफारिस दस्तुर" : "Citizenship Sifarish Fee", amount: 0 },
            { label: lang === "ne" ? "हुलाक टिकट / राजस्व छाप" : "Revenue Stamp", amount: 0 }
          ]
        };

      case "vital_registration": {
        const isLate = vitalDaysElapsed > 35;
        const base = 0;
        const penalty = isLate ? 50 : 0;
        const stamp = isLate ? 10 : 0;
        return {
          baseFee: base,
          stampFee: stamp,
          penalty: penalty,
          total: base + penalty + stamp,
          lawReference: "व्यक्तिगत घटना दर्ता ऐन २०३३ तथा स्थानीय सरकार सञ्चालन ऐन २०७४ दफा १२",
          breakdown: [
            { label: lang === "ne" ? "३५ दिनभित्रको दर्ता" : "Registration within 35 days", amount: 0 },
            { label: lang === "ne" ? "३५ दिन नाघेको विलम्ब दस्तुर" : "Late Filing Penalty (>35 days)", amount: penalty },
            { label: lang === "ne" ? "हुलाक टिकट" : "Revenue Stamp", amount: stamp }
          ]
        };
      }

      case "property_tax": {
        // Valuation slab calculation
        let fee = 500;
        if (valuationAmount > 5000000) {
          fee = 3000;
        } else if (valuationAmount > 1000000) {
          fee = 1500;
        }
        return {
          baseFee: fee,
          stampFee: 20,
          penalty: 0,
          total: fee + 20,
          lawReference: "काठमाडौँ महानगरपालिका आर्थिक ऐन २०८० अनुसूची ३ (सम्पत्ति मूल्यांकन तथा सिफारिस)",
          breakdown: [
            { label: lang === "ne" ? "मूल्यांकन प्रमाणीकरण दस्तुर" : "Valuation Certification Fee", amount: fee },
            { label: lang === "ne" ? "वडा अभिलेख राजस्व दस्तुर" : "Ward Documentation Stamp", amount: 20 }
          ]
        };
      }

      case "business_permit": {
        let fee = 1000;
        if (businessCapital > 5000000) {
          fee = 12000;
        } else if (businessCapital > 1500000) {
          fee = 7500;
        } else if (businessCapital > 500000) {
          fee = 3000;
        }
        return {
          baseFee: fee,
          stampFee: 50,
          penalty: 0,
          total: fee + 50,
          lawReference: "काठमाडौँ महानगरपालिका व्यवसाय तथा पसल दर्ता नियमावली २०७९",
          breakdown: [
            { label: lang === "ne" ? "व्यवसाय इजाजत दस्तुर" : "Business Operating Permit", amount: fee },
            { label: lang === "ne" ? "व्यावसायिक साइनबोर्ड तथा दर्ता छाप" : "Signboard & Registration Stamp", amount: 50 }
          ]
        };
      }

      case "building_permit": {
        const ratePerSqFt = buildingType === "commercial" ? 35 : 15;
        const fee = buildingSqFt * ratePerSqFt;
        return {
          baseFee: fee,
          stampFee: 500,
          penalty: 0,
          total: fee + 500,
          lawReference: "भवन निर्माण तथा नक्सा पास मापदण्ड २०८० (काठमाडौँ महानगरपालिका)",
          breakdown: [
            { label: `${buildingType === 'commercial' ? 'Commercial' : 'Residential'} Area (${buildingSqFt} sq ft × NPR ${ratePerSqFt})`, amount: fee },
            { label: lang === "ne" ? "इन्जिनियरिङ रेखांकन तथा प्राविधिक शुल्क" : "Engineering Inspection & Scrutiny", amount: 500 }
          ]
        };
      }

      case "rent_tax": {
        const annualRent = monthlyRent * 12;
        const tax = Math.round(annualRent * 0.10); // 10% statutory municipal rent tax
        return {
          baseFee: tax,
          stampFee: 0,
          penalty: 0,
          total: tax,
          lawReference: "स्थानीय सरकार सञ्चालन ऐन २०७४ दफा ६० (घरबहाल कर १० प्रतिशत)",
          breakdown: [
            { label: lang === "ne" ? `वार्षिक कुल भाडा (रु. ${annualRent.toLocaleString()})` : `Annual Rent (NPR ${annualRent.toLocaleString()})`, amount: annualRent },
            { label: lang === "ne" ? "स्थानीय सरकार घरबहाल कर (१०%)" : "10% Municipal House Rent Tax", amount: tax }
          ]
        };
      }

      default:
        return { baseFee: 0, stampFee: 0, penalty: 0, total: 0, lawReference: "", breakdown: [] };
    }
  };

  const result = calculateFee();

  const handleCopyEstimate = () => {
    navigator.clipboard?.writeText(
      `JanSewa Kathmandu Revenue Estimate: Total NPR ${result.total.toLocaleString()} for ${serviceType}`
    );
    showToast(
      lang === "ne" ? "दस्तुर विवरण प्रतिलिपि गरियो!" : "Fee estimate copied to clipboard!",
      "info"
    );
  };

  return (
    <div className="revenue-calculator-card" style={{ background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: "26px", boxShadow: "var(--neu-raised)", marginBottom: "32px" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--heading)" }}>
            <Calculator size={20} color="var(--accent)" />
            <span>{lang === "ne" ? "काठमाडौँ महानगरपालिका राजस्व तथा दस्तुर क्यालकुलेटर" : "KMC Municipal Revenue & Fee Estimator"}</span>
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
            {lang === "ne" 
              ? "स्थानीय सरकार सञ्चालन ऐन २०७४ तथा महानगर आर्थिक ऐन २०८० बमोजिम आधिकारिक दस्तुर हिसाब गर्नुहोस्।" 
              : "Calculate statutory fees according to Local Government Operation Act 2074 & KMC Revenue Act 2080."}
          </p>
        </div>

        <span className="portal-pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
          <ShieldCheck size={13} color="var(--soft-sage-text)" />
          <span>{lang === "ne" ? "ऐन नियम प्रमाणीकृत" : "Act 2080 Verified"}</span>
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {/* Left Input Configuration */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="form-label">
              {lang === "ne" ? "सेवा विधा चयन गर्नुहोस् (Service Category):" : "Select Municipal Service:"}
            </label>
            <select
              className="form-select"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              aria-label="Service category"
            >
              <option value="property_tax">{lang === "ne" ? "घरजग्गा तथा सम्पत्ति मूल्यांकन सिफारिस" : "Property Valuation & Land Recommendation"}</option>
              <option value="vital_registration">{lang === "ne" ? "व्यक्तिगत घटना दर्ता (जन्म/विवाह/मृत्यु)" : "Vital Events Registration (Birth/Death/Marriage)"}</option>
              <option value="business_permit">{lang === "ne" ? "व्यवसाय दर्ता तथा सञ्चालन इजाजत" : "Business Registration & Operating Permit"}</option>
              <option value="citizenship">{lang === "ne" ? "नागरिकता सिफारिस (नयाँ/प्रतिलिपि)" : "Citizenship Recommendation (New/Duplicate)"}</option>
              <option value="building_permit">{lang === "ne" ? "भवन निर्माण तथा नक्सा पास इजाजत" : "Building Permit & Blue-Print Approval"}</option>
              <option value="rent_tax">{lang === "ne" ? "घरबहाल कर (१०% स्थानीय राजस्व)" : "House Rent Tax (10% Municipal Rate)"}</option>
            </select>
          </div>

          {/* Conditional Inputs */}
          {serviceType === "property_tax" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label className="form-label" style={{ margin: 0 }}>
                  {lang === "ne" ? "सम्पत्ति सरकारी मूल्यांकन (NPR):" : "Government Property Valuation (NPR):"}
                </label>
                <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: "0.85rem" }}>
                  रु. {valuationAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="20000000"
                step="500000"
                value={valuationAmount}
                onChange={(e) => setValuationAmount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--muted)" }}>
                <span>रु ५ लाख</span>
                <span>रु १ करोड</span>
                <span>रु २ करोड</span>
              </div>
            </div>
          )}

          {serviceType === "vital_registration" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label className="form-label" style={{ margin: 0 }}>
                  {lang === "ne" ? "घटना घटेको दिन (Days elapsed since event):" : "Days elapsed since event:"}
                </label>
                <span style={{ fontWeight: 700, color: vitalDaysElapsed > 35 ? "#EF4444" : "var(--soft-sage-text)", fontSize: "0.85rem" }}>
                  {vitalDaysElapsed} {lang === "ne" ? "दिन" : "days"} {vitalDaysElapsed <= 35 ? "(३५ दिनभित्र - निःशुल्क)" : "(३५ दिन नाघेको - विलम्ब शुल्क लागू)"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="120"
                step="1"
                value={vitalDaysElapsed}
                onChange={(e) => setVitalDaysElapsed(Number(e.target.value))}
                style={{ width: "100%", accentColor: vitalDaysElapsed > 35 ? "#EF4444" : "var(--accent)" }}
              />
            </div>
          )}

          {serviceType === "business_permit" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label className="form-label" style={{ margin: 0 }}>
                  {lang === "ne" ? "व्यवसायको चुक्ता/अधिकृत पुँजी (Capital):" : "Authorized Capital (NPR):"}
                </label>
                <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: "0.85rem" }}>
                  रु. {businessCapital.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="200000"
                value={businessCapital}
                onChange={(e) => setBusinessCapital(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          )}

          {serviceType === "building_permit" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className={`btn ${buildingType === "residential" ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, fontSize: "0.78rem", padding: "8px" }}
                  onClick={() => setBuildingType("residential")}
                >
                  {lang === "ne" ? "आवासीय (रु १५/वर्गफिट)" : "Residential (NPR 15/sqft)"}
                </button>
                <button
                  type="button"
                  className={`btn ${buildingType === "commercial" ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, fontSize: "0.78rem", padding: "8px" }}
                  onClick={() => setBuildingType("commercial")}
                >
                  {lang === "ne" ? "व्यावसायिक (रु ३५/वर्गफिट)" : "Commercial (NPR 35/sqft)"}
                </button>
              </div>

              <div>
                <label className="form-label">
                  {lang === "ne" ? "कुल निर्माण क्षेत्रफल (Plinth/Built-up Area in Sq Ft):" : "Total Built-up Area (Sq Ft):"}
                </label>
                <input
                  type="number"
                  className="input-text"
                  value={buildingSqFt}
                  onChange={(e) => setBuildingSqFt(Number(e.target.value) || 0)}
                  min="100"
                  max="50000"
                />
              </div>
            </div>
          )}

          {serviceType === "rent_tax" && (
            <div>
              <label className="form-label">
                {lang === "ne" ? "मासिक घर/पसल बहाल रकम (Monthly Rent in NPR):" : "Monthly House/Shop Rent (NPR):"}
              </label>
              <input
                type="number"
                className="input-text"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                min="1000"
                step="1000"
              />
              <span style={{ fontSize: "0.74rem", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                {lang === "ne" ? "काठमाडौँ महानगरमा घरबहाल कर १०% वडा कार्यालय वा अनलाइन तिर्नुपर्ने कानुनी व्यवस्था छ।" : "KMC requires 10% rent tax payable to ward or online portal."}
              </span>
            </div>
          )}

          {serviceType === "citizenship" && (
            <div style={{ padding: "14px", background: "var(--bg)", borderRadius: "var(--radius-md)", boxShadow: "var(--neu-inset-sm)", fontSize: "0.82rem", color: "var(--body)", lineHeight: 1.6 }}>
              ℹ️ <strong>{lang === "ne" ? "नागरिक अधिकार प्रत्याभूति:" : "Statutory Citizen Guarantee:"}</strong> {lang === "ne" ? "नेपाली नागरिकता सिफारिसका लागि कुनै पनि वडा वा स्थानीय तहले राजस्व वा दस्तुर असुल गर्न पाउँदैन। यो सेवा पूर्ण रूपमा निःशुल्क छ।" : "Ward offices are strictly prohibited from charging fees for citizenship recommendations. It is completely free of cost."}
            </div>
          )}
        </div>

        {/* Right Output: Itemized Receipt Box */}
        <div style={{ background: "var(--bg)", borderRadius: "var(--radius-md)", padding: "20px", boxShadow: "var(--neu-inset)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(208, 208, 208, 0.6)", paddingBottom: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Receipt size={15} color="var(--accent)" />
                <span>{lang === "ne" ? "आधिकारिक राजस्व लागत विवरण" : "Statutory Revenue Receipt"}</span>
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                KMC Ward 04 Desk
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {result.breakdown.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--muted)" }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--heading)" }}>
                    रु {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "2px solid rgba(208, 208, 208, 0.4)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--heading)" }}>
                {lang === "ne" ? "कुल बुझाउनुपर्ने राजस्व (Total):" : "Total Revenue Payable:"}
              </span>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: result.total === 0 ? "var(--soft-sage-text)" : "var(--accent)" }}>
                NPR {result.total.toLocaleString()}
              </span>
            </div>

            <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic", lineHeight: 1.4 }}>
              📜 {result.lawReference}
            </div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, minWidth: "120px", fontSize: "0.76rem", padding: "8px" }}
              onClick={handleCopyEstimate}
            >
              {lang === "ne" ? "विवरण कपी गर्नुहोस्" : "Copy Estimate"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1, minWidth: "120px", fontSize: "0.76rem", padding: "8px" }}
              onClick={() => showToast(lang === "ne" ? "अनलाइन भुक्तानी (eSewa / Khalti / ConnectIPS) गेटवे तयारी अवस्थामा छ।" : "Online payment gateway (ConnectIPS/eSewa) ready.", "info")}
            >
              <Coins size={13} />
              <span>{lang === "ne" ? "अनलाइन भुक्तानी रसिद" : "e-Payment Slip"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
