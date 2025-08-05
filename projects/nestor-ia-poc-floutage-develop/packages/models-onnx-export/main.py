from ultralytics import YOLO
from config import Config
from pathlib import Path


def check_model_file(path: Path, name: str):
    if not path.exists():
        raise FileNotFoundError(f"{name} introuvable à l'emplacement : {path}")


def export_model(model_path: Path, name: str):
    print(f"[INFO] Chargement du modèle {name} depuis {model_path}")
    model = YOLO(model_path)

    print(
        f"[INFO] Export de {name} au format {Config.EXPORT_FORMAT} vers {Config.MODEL_OUTPUT_PATH}"
    )
    model.export(format=Config.EXPORT_FORMAT, project=Config.MODEL_OUTPUT_PATH)
    print(f"[OK] Export terminé pour {name}\n")


if __name__ == "__main__":
    check_model_file(Config.FACE_MODEL_PATH, "FaceModel")
    check_model_file(Config.PLATE_MODEL_PATH, "PlateModel")

    export_model(Config.FACE_MODEL_PATH, "FaceModel")
    export_model(Config.PLATE_MODEL_PATH, "PlateModel")
