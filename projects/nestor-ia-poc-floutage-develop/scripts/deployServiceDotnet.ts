import path from 'path';
import fs from 'fs';
import { config, createBuildFolder, deleteFolderRecursive } from './command';

function copyNecessaryFiles(buildPath: string) {
  const filesToCopy = [
    { src: '../services/blur-service-dotnet', dest: config.buildProcessAPI.blurServiceDotnet.outputName },
    { src: '../nestor-ai-config.json', dest: 'nestor-ai-config.json' },
    { src: path.resolve(__dirname, '..', config.models.path), dest: config.models.path },
  ];

  for (const file of filesToCopy) {
    const srcPath = path.resolve(__dirname, file.src);
    const destPath = path.join(buildPath, file.dest);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    try {
      fs.cpSync(srcPath, destPath, { recursive: true });
      console.log(`✔ Copied ${file.src} to ${file.dest}`);
    } catch (error) {
      console.error(`❌ Failed to copy ${file.src}:`, error);
    }
  }
}

function deployService() {
  const buildPath = createBuildFolder();

  // On supprime le dossier de build existant puis on le recrée
  deleteFolderRecursive(buildPath);
  fs.mkdirSync(buildPath, { recursive: true });

  // Copie des fichiers nécessaires
  copyNecessaryFiles(buildPath);

  // Ajout d'une étape pour corriger le chemin basePath dans le fichier Config.cs du service .NET
  const configCsPath = path.join(buildPath, config.buildProcessAPI.blurServiceDotnet.outputName, 'Config.cs');
  if (fs.existsSync(configCsPath)) {
    let configCsContent = fs.readFileSync(configCsPath, 'utf-8');
    const oldString = `Path.Combine(Directory.GetCurrentDirectory(), "../..")`;
    const newString = `Path.Combine(Directory.GetCurrentDirectory(), "..")`;

    if (configCsContent.includes(oldString)) {
      configCsContent = configCsContent.replace(oldString, newString);
      fs.writeFileSync(configCsPath, configCsContent, 'utf-8');
      console.log(`✔ Patched basePath in Config.cs`);
    } else {
      console.warn(`⚠ La chaîne '${oldString}' n'a pas été trouvée dans Config.cs`);
    }
  } else {
    console.warn(
      `⚠ Fichier Config.cs introuvable dans ${path.join(buildPath, config.buildProcessAPI.blurServiceDotnet.outputName)}`
    );
  }
}

deployService();
