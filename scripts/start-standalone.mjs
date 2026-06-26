import { cpSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, '.next', 'standalone');

function findServerEntry() {
  const direct = path.join(standaloneDir, 'server.js');
  if (existsSync(direct)) {
    return direct;
  }

  for (const entry of readdirSync(standaloneDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const candidate = path.join(standaloneDir, entry.name, 'server.js');
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Standalone server.js bulunamadı: ${standaloneDir}`);
}

function syncDirIfPresent(source, target) {
  if (!existsSync(source)) {
    return;
  }

  cpSync(source, target, { recursive: true, force: true });
}

const serverEntry = findServerEntry();
const serverDir = path.dirname(serverEntry);

// Next standalone bazen statik dosyaları üst .next klasöründe bırakır.
syncDirIfPresent(path.join(rootDir, '.next', 'static'), path.join(serverDir, '.next', 'static'));
syncDirIfPresent(path.join(rootDir, 'public'), path.join(serverDir, 'public'));

const child = spawn(process.execPath, [serverEntry], {
  cwd: serverDir,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

