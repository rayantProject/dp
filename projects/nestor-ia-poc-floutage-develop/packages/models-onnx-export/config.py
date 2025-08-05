import json
from pathlib import Path

BASE_DIR = (Path(__file__).resolve().parent / "../../").resolve()
CONFIG_PATH = BASE_DIR / "nestor-ai-config.json"

try:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config_data = json.load(f)
except FileNotFoundError:
    raise FileNotFoundError(f"Fichier de configuration introuvable : {CONFIG_PATH}")
except json.JSONDecodeError:
    raise ValueError(f"Erreur de parsing JSON dans le fichier : {CONFIG_PATH}")

MODEL_DIR = (BASE_DIR / config_data["models"]["path"]).resolve()
OUTPUT_DIR = (BASE_DIR / config_data["modelsOnnxExport"]["output"]).resolve()
EXPORT_FORMAT = config_data["modelsOnnxExport"].get("format", "onnx")


class Config:
    FACE_MODEL_PATH = (MODEL_DIR / config_data["models"]["FaceModel"]).resolve()
    PLATE_MODEL_PATH = (MODEL_DIR / config_data["models"]["PlateModel"]).resolve()
    MODEL_OUTPUT_PATH = OUTPUT_DIR
    EXPORT_FORMAT = EXPORT_FORMAT
