using Microsoft.AspNetCore.Mvc;
using YoloDotNet;
using YoloDotNet.Enums;
using YoloDotNet.Models;
using YoloDotNet.Extensions;
using SkiaSharp;

[Route("[controller]")]
[ApiController]
public class DetectController : ControllerBase
{
    private readonly Yolo _yolo_face;
    private readonly Yolo _yolo_plate;

    public DetectController()
    {
        // Affichage des chemins des modèles dans la console
        Console.WriteLine($"[Config] Face model: {Config.FaceModelPath}");
        Console.WriteLine($"[Config] Plate model: {Config.PlateModelPath}");

        // Initialisation du modèle de détection de visages
        _yolo_face = new Yolo(new YoloOptions
        {
            OnnxModel = Config.FaceModelPath,
            ModelType = ModelType.ObjectDetection,
            Cuda = false
        });

        // Initialisation du modèle de détection de plaques
        _yolo_plate = new Yolo(new YoloOptions
        {
            OnnxModel = Config.PlateModelPath,
            ModelType = ModelType.ObjectDetection,
            Cuda = false
        });
    }

    [HttpPost(Name = "detect")]
    public async Task<IActionResult> Predict([FromForm] IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest("No file uploaded");

        // Lecture de l'image uploadée
        await using var memoryStream = new MemoryStream();
        await image.CopyToAsync(memoryStream);
        memoryStream.Position = 0;
        using var originalImage = SKImage.FromEncodedData(memoryStream);

        // Exécution des détections sur l'image
        var faceResults = _yolo_face.RunObjectDetection(originalImage, confidence: Config.FaceConfidence, iou: Config.FaceIOU);
        var plateResults = _yolo_plate.RunObjectDetection(originalImage, confidence: Config.PlateConfidence, iou: Config.PlateIOU);

        // Combinaison des résultats
        var combinedResults = faceResults.Concat(plateResults).ToList();

        // Annotation de l'image via l'extension Draw
        using var resultImage = originalImage.Draw(combinedResults);

        // Encodage de l'image annotée en mémoire
        await using var outputStream = new MemoryStream();
        resultImage.Encode(Config.ImageFormat, Config.ImageQuality).SaveTo(outputStream);
        outputStream.Position = 0;

        // Détermination du type MIME selon le format choisi
        var mimeType = Config.ImageFormat switch
        {
            SKEncodedImageFormat.Jpeg => "image/jpeg",
            SKEncodedImageFormat.Png => "image/png",
            SKEncodedImageFormat.Webp => "image/webp",
            _ => "application/octet-stream"
        };

        return File(outputStream.ToArray(), mimeType);
    }
}
