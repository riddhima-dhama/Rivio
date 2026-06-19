from flask import Flask
from flask_cors import CORS
from database import create_tables

app = Flask(__name__)
CORS(app)
create_tables()

@app.route("/")
def home():
    return {
        "message": "Rivio API Running 🚀"
    }

if __name__ == "__main__":
    app.run(debug=True)