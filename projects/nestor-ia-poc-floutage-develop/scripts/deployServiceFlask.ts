import path from 'path';
import fs from 'fs';
import { config, createBuildFolder, deleteFolderRecursive } from './command';

function copyNecessaryFiles(buildPath: string) {
  const filesToCopy = [
    { src: '../services/blur-service-flask', dest: config.buildProcessAPI.blurServiceFlask.outputName },
    { src: '../nestor-ai-config.json', dest: 'nestor-ai-config.json' },
    { src: '../requirements.txt', dest: 'requirements.txt' },
    { src: path.resolve(__dirname, '..', config.models.path), dest: 'assets/models' },
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

  const configJsonPath = path.resolve(__dirname, '../nestor-ai-config.json');
  const configData = JSON.parse(fs.readFileSync(configJsonPath, 'utf-8'));

  const newConfigContent = generatePythonConfigFromJSON(configData);

  const buildServiceAppPath = path.join(
    buildPath,
    config.buildProcessAPI.blurServiceFlask.outputName,
    'app',
    'config.py'
  );

  try {
    fs.writeFileSync(buildServiceAppPath, newConfigContent);
    console.log(`✔ Contenu de config.py généré avec succès`);
  } catch (error) {
    console.error(`❌ Échec de l'écriture de config.py:`, error);
  }
}

function generatePythonConfigFromJSON(configData: any): string {
  const lines: string[] = [];

  lines.push(`import json`);
  lines.push(`from pathlib import Path`);
  lines.push(``);
  lines.push(`CURRENT_DIR = Path(__file__).resolve().parent`);
  lines.push(`CONFIG_PATH = (CURRENT_DIR.parent.parent / "nestor-ai-config.json").resolve()`);
  lines.push(``);
  lines.push(`with open(CONFIG_PATH, "r", encoding="utf-8") as f:`);
  lines.push(`    config_data = json.load(f)`);
  lines.push(``);
  lines.push(`MODEL_BASE_DIR = (CONFIG_PATH.parent / config_data["models"]["path"]).resolve()`);
  lines.push(``);
  // Lire le fichier config.py source (dev)
  const sourceConfigPath = path.resolve(__dirname, '../services/blur-service-flask/app/config.py');
  const sourceContent = fs.readFileSync(sourceConfigPath, 'utf-8');
  // Extraire le contenu de la class Config
  const match = sourceContent.match(/class Config:[\s\S]+/);
  if (match) {
    lines.push(match[0]);
  } else {
    console.warn('⚠️ Impossible de trouver class Config dans le fichier source.');
  }
  return lines.join('\n');
}

function deployService() {
  const buildPath = createBuildFolder();

  deleteFolderRecursive(buildPath);

  fs.mkdirSync(buildPath, { recursive: true });

  copyNecessaryFiles(buildPath);
}

deployService();
