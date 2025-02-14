import logging
import os
from flask import Flask, render_template, request, jsonify
from youtube_extractor import get_video_thumbnails

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract', methods=['POST'])
def extract_thumbnails():
    try:
        url = request.form.get('url')
        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        thumbnails = get_video_thumbnails(url)
        return jsonify({'thumbnails': thumbnails})
    except Exception as e:
        logging.error(f"Error processing URL: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
