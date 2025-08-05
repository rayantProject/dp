import * as path from 'path';
import * as fs from 'fs';
import { exec, ExecException } from 'child_process';

const data = fs.readFileSync(path.resolve(__dirname, '../nestor-ai-config.json'), 'utf8');
const config = JSON.parse(data);

function command(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) reject(`Error: ${error.message}\nStderr: ${stderr}`);
      else resolve(stdout);
    });
  });
}

function createBuildFolder() {
  const buildPath = config.buildProcessAPI.buildPath;
  if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath);
  return buildPath;
}

function deleteFolderRecursive(targetPath: string) {
  if (fs.existsSync(targetPath)) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`🧹 Dossier "${targetPath}" supprimé avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du dossier "${targetPath}" :`, error);
      process.exit(1);
    }
  }
}

export { command, config, createBuildFolder, deleteFolderRecursive };
