# Nestor IA POC Floutage

## Table des matières

1. [Aperçu du projet](#aperçu-du-projet)
2. [Prérequis](#prérequis)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Models](#models)
6. [Usage](#usage)
7. [Scripts disponibles](#scripts-disponibles)
8. [Structure du projet](#structure-du-projet)
9. [Lint & Format](#lint--format)
10. [Entrainements](#entreinements)
11. [Deployment](#deployment)

---

## Aperçu du projet

- **Service Flask** : Permet de gérer le traitement (ex. floutage) d’images côté serveur en Python.
- **Service .NET** : Permet de gérer le traitement (ex. floutage) d’images côté serveur en C#.
- **Packages modelExportOnnx** : Permet d’exporter des modèles en ONNX pour les services .NET.
- **Client Next.js** : Fournit une interface web pour charger des images et interagir avec les services backend.
- **Scripts TypeScript** : Automatisent certaines tâches (installation de dépendances Python, démarrage des services, etc.).

---

## Prérequis

- **Node.js** (version récente)
- **Yarn** (v4.7.0 ou plus récent)
- **Python 3.x** (idéalement 3.13+)
- **.NET SDK** (version requise pour le service .NET)

---

## Installation

1. **Installer les dépendances Node**

   ```bash
   yarn
   ```

   > Cela installe les dépendances définies dans `package.json`.

2. **Configurer l’environnement Python**

   - Via le script TypeScript
     ```bash
     yarn setup
     ```
     > Ce script (`ts-node ./scripts/pythonSetup.ts`) peut automatiser la création de l'environnement (.venv) et l’installation des dépendances Python.

---

## Configuration

Les configurations sont stockées dans le fichier `nestor-ai-config.json` à la racine du projet.
il gere les paramètres suivants :

**Modèles:**

- `models.path` : le chemin vers les modèles
- `models.FaceModel` : le nom du modèle de détection de visage (en pt)
- `models.PlateModel` : le nom du modèle de détection de plaque d'immatriculation (en pt)
- `mdels.task` : le type de tache à effectuer (floutage, detection, etc)'

**Exportation:**

- `modelsOnnxExport.output` : le chemin de sortie pour les modèles exportés en ONNX
- `modelsOnnxExport.format` : les formats de sortie pour les modèles exportés

**Processus de build de l'API:**

- `buildProcessAPI.buildPath` : le chemin de sortie pour les API construites
- `buildProcessAPI.blurServiceFlask.outputName` : le nom de l'API Flask construite
- `buildProcessAPI.blurServiceDotnet.outputName` : le nom de l'API .NET construite

> **Note** : Toute les infos de configurations sont documentées dans le fichier [modelConfig.md](docs/modelConfig.md)

---

## Models

Les modèles sont configurés dans le fichier `nestor-ai-config.json` à la racine du projet.
Créer un dossier avec pour arborescence le paramètre `models.path` du fichier de configuration. par defaut le dossier est `assets/models` (à créer)

voici ou télécharger quelques modèles :

**lien direct ecnonocom :**

- [licence_plate_detection](https://econocom.sharepoint.com/:u:/s/EDFENR-GESCOM/EYbyh8XC62xGls9SNG01lO0BGYEzE79-vjlYLX1AXFMbOg?e=3REhTa)
- [face_detection](https://econocom.sharepoint.com/:u:/s/EDFENR-GESCOM/ESHhkqTd8rRNhKUoxJtL-zYBFq2OoMBvrtfVUwbqLT5FUg?e=PfAzhF)

**autre models :**

- [yolo face](https://github.com/akanametov/yolo-face)

> **Documentation** : vous voulez comprendre les différences entre les modèles YOLO (nano, small, medium, large, xlarge) ? Consultez la [Hiérarchie des Modèles YOLO](docs/hierachieModels.md)

---

## Usage

1. **Démarrer le service Flask**

   ```bash
   yarn dev:flask
   ```

   > Ce script lance **en parallèle** le service Flask et le client Next.js.

2. **Démarrer le service .NET**

   ```bash
   yarn dev:dotnet
   ```

   > Ce script lance **en parallèle** le service .NET et le client Next.js.

   ⚠ **Attention** : Avant de démarrer le service .NET, assurez-vous d'avoir exporté les modèles en ONNX. Vous pouvez utiliser la commande suivante :

   ```bash
   yarn model:export_onnx
   ```

   Cela garantit que le service .NET dispose des modèles nécessaires pour fonctionner correctement.

3. **Déploiement des API**

   Les commandes suivantes permettent de copier l'API tout les paramètres et modeles necessaires pour le deploiement dans un dossier specifique mentionner par
   le parametre `buildProcessAPI.buildPath` dans le fichier de configuration `nestor-ai-config.json` par defaut le dossier est `build/`

   > ** note ** : les noms des api sont definis dans le fichier de configuration `nestor-ai-config.json` par les parametres `buildProcessAPI.blurServiceFlask.outputName` et `buildProcessAPI.blurServiceDotnet.outputName`

   ```bash
   yarn deploy:flask
   ```

   ```bash
   yarn deploy:dotnet
   ```

---

## Scripts disponibles

Les scripts suivants sont définis dans le fichier [`package.json`](./package.json) :

- **`yarn prepare`**  
  Initialise Husky pour la gestion des hooks Git (pré-commit, etc.).

- **`yarn setup`**  
  Exécute le script TypeScript `pythonSetup.ts` qui peut installer automatiquement les dépendances Python.

- **`yarn service:flask`**  
  Lance le service Flask via `ts-node ./scripts/serviceFlask.ts`.

- **`yarn service:dotnet`**  
  Lance le service .NET via `ts-node ./scripts/serviceDotnet.ts`.

- **`yarn client:next`**  
  Lance le client Next.js (via le workspace `@nestor-ia-poc-floutage/client-next`) en mode développement.

- **`yarn dev:flask`**  
  Lance **en parallèle** (grâce à `concurrently`) le service Flask et le client Next.js.

- **`yarn dev:dotnet`**  
  Lance **en parallèle** (grâce à `concurrently`) le service .NET et le client Next.js.

- **`yarn lint:black`**  
  Vérifie ou formate (selon ton script) le code Python avec **Black**.

- **`yarn lint:prettier`**  
  Vérifie la mise en forme du code JavaScript/TypeScript/JSON/Markdown via **Prettier**.

- **`yarn model:export_onnx`**  
  Exporte un modèle vers le format ONNX via `ts-node ./scripts/modelExportOnnx.ts`.

- **`yarn deploy:flask`**
  Copie l'API Flask dans un dossier specifique pour le deploiement

- **`yarn deploy:dotnet`**
  Copie l'API .NET dans un dossier specifique pour le deploiement

---

## Structure du projet

Le dépôt est organisé en monorepo grâce à Yarn Workspaces :

```
.
├── .husky/                # Fichiers de configuration Husky (hooks Git)
├── .venv/                 # (Optionnel) Environnement virtuel Python
├── .vscode/               # Config VSCode
├── .yarn/                 # Fichiers internes à Yarn (v4+)
├── apps/                  # Contiendra éventuellement des applications Frontend
│   └── client/            # Exemple de client Next.js
├── packages/              # Pour des librairies partagées (s'il y en a)
├── scripts/               # Scripts Node/TS (ex. pythonSetup.ts, serviceFlask.ts, serviceDotnet.ts, etc.)
├── services/
│   ├── blur-service-flask/
│   │   ├── app/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── run.py
│   ├──blur-service-dotnet/
│   │   ├── Properties/
│   │   ├── Controllers/
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── blur-service-dotnet.csproj
│   │   ├── blur-service-dotnet.http
│   │   ├── Config.cs
│   │   ├── Program.cs
│
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .prettierrc.json
├── commitlint.config.ts
├── nestor-ai-config.json   # Configuration principale
├── package.json            # Dépendances et scripts principaux
├── README.md               # (Le fichier que vous lisez)
├── requirements.txt        # Dépendances Python principales
├── tsconfig.json           # Configuration TypeScript
└── yarn.lock
```

---

## Lint & Format

Ce projet utilise **Prettier** pour formater le code JavaScript/TypeScript et **Black** pour le code Python.  
La configuration `lint-staged` dans `package.json` permet de lancer automatiquement ces vérifications sur les fichiers modifiés lors des commits.

- **Lint Prettier** :
  ```bash
  yarn lint:prettier
  ```
- **Lint Black (Python)** :
  ```bash
  yarn lint:black
  ```
- **Husky + lint-staged** :  
  Lors d’un commit, Husky exécute automatiquement les tâches définies dans `lint-staged` (formater/valider le code modifié).

---

## Entrainements (à venir)

> **À venir** : Vous pouvez malgré tout consulter la [documentation sur l'entraînement YOLO](docs/trainYOLO.md) pour comprendre le processus.

---

## Deployment

Pour deployer les API, d'utiler les commandes mentionnées dans la section [Usage](#usage). Les API seront copiées dans un dossier specifique mentionné par le parametre `buildProcessAPI.buildPath` dans le fichier de configuration `nestor-ai-config.json` par defaut le dossier est `build/`

Après avoir copié les API, vous pouvez les deployer sur un serveur en
apres installation des dependances necessaires, vous pouvez lancer les API

- **API Flask** :

  ```bash
  python install -r requirements.txt
  python run.py
  ```

- **API .NET** :
  ```bash
   dotnet run --launch-profile blur-service-dotnet
  ```

---
