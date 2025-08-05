import { command } from './command';
import fs from 'fs';
import os from 'os';
import path from 'path';

const platform = os.platform();
const pythonCmd = platform === 'win32' ? '.venv\\Scripts\\python.exe' : '.venv/bin/python';

export async function detectPython(): Promise<string> {
  const candidates = ['python', 'python3'];

  for (const cmd of candidates) {
    try {
      const versionOutput = await command(`${cmd} --version`);
      if (versionOutput.toLowerCase().includes('python')) {
        console.log(`✔ Python detected: ${versionOutput.trim()}`);
        return cmd;
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error('❌ Python is not installed or not in PATH.');
}

async function checkPythonVersion() {
  try {
    const pythonCommand = await detectPython();
    const versionOutput = await command(`${pythonCommand} --version`);
    const versionMatch = versionOutput.match(/Python (\d+)\.(\d+)\.(\d+)/);

    if (!versionMatch) {
      throw new Error('Python version format not recognized.');
    }

    const major = parseInt(versionMatch[1], 10);
    const minor = parseInt(versionMatch[2], 10);

    if (major === 3 && minor >= 13) {
      return pythonCommand;
    } else {
      console.error(`❌ Python version too old: ${versionOutput.trim()}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error checking Python version: ${error}`);
    return null;
  }
}

async function setVenv(pythonCommand: string) {
  try {
    if (fs.existsSync('.venv')) {
      console.log('✔ Virtual environment already exists.');
      return;
    }

    console.log('⚡ Creating virtual environment...');
    await command(`${pythonCommand} -m venv .venv`);

    // Vérifier si la création du venv a réussi
    if (!fs.existsSync(pythonCmd)) {
      throw new Error('Venv creation failed.');
    }

    console.log('✔ Virtual environment is ready.');
  } catch (error) {
    console.error('❌ Impossible to set up venv:', error);
  }
}

async function installRequirements() {
  const requirementsPath = path.resolve('requirements.txt');

  if (!fs.existsSync(requirementsPath)) {
    console.error(`❌ Error: requirements.txt not found at ${requirementsPath}`);
    return;
  }

  try {
    console.log('⚡ Checking if pip is installed...');
    await command(`${pythonCmd} -m ensurepip`);

    console.log('⚡ Installing requirements...');
    await command(`${pythonCmd} -m pip install -r requirements.txt`);
    console.log('✔ Requirements installed successfully.');
  } catch (error) {
    console.error('❌ Impossible to install requirements:', error);
  }
}

async function main() {
  const pythonCommand = await checkPythonVersion();
  if (!pythonCommand) {
    console.error('❌ Python 3.13 or higher is required.');
    return;
  }

  await setVenv(pythonCommand);
  await installRequirements();
}

main();
