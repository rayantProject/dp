from PIL import Image, ImageDraw, ImageFilter


class HandleImage:
    @staticmethod
    def apply_circular_blur(image: Image.Image, box):
        """
        Applique un flou circulaire sur un visage.
        """
        x1, y1, x2, y2 = map(int, box)
        face_region = image.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(15))

        mask = Image.new("L", (x2 - x1, y2 - y1), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, x2 - x1, y2 - y1), fill=255)

        blurred_face = Image.new("RGB", (x2 - x1, y2 - y1))
        blurred_face.paste(face_region, (0, 0), mask)

        image.paste(blurred_face, (x1, y1), mask)

    @staticmethod
    def apply_rectangular_blur(image: Image.Image, box):
        """
        Applique un flou rectangulaire sur une plaque d'immatriculation.
        """
        x1, y1, x2, y2 = map(int, box)
        plate_region = image.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(15))
        image.paste(plate_region, (x1, y1))

    @staticmethod
    def process_image(image: Image.Image, face_results, plate_results):
        """
        - Applique un flou circulaire sur les visages détectés.
        - Applique un flou rectangulaire sur les plaques détectées.
        """
        for detection in face_results:
            for box in detection.boxes.xyxy:
                HandleImage.apply_circular_blur(image, box)

        for detection in plate_results:
            for box in detection.boxes.xyxy:
                HandleImage.apply_rectangular_blur(image, box)

        return image
