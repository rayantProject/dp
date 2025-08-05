# Explication Complète du Projet Nestor IA POC Floutage

## 🎯 Vue d'ensemble du projet

Le projet **Nestor IA POC Floutage** est une **Proof of Concept (POC)** qui démontre l'utilisation de l'intelligence artificielle pour détecter et flouter automatiquement des éléments sensibles dans les images. Le projet utilise des modèles YOLO (You Only Look Once) pour détecter :

- **Les visages** (pour respecter la vie privée)
- **Les plaques d'immatriculation** (pour l'anonymisation)

Le système applique ensuite un floutage intelligent sur ces zones détectées, offrant une solution automatisée pour l'anonymisation d'images.

## 🏗️ Architecture du projet

Le projet est structuré comme un **monorepo** utilisant **Yarn Workspaces** et comprend plusieurs composants principaux :

### 1. Services Backend (APIs de traitement)

#### Service Flask (Python)

- **Localisation** : `services/blur-service-flask/`
- **Technologie** : Flask, Ultralytics YOLO, PIL (Python Imaging Library)
- **Port** : 5050 (configurable)
- **Fonctionnalités** :
  - Détection de visages et plaques via modèles YOLO
  - Application de flou circulaire sur les visages
  - Application de flou rectangulaire sur les plaques
  - API REST pour traitement d'images

#### Service .NET (C#)

- **Localisation** : `services/blur-service-dotnet/`
- **Technologie** : ASP.NET Core, YoloDotNet, SkiaSharp
- **Fonctionnalités** :
  - Utilisation de modèles ONNX (format optimisé)
  - Floutage adaptatif basé sur la luminosité
  - Traitement haute performance avec SkiaSharp
  - API REST avec endpoints `/predict` et `/detect`

### 2. Interface Frontend

#### Client Next.js
- **Localisation** : `apps/client/`
- **Technologie** : Next.js 15, React, TypeScript, Tailwind CSS
- **Fonctionnalités** :
  - Interface web pour upload d'images
  - Prévisualisation des résultats
  - Communication avec les services backend
  - Support Tauri pour application desktop

### 3. Système de Configuration

#### Configuration Centralisée
- **Fichier principal** : `nestor-ai-config.json`
- **Gestion** : Configuration unifiée pour tous les services
- **Paramètres configurables** :
  - Chemins des modèles IA
  - Seuils de confiance et IoU
  - Paramètres de floutage
  - Formats d'image de sortie
  - Ports des services

### 4. Scripts d'Automatisation

#### Scripts TypeScript (`scripts/`)
- **`pythonSetup.ts`** : Configuration automatique de l'environnement Python
- **`serviceFlask.ts`** / **`serviceDotnet.ts`** : Démarrage des services
- **`modelExportOnnx.ts`** : Export des modèles PyTorch vers ONNX
- **`deployServiceFlask.ts`** / **`deployServiceDotnet.ts`** : Déploiement des services

## 🧠 Intelligence Artificielle et Modèles

### Modèles YOLO Utilisés

#### Modèle de Détection de Visages
- **Format PyTorch** : `yolov11m-face.pt`
- **Format ONNX** : `yolov11m-face.onnx` (pour .NET)
- **Tâche** : Détection d'objets (visages)
- **Architecture** : YOLOv11 Medium (compromis performance/précision)

#### Modèle de Détection de Plaques
- **Format PyTorch** : `license_plate_detector.pt`
- **Format ONNX** : `license_plate_detector.onnx` (pour .NET)
- **Tâche** : Détection d'objets (plaques d'immatriculation)

### Hiérarchie des Modèles YOLO

Le projet supporte différentes tailles de modèles YOLO :

| Modèle | Taille | Vitesse | Précision | Usage |
|--------|--------|---------|-----------|-------|
| `n` (nano) | ~4-7 MB | ~100+ FPS | Faible | Mobile, temps réel |
| `s` (small) | ~15-20 MB | ~60-90 FPS | Moyenne | Webcams, streaming |
| `m` (medium) | ~40-50 MB | ~30-45 FPS | Bonne | **Usage général** |
| `l` (large) | ~80-100 MB | ~20-30 FPS | Très bonne | GPU desktop |
| `x` (xlarge) | ~150-200 MB | ~10-20 FPS | Excellente | Serveur, cloud |

## 🎨 Algorithmes de Floutage

### Service Flask (Python)
- **Flou circulaire** pour les visages (masque elliptique)
- **Flou rectangulaire** pour les plaques
- **Filtre Gaussien** avec intensité fixe (σ = 15)
- **Bibliothèque** : PIL ImageFilter

### Service .NET (C#)
- **Flou adaptatif** basé sur la luminosité
- **Formule** : `σ = blurBaseSigma + brightness × blurBrightnessFactor`
- **Calcul de luminosité** : Formule de luminance relative (0.299R + 0.587G + 0.114B)
- **Bibliothèque** : SkiaSharp avec filtres d'image

## 🛠️ Workflow de Développement

### 1. Installation et Configuration
```bash
# Installation des dépendances Node.js
yarn

# Configuration automatique Python
yarn setup

# Export des modèles ONNX (requis pour .NET)
yarn model:export_onnx
```

### 2. Développement Local
```bash
# Démarrage du service Flask + Client
yarn dev:flask

# Démarrage du service .NET + Client
yarn dev:dotnet
```

### 3. Qualité de Code
- **Prettier** : Formatage JavaScript/TypeScript
- **Black** : Formatage Python
- **Husky** : Hooks Git automatiques
- **lint-staged** : Validation avant commit

### 4. Déploiement
```bash
# Build et packaging Flask
yarn deploy:flask

# Build et packaging .NET
yarn deploy:dotnet
```

## 📊 Paramètres de Configuration Avancés

### Détection (Modèles YOLO)
- **Confidence** : Seuil de confiance minimum (0.25 par défaut)
- **IoU** : Intersection over Union pour suppression des doublons
- **Format** : Support PyTorch (.pt) et ONNX (.onnx)

### Floutage (.NET uniquement)
- **blurBaseSigma** : Intensité de base du flou (5 par défaut)
- **blurBrightnessFactor** : Facteur de multiplication pour zones claires (10 par défaut)
- **blurOpacity** : Opacité du flou (128 par défaut)

### Images
- **Formats supportés** : JPEG, PNG, WebP
- **Qualité** : 0-100 (100 par défaut)
- **Compression** : Optimisée selon le format

## 🔄 Flux de Traitement

### 1. Upload d'Image
- L'utilisateur uploade une image via l'interface Next.js
- L'image est envoyée au service backend choisi (Flask ou .NET)

### 2. Détection IA
- Le service charge les modèles YOLO configurés
- Exécution de la détection sur l'image
- Filtrage des résultats selon les seuils de confiance

### 3. Application du Floutage
- **Flask** : Flou gaussien uniforme avec masques géométriques
- **.NET** : Flou adaptatif calculé selon la luminosité locale

### 4. Retour du Résultat
- L'image traitée est encodée dans le format choisi
- Retour via HTTP avec le type MIME approprié
- Affichage dans l'interface utilisateur

## 🎯 Cas d'Usage

### Anonymisation de Contenu
- **Réseaux sociaux** : Protection de la vie privée
- **Surveillance** : Conformité RGPD
- **Médias** : Floutage automatique avant diffusion

### Applications Métier
- **Assurance** : Traitement de photos de sinistres
- **Immobilier** : Anonymisation des visites virtuelles
- **Transport** : Protection des données de circulation

## 📈 Performance et Optimisations

### Service Flask
- **Avantages** : Simplicité, écosystème Python riche
- **Performance** : Adapté pour prototypage et charge modérée
- **Scalabilité** : Déploiement facile avec Gunicorn/uWSGI

### Service .NET
- **Avantages** : Performance native, optimisations SkiaSharp
- **Performance** : Traitement haute vitesse, faible latence
- **Scalabilité** : Architecture ASP.NET Core, support containerization

## 🔮 Extensions Futures

### Modèles Additionnels
- Détection de textes sensibles
- Reconnaissance d'objets spécifiques
- Classification de contenu

### Optimisations Performance
- Support GPU (CUDA/OpenCL)
- Modèles quantifiés (INT8)
- Traitement par lots (batch processing)

### Fonctionnalités Avancées
- Floutage sélectif par région
- Prévisualisation temps réel
- API de configuration dynamique

## 🛡️ Sécurité et Conformité

### Protection des Données
- Aucun stockage des images traitées
- Traitement en mémoire uniquement
- Logs anonymisés

### Conformité RGPD
- Anonymisation automatique
- Traçabilité des traitements
- Consentement utilisateur

Ce projet représente une solution complète et moderne pour l'anonymisation automatique d'images, combinant l'efficacité de l'IA moderne avec une architecture flexible et maintenable.