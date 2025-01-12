from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import os, json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from flask_sqlalchemy import SQLAlchemy

load_dotenv(dotenv_path="config.env")
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
app = Flask(__name__)
CORS(app)

TRANSCRIPT_FOLDER = "./transcripts"

os.makedirs(TRANSCRIPT_FOLDER, exist_ok=True)
current_video_id = None
database_uri = os.getenv("DB_URI")
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class DataEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(100), nullable=False)

    def __init__(self, value):
        self.value = value
with app.app_context():
    db.create_all()
@app.route('/add_data', methods=['POST'])
def add_data():
    try:
        data = request.json 
        value = data.get('value')

        if value:
            new_entry = DataEntry(value=value)
            db.session.add(new_entry)
            db.session.commit()
            return jsonify({"message": "Data added successfully!"}), 200
        else:
            return jsonify({"message": "No value provided!"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_video_details(video_id):
    url = f'https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={YOUTUBE_API_KEY}'
    response = requests.get(url)
    video_data = response.json()

    if "items" not in video_data or len(video_data["items"]) == 0:
        return None

    video = video_data["items"][0]["snippet"]
    return {
        "id": video_id,
        "title": video["title"],
        "description": video["description"],
        "url": f"https://www.youtube.com/watch?v={video_id}"
    }

@app.route('/fetch_video', methods=['POST'])
def fetch_video():
    data = request.get_json()
    video_id = data.get('videoId')

    if not video_id:
        return jsonify({"error": "No video ID provided"}), 400

    video_details = get_video_details(video_id)

    if not video_details:
        return jsonify({"error": "Video not found"}), 404

    return jsonify(video_details)

def get_playlist_details(playlist_id):
    url = f'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&maxResults=50&key={YOUTUBE_API_KEY}'
    response = requests.get(url)
    playlist_data = response.json()

    if "items" not in playlist_data or len(playlist_data["items"]) == 0:
        return None

    videos = []
    for item in playlist_data["items"]:
        snippet = item["snippet"]
        videos.append({
            "id": snippet["resourceId"]["videoId"],
            "title": snippet["title"],
            "thumbnail": snippet["thumbnails"]["default"]["url"]
        })

    return videos

@app.route('/fetch_playlist', methods=['POST'])
def fetch_playlist():
    data = request.get_json()
    playlist_id = data.get('playlistId')

    if not playlist_id:
        return jsonify({"error": "No playlist ID provided"}), 400

    playlist_details = get_playlist_details(playlist_id)

    if not playlist_details:
        return jsonify({"error": "Playlist not found"}), 404

    return jsonify({"videos": playlist_details})

def format_time(seconds):
    minutes = int(seconds // 60)
    remaining_seconds = int(seconds % 60)
    return f"{minutes}:{remaining_seconds:02}"

def format_transcript(transcript):
    formatted_text = ''
    
    for i in range(len(transcript)):
        current = transcript[i]
        start_formatted = format_time(current["start"])  
        formatted_text += f"{start_formatted} {current['text']},"
    return formatted_text

def fetch_and_store_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'en-GB', 'en-IN'])
        transcript= format_transcript(transcript)
        return transcript  
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return None
        

def get_video_title(video_id):
    try:
        url = f"https://www.youtube.com/watch?v={video_id}"
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features="lxml")
        link = soup.find_all(name="title")[0]
        return link.text
    except Exception as e:
        print(f"Error: {e}")
        return None
    
def summarize_transcript(transcript: str):
    if len(transcript.split()) > 5000:
        chunks = [transcript[i:i+1000] for i in range(100, len(transcript), 1000)]
        summarized_chunks = chunks[0:5]
        return " ".join(summarized_chunks)
    return transcript

@app.route('/answer_query', methods=['GET'])
def answer_query():
    query = request.args.get('query')
    video_id = request.args.get('video_id')
    llm = ChatGroq(model="llama3-70b-8192",temperature=0)
    transcript = fetch_and_store_transcript(video_id)
    if transcript is not None:
        transcript = summarize_transcript(transcript)
    title = get_video_title(video_id)
    system = "You are a helpful assistant which takes in input a youtube video title, its transcript(with time stamps) & a query from the user. Take help from the transcript and answer the query accurately. If the transcript is not available take help from title."
    human = "{text}"
    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm
    ans = chain.invoke({"text":f"Title:{title}\nTranscript:{transcript}\nQuery:{query}"})
    return {"content": ans.content}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
