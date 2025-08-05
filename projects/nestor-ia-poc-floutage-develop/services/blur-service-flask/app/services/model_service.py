from app.models.handle_model import HandleModel
from app.config import Config

face_model = HandleModel(Config.FACE_MODEL_PATH, Config.FACE_MODEL_TASK)
plate_model = HandleModel(Config.PLATE_MODEL_PATH, Config.PLATE_MODEL_TASK)


def predict_faces(image):
    return face_model.predict(image)


def predict_plates(image):
    return plate_model.predict(image)
