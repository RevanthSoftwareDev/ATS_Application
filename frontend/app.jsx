import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription || !resume) {
      alert("Please enter JD and upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resume);

    const res = await axios.post("http://127.0.0.1:5000/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setResult(res.data);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", textAlign: "center" }}>
      <h2>ATS Resume Matcher</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setResume(e.target.files[0])}
        />
        <br /><br />
        <button type="submit">Analyze</button>
      </form>

      {result && (
        <div style={{ marginTop: "30px", textAlign: "left" }}>
          <h3>Match Score: {result.score}%</h3>
          <p><strong>Matched Skills:</strong> {result.matched.join(", ")}</p>
          <p><strong>Missing Skills:</strong> {result.missing.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
