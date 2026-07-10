import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  Sliders,
  Mail,
  MessageCircle,
  Activity,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { api } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    messages_replied: 24,
    avg_response_time: "42s",
    active_platforms: ["telegram", "discord"],
    pending_approvals: 2,
    confidence_score: "88%",
  });
  const [activities, setActivities] = useState([]);
  const [config, setConfig] = useState({
    name: "Nitish",
    formality_level: 3,
    reply_delay_min: 30,
    reply_delay_max: 120,
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await api.getStats();
      const activityData = await api.getActivity();
      const configData = await api.getConfig();

      setStats(statsData);
      setActivities(activityData);
      setConfig(configData);
    } catch (err) {
      console.warn("Failed fetching from backend server, using mock demo data instead.");
      // Load mock items for showcase
      setActivities([
        {
          id: 1,
          platform: "telegram",
          sender: "Ananya",
          query: "Bro are you free tonight?",
          reply: "yeah probably, just chilling at home. what's up?",
          verified: true,
          timestamp: "Just now",
        },
        {
          id: 2,
          platform: "discord",
          sender: "CodeRebel_9",
          query: "Hey did you run the latest migration?",
          reply: "idk about that one, ask the sysops lead",
          verified: false,
          timestamp: "5 mins ago",
        },
        {
          id: 3,
          platform: "gmail",
          sender: "hiring@innovate.co",
          query: "Hello, we reviewed your autopilot profile and wanted to follow up.",
          reply: "Dear sender,\n\nThank you for reaching out. I appreciate the follow-up.\n\nBest regards,",
          verified: true,
          timestamp: "20 mins ago",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePlatformToggle = async (platform) => {
    try {
      await api.togglePlatform(platform);
      loadData();
    } catch (err) {
      // Mock toggle if API offline
      const isActive = stats.active_platforms.includes(platform);
      const newPlatforms = isActive
        ? stats.active_platforms.filter((p) => p !== platform)
        : [...stats.active_platforms, platform];
      setStats({ ...stats, active_platforms: newPlatforms });
    }
  };

  const handleConfigChange = async (key, val) => {
    const updatedConfig = { ...config, [key]: parseInt(val) || val };
    setConfig(updatedConfig);
    try {
      await api.updateConfig(updatedConfig);
    } catch (err) {
      console.error("Failed updating config on server", err);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: "700" }}>
            Digital Twin <span className="text-gradient">Autopilot</span>
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8" }}>
            Monitor and configure your AI conversational clone.
          </p>
        </div>
        <button
          onClick={loadData}
          className="gradient-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", padding: "12px", borderRadius: "12px" }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Replied Today</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{stats.messages_replied}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "12px", borderRadius: "12px" }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Avg Delay</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{stats.avg_response_time}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6", padding: "12px", borderRadius: "12px" }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Confidence Avg</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{stats.confidence_score}</div>
          </div>
        </div>

        <Link
          to="/approvals"
          className="glass-panel"
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            textDecoration: "none",
            color: "inherit",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div
            style={{
              background: stats.pending_approvals > 0 ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
              color: stats.pending_approvals > 0 ? "#fbbf24" : "#34d399",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            {stats.pending_approvals > 0 ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Pending Approvals</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{stats.pending_approvals}</div>
          </div>
        </Link>
      </div>

      {/* Main Configurations Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        {/* Platform Switches */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} color="#6366f1" />
            Platform Channels
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Telegram Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "#229ED9", color: "#fff", padding: "8px", borderRadius: "8px" }}>
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: "500" }}>Telegram Bot</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Active Webhooks listener</div>
                </div>
              </div>
              <button
                onClick={() => handlePlatformToggle("telegram")}
                style={{
                  background: stats.active_platforms.includes("telegram") ? "#4f46e5" : "#1e293b",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {stats.active_platforms.includes("telegram") ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* Discord Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "#5865F2", color: "#fff", padding: "8px", borderRadius: "8px" }}>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: "500" }}>Discord Gateway</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>WebSocket message handler</div>
                </div>
              </div>
              <button
                onClick={() => handlePlatformToggle("discord")}
                style={{
                  background: stats.active_platforms.includes("discord") ? "#4f46e5" : "#1e293b",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {stats.active_platforms.includes("discord") ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* Gmail Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "#EA4335", color: "#fff", padding: "8px", borderRadius: "8px" }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: "500" }}>Gmail Dispatcher</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Google Pub/Sub push listener</div>
                </div>
              </div>
              <button
                onClick={() => handlePlatformToggle("gmail")}
                style={{
                  background: stats.active_platforms.includes("gmail") ? "#4f46e5" : "#1e293b",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {stats.active_platforms.includes("gmail") ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Personality Config panel */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={18} color="#a855f7" />
            Clone Personality Configuration
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Formality Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>Formality Dial:</span>
                <span style={{ fontSize: "0.9rem", color: "#a855f7", fontWeight: "600" }}>
                  {config.formality_level === 1
                    ? "1 (Very Casual)"
                    : config.formality_level === 3
                    ? "3 (Balanced)"
                    : config.formality_level === 5
                    ? "5 (Professional)"
                    : config.formality_level}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={config.formality_level}
                onChange={(e) => handleConfigChange("formality_level", e.target.value)}
                style={{ width: "100%", accentColor: "#a855f7", cursor: "pointer" }}
              />
            </div>

            {/* Delay config */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px" }}>
                  Min Delay (sec)
                </label>
                <input
                  type="number"
                  className="glass-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                  value={config.reply_delay_min}
                  onChange={(e) => handleConfigChange("reply_delay_min", e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px" }}>
                  Max Delay (sec)
                </label>
                <input
                  type="number"
                  className="glass-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                  value={config.reply_delay_max}
                  onChange={(e) => handleConfigChange("reply_delay_max", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h2 style={{ margin: "0 0 20px 0", fontSize: "1.25rem", fontWeight: "600" }}>
          Live Autopilot Activity
        </h2>

        {activities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
            No recent transaction events. Start sending messages to your bots!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {activities.map((act) => (
              <div
                key={act.id}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  paddingBottom: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        background:
                          act.platform === "telegram"
                            ? "#229ED9"
                            : act.platform === "discord"
                            ? "#5865F2"
                            : "#EA4335",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {act.platform}
                    </span>
                    <span style={{ fontWeight: "500", fontSize: "0.9rem" }}>{act.sender}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{act.timestamp}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.015)", padding: "10px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>
                      User Query
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>{act.query}</div>
                  </div>

                  <div style={{ background: "rgba(99, 102, 241, 0.03)", padding: "10px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.7rem", color: "#818cf8", textTransform: "uppercase", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                      <span>Autopilot Reply</span>
                      {act.verified && (
                        <span style={{ color: "#34d399", display: "flex", alignItems: "center", gap: "2px" }}>
                          <CheckCircle size={10} /> Verified Fact
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontStyle: "italic", whiteSpace: "pre-line" }}>
                      "{act.reply}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
