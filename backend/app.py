from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, os

# Path to models folder
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# Load TF-IDF vectorizer
tfidf = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))

# Labels and corresponding model filenames
labels = ["toxic","severe_toxic","obscene","threat","insult","identity_hate"]
model_files = {
    "toxic": "toxic_model.pkl",
    "severe_toxic": "severe_toxic_model.pkl",
    "obscene": "obscene_model.pkl",
    "threat": "threat_model.pkl",
    "insult": "insult_model.pkl",
    "identity_hate": "identity_hate_model.pkl"
}

# Load models
models = {label: joblib.load(os.path.join(MODELS_DIR, fname)) for label, fname in model_files.items()}

# Flask app setup
app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    comment = data.get("comment", "")
    X = tfidf.transform([comment])

    result = {}
    for label in labels:
        clf = models[label]
        y = int(clf.predict(X)[0])
        proba = None
        if hasattr(clf, "predict_proba"):
            proba = float(clf.predict_proba(X)[0][1])
        result[label] = {"label": y, "proba": proba}
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
