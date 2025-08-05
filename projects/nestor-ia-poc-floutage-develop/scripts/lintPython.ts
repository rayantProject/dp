import { command } from './command';
import os from 'os';
import path from 'path';

const platform = os.platform();
const pythonCmd = platform === 'win32' ? '.venv\\Scripts\\python.exe' : '.venv/bin/python';

async function runBlack(filePath: string) {
  try {
    console.log(`⚡ Running Black on ${filePath}...`);
    await command(`${pythonCmd} -m black ${filePath}`);
    console.log(`✔ Black formatting completed for ${filePath}.`);
  } catch (error) {
    console.error(`❌ Error running Black on ${filePath}:`, error);
    process.exit(1);
  }
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('❌ Aucun fichier à formater.');
    process.exit(1);
  }

  for (const file of files) {
    await runBlack(path.resolve(file));
  }
}

main();
