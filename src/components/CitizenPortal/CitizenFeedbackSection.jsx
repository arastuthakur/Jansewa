import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Star, 
  Smile, 
  Send, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2 
} from "lucide-react";

export default function CitizenFeedbackSection() {
  const { lang, showToast } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [speed, setSpeed] = useState("fast");
  const [courtesy, setCourtesy] = useState("excellent");
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast(
      lang === "ne"
        ? "तपाईंको अमूल्य पृष्ठपोषण दर्ता भयो। धन्यवाद!"
        : "Thank you for your valuable feedback!",
      "success"
    );
  };

  return (
    <div style={{ background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--neu-raised)", marginBottom: "32px" }}>
      <div className="section-header" style={{ marginBottom: "16px" }}>
        <div>
          <h4 style={{ fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--heading)" }}>
            <Smile size={18} color="var(--accent)" />
            <span>{lang === "ne" ? "नागरिक सन्तुष्टि तथा पृष्ठपोषण (सुशासन ऐन, २०६४)" : "Citizen Satisfaction Survey (Good Governance Act 2064)"}</span>
          </h4>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px" }}>
            {lang === "ne"
              ? "काठमाडौँ महानगर तथा वडा कार्यालयको डिजिटल सेवा प्रवाहबारे आफ्नो राय व्यक्त गर्नुहोस्।"
              : "Rate the responsiveness, staff courtesy, and overall digital experience of KMC JanSewa."}
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div style={{ padding: "24px", textAlign: "center", background: "var(--bg)", borderRadius: "var(--radius-md)", boxShadow: "var(--neu-inset-sm)" }}>
          <CheckCircle2 size={36} color="var(--soft-sage-text)" style={{ margin: "0 auto 10px" }} />
          <h5 style={{ fontSize: "0.95rem", color: "var(--heading)", marginBottom: "4px" }}>
            {lang === "ne" ? "पृष्ठपोषण सफलतापूर्वक प्राप्त भयो!" : "Feedback Recorded Successfully!"}
          </h5>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            {lang === "ne"
              ? "तपाईंको मूल्याङ्कनले काठमाडौँ महानगरको सेवा प्रवाह सुधार गर्न मद्दत पुग्नेछ।"
              : "Your feedback contributes to Kathmandu Metropolitan City service delivery scorecards."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Star Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--heading)" }}>
              {lang === "ne" ? "समग्र सन्तुष्टि स्तर:" : "Overall Satisfaction:"}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "transform 0.15s ease"
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star rating`}
                >
                  <Star
                    size={22}
                    fill={(hoverRating || rating) >= star ? "#FBBF24" : "none"}
                    color={(hoverRating || rating) >= star ? "#FBBF24" : "var(--muted)"}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)" }}>
              {rating === 5 ? (lang === "ne" ? "उत्कृष्ट (५/५)" : "Excellent (5/5)") : `${rating}/5`}
            </span>
          </div>

          {/* Quick choices: Speed & Staff courtesy */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            <div>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>
                {lang === "ne" ? "सेवा प्रवाहको गति (Service Speed):" : "Service Speed:"}
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["fast", "normal", "slow"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn ${speed === s ? "btn-primary" : "btn-secondary"}`}
                    style={{ flex: 1, padding: "6px 8px", fontSize: "0.74rem" }}
                    onClick={() => setSpeed(s)}
                  >
                    {s === "fast" ? (lang === "ne" ? "छरितो" : "Prompt") : s === "normal" ? (lang === "ne" ? "सामान्य" : "Average") : (lang === "ne" ? "ढिलाइ" : "Delayed")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>
                {lang === "ne" ? "कर्मचारी व्यवहार तथा सहजीकरण:" : "Staff Courtesy & Assistance:"}
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["excellent", "good", "needs_improvement"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`btn ${courtesy === c ? "btn-primary" : "btn-secondary"}`}
                    style={{ flex: 1, padding: "6px 8px", fontSize: "0.74rem" }}
                    onClick={() => setCourtesy(c)}
                  >
                    {c === "excellent" ? (lang === "ne" ? "शिष्ट" : "Polite") : c === "good" ? (lang === "ne" ? "राम्रो" : "Good") : (lang === "ne" ? "सुधार आवश्यक" : "Can Improve")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <textarea
              className="form-textarea"
              rows={2}
              style={{ fontSize: "0.82rem", padding: "10px" }}
              placeholder={lang === "ne" ? "कुनै थप सुझाव वा टिप्पणी भए लेख्नुहोस्..." : "Any additional remarks or improvement suggestions..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.8rem", gap: "6px" }}>
              <Send size={13} />
              <span>{lang === "ne" ? "पृष्ठपोषण बुझाउनुहोस्" : "Submit Feedback"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
