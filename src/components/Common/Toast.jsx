import React from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={16} color="var(--soft-sage-text)" />,
    error: <AlertCircle size={16} color="var(--soft-pink-text)" />,
    info: <Info size={16} color="var(--accent)" />
  };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className="toast-pill">
        {icons[toast.type] || icons.info}
        <span style={{ fontSize: "0.84rem", color: "var(--heading)" }}>{toast.message}</span>
      </div>
    </div>
  );
}
