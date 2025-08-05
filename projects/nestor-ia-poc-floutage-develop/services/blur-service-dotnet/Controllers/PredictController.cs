using Microsoft.AspNetCore.Mvc;
using YoloDotNet;
using YoloDotNet.Enums;
using YoloDotNet.Models;
using SkiaSharp;
using System.Text.Json;

[Route("[controller]")]
[ApiController]
public class PredictController : ControllerBase
{
    private readonly Yolo _yolo_face;
    private readonly Yolo _yolo_plate;

    public PredictController()
    {
        Console.WriteLine($"[Config] Face model: {Config.FaceModelPath}");
        Console.WriteLine($"[Config] Plate model: {Config.PlateModelPath}");

        _yolo_face = new Yolo(new YoloOptions
        {
            OnnxModel = Config.FaceModelPath,
            ModelType = ModelType.ObjectDetection,
            Cuda = false
        });

        _yolo_plate = new Yolo(new YoloOptions
        {
            OnnxModel = Config.PlateModelPath,
            ModelType = ModelType.ObjectDetection,
            Cuda = false
        });
    }

    [HttpPost(Name = "predict")]
    public async Task<IActionResult> Predict([FromForm] IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest("No file uploaded");

        await using var memoryStream = new MemoryStream();
        await image.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        using var originalImage = SKImage.FromEncodedData(memoryStream);
        using var surface = SKSurface.Create(new SKImageInfo(originalImage.Width, originalImage.Height));
        var canvas = surface.Canvas;

        // Dessiner l'image originale
        canvas.DrawImage(originalImage, 0, 0);

        // Détection des visages et application du flou adapté
        var faceResults = _yolo_face.RunObjectDetection(originalImage, confidence: Config.FaceConfidence, iou: Config.FaceIOU);
        foreach (var result in faceResults)
        {
            BlurRegion(canvas, originalImage, result.BoundingBox);
        }

        // Détection des plaques et application du flou adapté
        var plateResults = _yolo_plate.RunObjectDetection(originalImage, confidence: Config.PlateConfidence, iou: Config.PlateIOU);
        foreach (var result in plateResults)
        {
            BlurRegion(canvas, originalImage, result.BoundingBox);
        }

        using var resultImage = surface.Snapshot();
        await using var outputStream = new MemoryStream();
        resultImage.Encode(Config.ImageFormat, Config.ImageQuality).SaveTo(outputStream);
        outputStream.Position = 0;

        var mimeType = Config.ImageFormat switch
        {
            SKEncodedImageFormat.Jpeg => "image/jpeg",
            SKEncodedImageFormat.Png => "image/png",
            SKEncodedImageFormat.Webp => "image/webp",
            _ => "application/octet-stream"
        };

        return File(outputStream.ToArray(), mimeType);
    }

    /// <summary>
    /// Applique un filtre de flou sur une zone donnée en ajustant l'intensité du flou en fonction de la couleur moyenne et des paramètres configurables.
    /// </summary>
    /// <param name="canvas">Le canvas où l'image est dessinée.</param>
    /// <param name="image">L'image d'origine.</param>
    /// <param name="rect">La zone (bounding box) à flouter.</param>
    private void BlurRegion(SKCanvas canvas, SKImage image, SKRectI rect)
    {
        // Calculer la couleur moyenne dans la zone
        SKColor avgColor = ComputeAverageColor(image, rect);
        // Calculer la luminosité (valeur entre 0 et 1)
        float brightness = ComputeBrightness(avgColor);
        // Ajuster l'intensité du flou via les paramètres configurés
        float sigma = Config.BlurBaseSigma + brightness * Config.BlurBrightnessFactor;

        // Sauvegarder l'état du canvas et définir un clip sur la zone à flouter
        canvas.Save();
        canvas.ClipRect(new SKRect(rect.Left, rect.Top, rect.Right, rect.Bottom));

        using var paint = new SKPaint
        {
            ImageFilter = SKImageFilter.CreateBlur(sigma, sigma)
        };

        // Redessiner la zone avec le filtre de flou
        canvas.DrawImage(image, 0, 0, paint);
        canvas.Restore();
    }

    /// <summary>
    /// Calcule la couleur moyenne d'une zone donnée de l'image.
    /// </summary>
    /// <param name="image">L'image source.</param>
    /// <param name="rect">La région à analyser.</param>
    /// <returns>La couleur moyenne en SKColor.</returns>
    private SKColor ComputeAverageColor(SKImage image, SKRectI rect)
    {
        using var regionBitmap = new SKBitmap(rect.Width, rect.Height);
        bool success = image.ReadPixels(new SKImageInfo(rect.Width, rect.Height), regionBitmap.GetPixels(), regionBitmap.RowBytes, rect.Left, rect.Top);
        if (!success)
            return SKColors.Transparent;

        long sumR = 0, sumG = 0, sumB = 0;
        int count = rect.Width * rect.Height;
        for (int y = 0; y < rect.Height; y++)
        {
            for (int x = 0; x < rect.Width; x++)
            {
                SKColor pixel = regionBitmap.GetPixel(x, y);
                sumR += pixel.Red;
                sumG += pixel.Green;
                sumB += pixel.Blue;
            }
        }
        byte avgR = (byte)(sumR / count);
        byte avgG = (byte)(sumG / count);
        byte avgB = (byte)(sumB / count);
        return new SKColor(avgR, avgG, avgB);
    }

    /// <summary>
    /// Calcule la luminosité d'une couleur selon la formule de luminance relative.
    /// </summary>
    /// <param name="color">La couleur à analyser.</param>
    /// <returns>Une valeur entre 0 (sombre) et 1 (clair).</returns>
    private float ComputeBrightness(SKColor color)
    {
        return (0.299f * color.Red + 0.587f * color.Green + 0.114f * color.Blue) / 255f;
    }
}
