import { spawn } from 'child_process';
import path from 'path';

export async function runDonet() {
  const dotnetCmd = 'dotnet run --launch-profile blur-service-dotnet';
  const dotnetFilePath = path.resolve(__dirname, '../services/blur-service-dotnet/');

  console.log(`Executing: ${dotnetCmd} in ${dotnetFilePath}`);

  const dotnetProcess = spawn(dotnetCmd, { cwd: dotnetFilePath, stdio: 'inherit', shell: true });

  dotnetProcess.on('error', (err) => {
    console.error('Failed to start .NET:', err);
  });

  dotnetProcess.on('exit', (code) => {
    console.log(`.NET process exited with code ${code}`);
  });
}

async function main() {
  await runDonet();
}

main();
