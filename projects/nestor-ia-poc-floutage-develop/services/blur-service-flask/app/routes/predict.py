from flask import Blueprint, request, send_file, jsonify
from PIL import Image
import io
from app.services.model_service import predict_faces, predict_plates
from app.services.image_service import HandleImage

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "Aucune image fournie"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "Nom de fichier vide"}), 400

        image = Image.open(file.stream).convert("RGB")

        face_results = predict_faces(image)
        plate_results = predict_plates(image)

        processed_image = HandleImage.process_image(image, face_results, plate_results)

        img_io = io.BytesIO()
        processed_image.save(img_io, "JPEG")
        img_io.seek(0)

        return send_file(img_io, mimetype="image/jpeg")

    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({"error": str(e)}), 500
