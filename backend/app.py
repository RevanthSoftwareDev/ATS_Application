from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import docx
import re

app = Flask(__name__)
CORS(app)  # allow React frontend to connect

# ---------- Helper: Extract text from resume ----------
def extract_text_from_resume(file):
    text = ""
    if file.filename.endswith('.pdf'):
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() or ""
    elif file.filename.endswith('.docx'):
        doc = docx.Document(file)
        for para in doc.paragraphs:
            text += para.text + " "
    else:
        return None
    return text

# ---------- Helper: Extract keywords ----------
def extract_keywords(text):
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    return list(set(words))

# ---------- Route ----------
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    jd = request.form.get('jobDescription')
    resume_file = request.files.get('resume')

    if not jd or not resume_file:
        return jsonify({'error': 'Missing JD or resume'}), 400

    jd_keywords = extract_keywords(jd)
    resume_text = extract_text_from_resume(resume_file)
    resume_keywords = extract_keywords(resume_text)

    matched = [word for word in resume_keywords if word in jd_keywords]
    match_score = round(len(matched) / len(jd_keywords) * 100, 2) if jd_keywords else 0

    return jsonify({
        'score': match_score,
        'matched': matched,
        'missing': list(set(jd_keywords) - set(matched))
    })

if __name__ == '__main__':
    app.run(debug=True)
