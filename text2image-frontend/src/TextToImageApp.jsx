import React, { useState, useEffect } from "react";

export default function TextToImageApp() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [stats, setStats] = useState(null);

  const templatePrompts = [
    "A futuristic cityscape at night",
    "A cat wearing sunglasses and drinking coffee",
    "A scenic mountain landscape with sunrise",
    "A robot painting on a canvas",
    "An astronaut riding a horse on Mars"
  ];

  useEffect(() => {
    fetch("/generate/history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPromptHistory(data.map((item) => item.prompt));
        }
      })
      .catch((err) => {
        console.error("Failed to load prompt history:", err);
      });

    fetch("/generate/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
      });
  }, []);

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear history?")) return;
    try {
      const res = await fetch("/generate/clear", { method: "POST" });
      if (res.ok) {
        setPromptHistory([]);
        alert("History cleared.");
      } else {
        alert("Failed to clear history.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while clearing history.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const generateImage = async (customPrompt = null) => {
    const usedPrompt = customPrompt ?? prompt;
    if (!usedPrompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }
    setStatus("");
    setImageUrl(null);
    setIsLoading(true);
    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: usedPrompt })
      });
      const data = await res.json();
      setIsLoading(false);
      if (res.ok && data.image_url) {
        setImageUrl(data.image_url);
        setStatus("Prompt: " + data.prompt);
        setPrompt(usedPrompt);
        setPromptHistory((prev) => {
          const clean = prev.filter((p) => p !== usedPrompt);
          return [usedPrompt, ...clean].slice(0, 10);
        });
      } else {
        const message = data?.error || "Unknown error.";
        alert("Image generation failed:\n" + message);
        setStatus("Failed to generate image.");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert("Network error:\n" + err.message);
      setStatus("Error contacting the server.");
    }
  };

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f0f0f" : "#f9fafb";
  const textColor = isDark ? "#e5e5e5" : "#1f2937";
  const inputBg = isDark ? "#1f1f1f" : "#fff";
  const inputBorder = isDark ? "#333" : "#ccc";
  const shadow = isDark ? "0 0 10px #111" : "0 0 10px #ccc";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor, display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", transition: "all 0.3s ease", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ alignSelf: "flex-end" }}>
        <button onClick={toggleTheme} style={{ background: "none", border: "1px solid", borderColor: inputBorder, borderRadius: "6px", padding: "0.25rem 0.75rem", cursor: "pointer", color: textColor }}>
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={{ backgroundColor: isDark ? "#1c1c1e" : "#ffffff", boxShadow: shadow, borderRadius: "1rem", padding: "2rem", marginTop: "2rem", width: "100%", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", textAlign: "center" }}>
          Text-to-Image Generator
        </h1>

        <select value="" onChange={(e) => { if (e.target.value) { setPrompt(e.target.value); generateImage(e.target.value); } }} style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "6px", border: `1px solid ${inputBorder}`, backgroundColor: inputBg, color: textColor, width: "100%" }}>
          <option value="">🎨 Select a template...</option>
          {templatePrompts.map((tp, idx) => (
            <option key={idx} value={tp}>{tp}</option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt..." style={{ backgroundColor: inputBg, color: textColor, border: `1px solid ${inputBorder}`, borderRadius: "6px", padding: "0.5rem 1rem", flex: 1, transition: "all 0.3s ease" }} />
          <button onClick={() => generateImage()} disabled={isLoading} style={{ backgroundColor: isLoading ? "#444" : "#10b981", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.3s ease" }}>
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>

        <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>{status}</p>

        {imageUrl && (
          <>
            <img src={imageUrl} alt="Generated" style={{ width: "100%", maxWidth: "100%", borderRadius: "0.75rem", marginBottom: "1rem", border: `2px solid ${inputBorder}` }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => {
                const link = document.createElement("a");
                link.href = imageUrl;
                link.download = "generated_image.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }} style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", marginBottom: "1rem" }}>
                ⬇️ Download Image
              </button>
              <button onClick={() => window.open("/image/download-all", "_blank")} style={{ backgroundColor: "#f59e0b", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", marginBottom: "1rem" }}>
                🗂️ Download All
              </button>
            </div>
          </>
        )}

        {promptHistory.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ margin: 0 }}>📜 Prompt History:</h3>
              <button onClick={clearHistory} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "6px", padding: "0.25rem 0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                🗑️ Clear
              </button>
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {promptHistory.map((item, index) => (
                <li key={index}>
                  <button onClick={() => generateImage(item)} style={{ background: "none", border: "none", padding: "0.25rem 0", textAlign: "left", width: "100%", cursor: "pointer", color: isDark ? "#22d3ee" : "#2563eb", textDecoration: "underline" }}>
                    • {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {stats && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>📈 Generation Stats</h3>
            <p><strong>Total:</strong> {stats.total}</p>
            <p><strong>Top Prompts:</strong></p>
            <ul>
              {stats.top_prompts.map((item, idx) => (
                <li key={idx}>{item.prompt} ({item.count})</li>
              ))}
            </ul>
            <p><strong>Recent:</strong></p>
            <ul>
              {stats.recent.map((item, idx) => (
                <li key={idx}>{item.prompt} — {item.timestamp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
