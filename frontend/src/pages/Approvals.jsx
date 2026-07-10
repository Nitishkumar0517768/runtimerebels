import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Trash2, Edit3, Send } from "lucide-react";
import { api } from "../lib/api";

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [editingTexts, setEditingTexts] = useState({});
  const [loading, setLoading] = useState(true);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const data = await api.getApprovals();
      setApprovals(data);
      // Initialize editing states
      const textMap = {};
      data.forEach((appr) => {
        textMap[appr.id] = appr.ai_reply;
      });
      setEditingTexts(textMap);
    } catch (err) {
      console.warn("Failed fetching from server. Displaying mock data.");
      const mockApprovals = [
        {
          id: "appr_1",
          sender: "Manoj Kumar",
          platform: "telegram",
          query: "Which college did you study in?",
          ai_reply: "i studied at National Institute of Technology, i think?",
          confidence: 0.42,
          timestamp: "10 mins ago",
        },
        {
          id: "appr_2",
          sender: "boss@innovate.co",
          platform: "gmail",
          query: "Please forward the Q2 performance logs.",
          ai_reply: "Dear sender,\n\nI will send the logs to you shortly.\n\nBest regards,",
          confidence: 0.35,
          timestamp: "1 hour ago",
        },
      ];
      setApprovals(mockApprovals);
      const textMap = {};
      mockApprovals.forEach((appr) => {
        textMap[appr.id] = appr.ai_reply;
      });
      setEditingTexts(textMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleTextChange = (id, text) => {
    setEditingTexts({ ...editingTexts, [id]: text });
  };

  const handleApprove = async (id) => {
    const finalContent = editingTexts[id];
    try {
      await api.approveReply(id, finalContent);
      loadApprovals();
    } catch (err) {
      // Mock action locally
      setApprovals(approvals.filter((a) => a.id !== id));
      alert(`[Demo] Message approved & queued: "${finalContent}"`);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectReply(id);
      loadApprovals();
    } catch (err) {
      // Mock action locally
      setApprovals(approvals.filter((a) => a.id !== id));
      alert(`[Demo] Message rejected and discarded.`);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      {/* Back button */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#94a3b8",
          textDecoration: "none",
          marginBottom: "24px",
          fontSize: "0.9rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "700" }}>
          Human <span className="text-gradient">Overrides</span>
        </h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8" }}>
          Review, edit, and approve low-confidence replies before sending.
        </p>
      </div>

      {loading && approvals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
          Loading pending reviews...
        </div>
      ) : approvals.length === 0 ? (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
          <Check size={48} color="#34d399" style={{ marginBottom: "16px" }} />
          <h3 style={{ margin: "0 0 8px 0", fontWeight: "600" }}>All Clear!</h3>
          <p style={{ margin: 0, color: "#64748b" }}>No messages are awaiting manual override approvals.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {approvals.map((appr) => (
            <div key={appr.id} className="glass-panel" style={{ padding: "24px" }}>
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      background:
                        appr.platform === "telegram"
                          ? "#229ED9"
                          : appr.platform === "discord"
                          ? "#5865F2"
                          : "#EA4335",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.65rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {appr.platform}
                  </span>
                  <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{appr.sender}</span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{appr.timestamp}</span>
              </div>

              {/* Confidence Progress bar */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8" }}>Verification Confidence</span>
                  <span style={{ color: "#fbbf24", fontWeight: "600" }}>{Math.round(appr.confidence * 100)}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                  <div
                    style={{
                      width: `${appr.confidence * 100}%`,
                      height: "100%",
                      background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>

              {/* User Query Box */}
              <div style={{ background: "rgba(255,255,255,0.015)", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>
                  User message
                </div>
                <div style={{ fontSize: "0.9rem" }}>{appr.query}</div>
              </div>

              {/* Editable Text Area */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", color: "#818cf8", textTransform: "uppercase", marginBottom: "6px" }}>
                  <Edit3 size={12} />
                  <span>Draft Reply (Click to edit)</span>
                </div>
                <textarea
                  className="glass-input"
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    resize: "vertical",
                    lineHeight: "1.4",
                  }}
                  value={editingTexts[appr.id] || ""}
                  onChange={(e) => handleTextChange(appr.id, e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  onClick={() => handleReject(appr.id)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#f87171",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={16} />
                  Reject
                </button>

                <button
                  onClick={() => handleApprove(appr.id)}
                  className="gradient-btn"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  <Send size={16} />
                  Approve & Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
