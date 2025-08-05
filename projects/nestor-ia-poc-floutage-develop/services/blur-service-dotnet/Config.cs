using System.Text.Json;
using SkiaSharp;

public static class Config
{
    public static string FaceModelPath { get; private set; } = string.Empty;
    public static string PlateModelPath { get; private set; } = string.Empty;
    public static double FaceConfidence { get; private set; }
    public static double FaceIOU { get; private set; }
    public static double PlateConfidence { get; private set; }
    public static double PlateIOU { get; private set; }
    public static int ImageQuality { get; private set; }
    public static byte BlurOpacity { get; private set; }
    public static SKEncodedImageFormat ImageFormat { get; private set; }

    // Nouvelles variables pour la configuration du flou
    public static float BlurBaseSigma { get; private set; }
    public static float BlurBrightnessFactor { get; private set; }

    static Config()
    {
        //string basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../.."));
        string basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), ""));
        string configPath = Path.Combine(basePath, "nestor-ai-config.json");

        if (!File.Exists(configPath))
            throw new FileNotFoundException($"Fichier de config introuvable : {configPath}");

        string configJson = File.ReadAllText(configPath);
        var rootConfig = JsonSerializer.Deserialize<RootConfig>(configJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (rootConfig == null || rootConfig.Models == null || rootConfig.BlurServiceDotnet == null)
            throw new Exception("Fichier de config invalide ou incomplet.");

        string modelsDirectory = Path.Combine(basePath, rootConfig.Models.Path);

        FaceModelPath = Path.ChangeExtension(Path.Combine(modelsDirectory, rootConfig.Models.FaceModel), ".onnx");
        PlateModelPath = Path.ChangeExtension(Path.Combine(modelsDirectory, rootConfig.Models.PlateModel), ".onnx");

        FaceConfidence = rootConfig.BlurServiceDotnet.FaceModel.Confidence;
        FaceIOU = rootConfig.BlurServiceDotnet.FaceModel.IOU;
        PlateConfidence = rootConfig.BlurServiceDotnet.PlateModel.Confidence;
        PlateIOU = rootConfig.BlurServiceDotnet.PlateModel.IOU;
        ImageQuality = rootConfig.BlurServiceDotnet.ImageQuality;
        BlurOpacity = (byte)rootConfig.BlurServiceDotnet.BlurOpacity;

        if (string.IsNullOrWhiteSpace(rootConfig.BlurServiceDotnet.ImageFormat))
            throw new Exception("Le champ 'imageFormat' est manquant ou vide dans la configuration.");

        ImageFormat = rootConfig.BlurServiceDotnet.ImageFormat.ToLower() switch
        {
            "jpeg" => SKEncodedImageFormat.Jpeg,
            "png" => SKEncodedImageFormat.Png,
            "webp" => SKEncodedImageFormat.Webp,
            _ => throw new Exception($"Format d'image non supporté: {rootConfig.BlurServiceDotnet.ImageFormat}")
        };

        // Chargement des nouveaux paramètres de flou
        BlurBaseSigma = rootConfig.BlurServiceDotnet.BlurBaseSigma;
        BlurBrightnessFactor = rootConfig.BlurServiceDotnet.BlurBrightnessFactor;
    }

    private class RootConfig
    {
        public ModelSection Models { get; set; } = default!;
        public BlurServiceSection BlurServiceDotnet { get; set; } = default!;
    }

    private class ModelSection
    {
        public string Path { get; set; } = default!;
        public string FaceModel { get; set; } = default!;
        public string PlateModel { get; set; } = default!;
    }

    private class BlurServiceSection
    {
        public ModelParams FaceModel { get; set; } = default!;
        public ModelParams PlateModel { get; set; } = default!;
        public int ImageQuality { get; set; }
        public int BlurOpacity { get; set; }
        public string ImageFormat { get; set; } = default!;

        // Nouveaux paramètres de flou
        public float BlurBaseSigma { get; set; }
        public float BlurBrightnessFactor { get; set; }
    }

    private class ModelParams
    {
        public double Confidence { get; set; }
        public double IOU { get; set; }
    }
}
