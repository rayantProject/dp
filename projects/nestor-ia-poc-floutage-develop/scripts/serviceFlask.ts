import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const platform = os.platform();
const pythonCmd = platform === 'win32' ? '.venv\\Scripts\\python.exe' : '.venv/bin/python';
const pythonFilePath = path.resolve(__dirname, '../services/blur-service-flask/run.py');

export async function runFlask() {
  console.log(`Executing: ${pythonCmd} ${pythonFilePath}`);

  const flaskProcess = spawn(pythonCmd, [pythonFilePath], { stdio: 'inherit', shell: true });

  flaskProcess.on('error', (err) => {
    console.error('Failed to start Flask:', err);
  });

  flaskProcess.on('exit', (code) => {
    console.log(`Flask process exited with code ${code}`);
  });
}

async function main() {
  await runFlask();
}

main();
