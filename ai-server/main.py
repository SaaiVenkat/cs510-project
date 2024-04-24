from flask import Flask
from routes import routes_bp

app = Flask(__name__)

# Register the routes blueprint with the app
app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
