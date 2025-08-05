from ultralytics import YOLO
import os
from PIL import Image


class HandleModel:
    def __init__(self, modelpath, task="detect"):
        if not os.path.exists(modelpath):
            raise FileNotFoundError(f"Le fichier modèle '{modelpath}' n'existe pas.")
        self.model = YOLO(modelpath, task=task)

    def predict(self, image: Image.Image):
        """
        Exécute la prédiction sur une image PIL.
        """
        return self.model.predict(image)  # Utiliser l'image directement
