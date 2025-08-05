# Documentation de la configuration `nestor-ai-config.json`

Ce fichier contient toutes les informations nécessaires au bon fonctionnement des différents services (Flask, .NET) ainsi que des scripts de build, de traitement et d'exportation de modèles.

---

## Structure du fichier

### `models`

Contient les paramètres liés aux modèles à utiliser.

- **`path`** : chemin vers le dossier contenant les modèles (ex: `assets/models`)
- **`FaceModel`** : nom du fichier du modèle de détection de visage (ex: `yolov11m-face.pt`)
- **`PlateModel`** : nom du fichier du modèle de détection de plaques (ex: `license_plate_detector.pt`)
- **`tasks`** :
  - **`FaceModel`** : type de tâche à exécuter (ex: `detect`)
  - **`PlateModel`** : type de tâche à exécuter (ex: `detect`)

---

### `modelsOnnxExport`

Paramètres pour l’exportation des modèles au format ONNX (nécessaire pour le service .NET).

- **`output`** : chemin de sortie des fichiers ONNX
- **`format`** : format de sortie (actuellement supporté : `onnx`)

---

### `buildProcessAPI`

Spécifie où les services doivent être copiés pour déploiement, ainsi que leur nom.

- **`buildPath`** : dossier de sortie global (ex: `build/`)
- **`blurServiceFlask.outputName`** : nom du dossier du service Flask après build
- **`blurServiceDotnet.outputName`** : nom du dossier du service .NET après build

---

### `blurServiceFlask`

Contient les paramètres liés au service Flask :

- **`port`** : port sur lequel le service sera lancé (ex: `5050`)

---

### `blurServiceDotnet`

Contient les paramètres utilisés par le service .NET pour exécuter les prédictions et appliquer le floutage :

- **`faceModel`** :
  - **`confidence`** : seuil de confiance du modèle visage (ex: `0.5`)
  - **`IOU`** : seuil d'intersection sur union (IoU) du modèle visage (ex: `0.7`)
- **`plateModel`** :
  - **`confidence`** : seuil de confiance du modèle plaque (ex: `0.5`)
  - **`IOU`** : seuil IoU du modèle plaque (ex: `0.7`)
- **`imageQuality`** : qualité d'encodage JPEG (0–100, ex: `100`)
- **`imageFormat`** : format d'image de sortie (ex: `jpeg`)
- **`blurBaseSigma`** : valeur de base pour le sigma du flou (ex: `5`) tester avec 25 pour un flou plus prononcé
- **`blurBrightnessFactor`** : facteur utilisé pour augmenter l'intensité du flou en fonction de la luminosité (ex: `10`)

La formule utilisée pour calculer l'intensité finale du flou dans le service .NET est :

```csharp
sigma = blurBaseSigma + brightness * blurBrightnessFactor;
```

où **`brightness`** est une valeur comprise entre 0 (zone sombre) et 1 (zone très lumineuse).

---

## Exemple de configuration

```json
{
  "models": {
    "path": "assets/models",
    "FaceModel": "yolov11m-face.pt",
    "PlateModel": "license_plate_detector.pt",
    "tasks": {
      "FaceModel": "detect",
      "PlateModel": "detect"
    }
  },
  "modelsOnnxExport": {
    "output": "assets/models",
    "format": "onnx"
  },
  "buildProcessAPI": {
    "buildPath": "build",
    "blurServiceFlask": {
      "outputName": "blur-service-flask"
    },
    "blurServiceDotnet": {
      "outputName": "blur-service-dotnet"
    }
  },
  "blurServiceFlask": {
    "port": 5050
  },
  "blurServiceDotnet": {
    "faceModel": {
      "confidence": 0.5,
      "IOU": 0.7
    },
    "plateModel": {
      "confidence": 0.5,
      "IOU": 0.7
    },
    "imageQuality": 100,
    "imageFormat": "jpeg",
    "blurOpacity": 128,
    "blurBaseSigma": 20,
    "blurBrightnessFactor": 10
  }
}
```
