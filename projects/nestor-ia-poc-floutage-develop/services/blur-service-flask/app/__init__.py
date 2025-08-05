from flask import Flask
from flask_cors import CORS
from app.config import Config


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    from app.routes.predict import predict_bp

    app.register_blueprint(predict_bp, url_prefix="/predict")

    return app
