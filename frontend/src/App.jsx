import { useState } from "react";
import "./App.css";

function App() {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment })
    });
    const data = await response.json();
    setResult(data);

    const toxicLabels = Object.entries(data)
    .filter(([label, val]) => val.label === 1)
    .map(([label, val]) => label);

    if (toxicLabels.length > 0) {
      alert(`⚠️ You can not post inappropriate comments. \n Your comment is ${toxicLabels.join(", ")}`);
    }
  };

  return (
     <div className="container">
      <div className="card">
        <h1>Toxic Comment Classifier</h1>
        <textarea
          placeholder="Enter a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handlePredict}>Predict</button>

        {result && (
          <div className="result">
            {Object.entries(result).map(([label, val]) => (
              <span
                key={label}
                className={val.label === 1 ? "label toxic" : "label safe"}
              >
                {label}: {val.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;