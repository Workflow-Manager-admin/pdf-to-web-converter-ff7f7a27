import React, { useRef, useState } from "react";
import "./App.css";

// Color palette from project requirements
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ff9800",
  bg: "#ffffff",
  bgSoft: "#f5f6fa",
  text: "#333333",
  border: "#e0e0e0",
};

// PUBLIC_INTERFACE
function App() {
  // UI state
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const uploadRef = useRef();

  // PUBLIC_INTERFACE
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setShowResult(false);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  // PUBLIC_INTERFACE
  const handleFileChange = (event) => {
    setError("");
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setShowResult(false);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  // PUBLIC_INTERFACE
  const handleUploadClick = () => {
    uploadRef.current.click();
  };

  // PUBLIC_INTERFACE
  const handleConvert = () => {
    if (!file) {
      setError("No PDF file selected.");
      return;
    }
    // Reset results
    setShowResult(false);
    setError("");
    setHtml("");
    setCss("");
    setConverting(true);
    setProgress(0);

    // Mock progress and conversion result
    let prog = 0;
    const progressInterval = setInterval(() => {
      prog += 8 + Math.random() * 20;
      if (prog >= 100) {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          setConverting(false);
          setShowResult(true);
          // These are mocked HTML/CSS—you'd replace with real output:
          setHtml(`<div class="welcome-guide">
  <h1>Start with KAVIA AI</h1>
  <p>This is a demo. Replace this with converted HTML from your PDF.</p>
  <ul>
    <li>Fast conversion to web-ready format</li>
    <li>Modern, reusable components</li>
    <li>Easy to copy and edit</li>
  </ul>
</div>`);
          setCss(`.welcome-guide {
  font-family: 'Segoe UI', Arial, sans-serif;
  max-width: 650px;
  margin: auto;
  background: #fffbe9;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(255, 152, 0, 0.08);
}
.welcome-guide h1 {
  color: #1976d2;
  font-size: 2.1rem;
  margin-bottom: 0.7rem;
}
.welcome-guide ul li {
  color: #424242;
  font-size: 1.1rem;
  margin-bottom: 0.35rem;
}
.welcome-guide p {
  color: #ff9800;
  font-weight: bold;
  margin: 1rem 0;
}`);
        }, 600);
      } else {
        setProgress(Math.round(prog));
      }
    }, 160);
  };

  // PUBLIC_INTERFACE
  const handleCopy = (type) => {
    if (type === "html" && html) {
      navigator.clipboard.writeText(html);
    }
    if (type === "css" && css) {
      navigator.clipboard.writeText(css);
    }
  };

  // PUBLIC_INTERFACE
  const handleDownload = (type) => {
    const blob =
      type === "html"
        ? new Blob([html], { type: "text/html" })
        : new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "html" ? "converted.html" : "converted.css";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 400);
  };

  // PUBLIC_INTERFACE
  const handleSampleDemo = () => {
    setFileName("Start with KAVIA AI.pdf");
    setFile({ name: "Start with KAVIA AI.pdf" });
    setError("");
    setShowResult(false);
    handleConvert();
  };

  return (
    <div className="pdf-app" style={{ background: COLORS.bg }}>
      <header className="pdf-header" style={{ borderBottom: `1.5px solid ${COLORS.border}`, background: COLORS.bg }}>
        <span className="pdf-logo" style={{ color: COLORS.primary, fontWeight: 700 }}>
          PDF<span style={{ color: COLORS.accent, fontWeight: 800 }}>→</span>Web Converter
        </span>
      </header>
      <main className="pdf-main">
        <section>
          <div
            className="pdf-upload-area"
            style={{
              border: `2.2px dashed ${COLORS.primary}`,
              background: COLORS.bgSoft,
            }}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={handleUploadClick}
            tabIndex={0}
            role="button"
            aria-label="Upload PDF by selecting file or drag-and-drop"
          >
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              ref={uploadRef}
              onChange={handleFileChange}
              data-testid="file-input"
            />
            {fileName ? (
              <div className="file-selected">
                <span className="file-icon" role="img" aria-label="PDF">📄</span>
                <strong>{fileName}</strong>
              </div>
            ) : (
              <div>
                <span className="upload-icon" role="img" aria-label="Upload">⬆️</span>
                <span>Drag & drop PDF here or <span className="pdf-link" style={{ color: COLORS.primary, textDecoration: "underline" }}>browse file</span></span>
              </div>
            )}
          </div>
          <div className="pdf-upload-actions">
            <button
              className="pdf-btn"
              onClick={handleConvert}
              disabled={converting || !fileName}
              style={{
                background: COLORS.primary,
                color: "#fff",
                marginRight: "1rem"
              }}
            >
              {converting ? "Converting..." : "Convert PDF"}
            </button>
            <button
              className="pdf-btn pdf-btn-secondary"
              style={{ background: COLORS.accent, color: "#fff" }}
              onClick={handleSampleDemo}
              disabled={converting}
              title="Use sample PDF"
            >
              Try Sample PDF
            </button>
          </div>
          {error && (
            <div className="pdf-error" data-testid="error-notification">
              <span style={{ color: "red", marginRight: 8 }}>⚠️</span>
              {error}
            </div>
          )}
          {converting && (
            <div className="pdf-progress">
              <div className="pdf-spinner" style={{ borderTop: `4px solid ${COLORS.accent}` }}></div>
              <span>
                Converting: <span style={{ color: COLORS.primary, fontWeight: 600 }}>{progress}%</span>
              </span>
            </div>
          )}
        </section>
        <section>
          {showResult && (
            <div className="pdf-results">
              <h2 style={{ color: COLORS.primary, marginBottom: 16 }}>
                <span role="img" aria-label="Success">✅</span> HTML / CSS Output
              </h2>
              <div className="pdf-result-block">
                <div className="pdf-block-header">
                  <span>HTML</span>
                  <div>
                    <button className="copy-btn" title="Copy HTML" onClick={() => handleCopy("html")}>Copy</button>
                    <button className="copy-btn" title="Download HTML" onClick={() => handleDownload("html")}>Download</button>
                  </div>
                </div>
                <pre className="pdf-code-block">{html}</pre>
              </div>
              <div className="pdf-result-block">
                <div className="pdf-block-header">
                  <span>CSS</span>
                  <div>
                    <button className="copy-btn" title="Copy CSS" onClick={() => handleCopy("css")}>Copy</button>
                    <button className="copy-btn" title="Download CSS" onClick={() => handleDownload("css")}>Download</button>
                  </div>
                </div>
                <pre className="pdf-code-block">{css}</pre>
              </div>
              <div style={{marginTop:"2rem"}}>
                <small style={{color: COLORS.secondary}}>Note: This is a mocked conversion result. Integrate your backend to get real output.</small>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className="pdf-footer">
        <span>
          &copy; {new Date().getFullYear()} PDF→Web Converter. Powered by <a href="https://kavia.ai" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.primary, fontWeight: 500, textDecoration: "underline" }}>KAVIA AI</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
