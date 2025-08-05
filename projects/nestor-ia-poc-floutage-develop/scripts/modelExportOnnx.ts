import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const platform = os.platform();
const pythonCmd = platform === 'win32' ? '.venv\\Scripts\\python.exe' : '.venv/bin/python';
const pythonFilePath = path.resolve(__dirname, '../packages/models-onnx-export/main.py');

export async function runModelExportOnnx() {
  console.log(`Executing: ${pythonCmd} ${pythonFilePath}`);

  const modelExportProcess = spawn(pythonCmd, [pythonFilePath], { stdio: 'inherit', shell: true });

  modelExportProcess.on('error', (err) => {
    console.error('Failed to start model export:', err);
  });

  modelExportProcess.on('exit', (code) => {
    console.log(`Model export process exited with code ${code}`);
  });
}

async function main() {
  await runModelExportOnnx();
}

main();
