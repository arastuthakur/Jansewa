import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { askJanSewaSathi } from "../../services/geminiService";
import { 
  Sparkles, 
  Send, 
  X, 
  Loader2, 
  ShieldCheck
} from "lucide-react";

// Helper to parse inline bolding **text**
function formatInline(str) {
  if (!str) return null;
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} style={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Clean, accessible Markdown & list text formatter
function FormattedChatText({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const nodes = [];
  let currentList = null;

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      const isNum = currentList[0].type === "number";
      nodes.push(
        <div
          key={`list-${nodes.length}`}
          style={{
            margin: "6px 0",
            display: "flex",
            flexDirection: "column",
            gap: "5px"
          }}
        >
          {currentList.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                lineHeight: 1.55,
                fontSize: "0.85rem",
                paddingLeft: item.indent ? "16px" : "2px"
              }}
            >
              <span
                style={{
                  color: isNum ? "inherit" : "var(--accent)",
                  fontWeight: 700,
                  fontSize: isNum ? "0.78rem" : "0.92rem",
                  minWidth: isNum ? "20px" : "10px",
                  lineHeight: 1.55,
                  userSelect: "none"
                }}
              >
                {item.bullet}
              </span>
              <span style={{ flex: 1 }}>{formatInline(item.text)}</span>
            </div>
          ))}
        </div>
      );
      currentList = null;
    }
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    const isIndented = rawLine.startsWith("  ") || rawLine.startsWith("\t");

    // Bullet lines: •, -, *
    const bulletMatch = trimmed.match(/^([•\-\*])\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList) currentList = [];
      currentList.push({
        type: "bullet",
        bullet: "•",
        text: bulletMatch[2],
        indent: isIndented
      });
      return;
    }

    // Numbered lines: 1., 2., or Devanagari १., २.
    const numberMatch = trimmed.match(/^([0-9]+|[०-९]+)[\.\)]\s+(.+)$/);
    if (numberMatch) {
      if (!currentList) currentList = [];
      currentList.push({
        type: "number",
        bullet: `${numberMatch[1]}.`,
        text: numberMatch[2],
        indent: isIndented
      });
      return;
    }

    // Regular paragraph line
    flushList();
    nodes.push(
      <p
        key={`p-${idx}`}
        style={{
          margin: "4px 0",
          lineHeight: 1.58,
          fontSize: "0.85rem"
        }}
      >
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="formatted-chat-content">{nodes}</div>;
}

export default function JanSewaSathi({ isFullPage = false }) {
  const { isChatbotOpen, setIsChatbotOpen, t, lang } = useApp();

  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "bot",
      text: lang === "ne" 
        ? "नमस्ते! म जनसेवा साथी (JanSewa Sathi) हुँ। तपाईंलाई वडा कार्यालय, नागरिकता सिफारिस, बसोबास प्रमाणित, वा कर सम्बन्धी के जानकारी चाहिन्छ? म नेपाली, रोमन नेपाली वा अंग्रेजीमा उत्तर दिन सक्छु।"
        : "Namaste! I am JanSewa Sathi, your AI municipal assistant. How may I assist you with ward services, citizenship recommendations, or public complaints today?"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "नागरिकता सिफारिस कागजात?", query: "नागरिकता सिफारिस लिन के के कागजात चाहिन्छ र कति दस्तुर लाग्छ?" },
    { label: "Residence verification rules?", query: "What documents are required for residence verification in Ward 04?" },
    { label: "सडकको खाल्डो उजुरी कसरी गर्ने?", query: "सडक भासिएको वा खानेपानी पाइप फुटेको गुनासो कसरी दर्ता गर्ने?" },
    { label: "Business Registration fee?", query: "How much is the municipal trade license fee for small retail shop?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryToSend = null) => {
    const q = queryToSend || inputVal.trim();
    if (!q) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      const botResponse = await askJanSewaSathi(q, messages);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponse.text,
          isSimulated: botResponse.isSimulated
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
      {/* Header */}
      <div className="chatbot-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--bg)", boxShadow: "var(--neu-raised-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} color="var(--accent)" />
          </div>
          <div>
            <h4 style={{ fontSize: "0.92rem", margin: 0, color: "var(--heading)" }}>
              जनसेवा साथी (JanSewa Sathi)
            </h4>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              Grounded Municipal AI Service Assistant
            </span>
          </div>
        </div>
        {!isFullPage && (
          <button
            type="button"
            onClick={() => setIsChatbotOpen(false)}
            className="btn-close"
            aria-label="Close assistant"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ padding: "10px 14px", background: "var(--bg)", borderBottom: "1px solid rgba(208, 208, 208, 0.4)", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: "0.72rem", padding: "5px 10px", whiteSpace: "nowrap" }}
            onClick={() => handleSend(p.query)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <FormattedChatText text={msg.text} />
            {msg.sender === "bot" && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.68rem", color: "var(--muted)", marginTop: "8px" }}>
                <ShieldCheck size={12} color="var(--soft-sage-text)" />
                <span>Grounded in Local Government Act 2074</span>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble bot" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Loader2 size={14} className="animate-spin" color="var(--accent)" />
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              JanSewa Sathi is referencing government rules & guidelines...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <form
        className="chatbot-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="input-text"
          style={{ fontSize: "0.85rem", padding: "9px 14px" }}
          placeholder="नेपाली वा English मा सोध्नुहोस्..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          aria-label="Chat input"
        />
        <button type="submit" className="btn btn-primary" style={{ padding: "9px 16px" }} disabled={isTyping} aria-label="Send message">
          <Send size={14} />
        </button>
      </form>
    </div>
  );

  if (isFullPage) {
    return (
      <div style={{ maxWidth: "840px", margin: "0 auto", height: "720px", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--neu-raised)", background: "var(--bg)" }}>
        {content}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="floating-chatbot-btn"
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        title="Open JanSewa Sathi AI Assistant"
        aria-label="Open JanSewa Sathi AI Assistant"
      >
        <Sparkles size={22} />
      </button>

      {isChatbotOpen && (
        <div className="chatbot-window" role="dialog" aria-label="JanSewa Sathi Chatbot Window">
          {content}
        </div>
      )}
    </>
  );
}
