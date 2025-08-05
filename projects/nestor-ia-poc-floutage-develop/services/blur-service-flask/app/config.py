import json
from pathlib import Path

# Remonter à la racine du projet
BASE_DIR = (Path(__file__).resolve().parent / "../../../").resolve()
CONFIG_PATH = BASE_DIR / "nestor-ai-config.json"

# Charger le fichier JSON
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    config_data = json.load(f)

# Déterminer le dossier contenant les modèles
MODEL_BASE_DIR = (BASE_DIR / config_data["models"]["path"]).resolve()


class Config:
    FACE_MODEL_PATH = (MODEL_BASE_DIR / config_data["models"]["FaceModel"]).resolve()
    PLATE_MODEL_PATH = (MODEL_BASE_DIR / config_data["models"]["PlateModel"]).resolve()
    FACE_MODEL_TASK = config_data["models"]["tasks"]["FaceModel"]
    PLATE_MODEL_TASK = config_data["models"]["tasks"]["PlateModel"]
    BLUR_SERVICE_PORT = config_data["blurServiceFlask"]["port"]
