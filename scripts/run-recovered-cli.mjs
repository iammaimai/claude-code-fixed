import { mkdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, '..');
const configDir = path.join(projectDir, '.claude-recovery');
const cliPath = path.join(projectDir, 'dist', 'cli.js');
const globalSettingsPath = path.join(os.homedir(), '.claude', 'settings.json');

await mkdir(configDir, { recursive: true });

async function loadGlobalSettingsEnv() {
  if (process.env.CLAUDE_RECOVERY_SKIP_GLOBAL_ENV === '1') {
    return {};
  }

  try {
    const raw = await readFile(globalSettingsPath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed?.env && typeof parsed.env === 'object' ? parsed.env : {};
  } catch {
    return {};
  }
}

const globalSettingsEnv = await loadGlobalSettingsEnv();
const env = { ...process.env };
for (const [key, value] of Object.entries(globalSettingsEnv)) {
  if (!(key in env) && value != null) {
    env[key] = String(value);
  }
}
env.CLAUDE_CONFIG_DIR = configDir;

const child = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], {
  cwd: projectDir,
  env,
  stdio: 'inherit',
});

child.on('exit', code => {
  process.exit(code ?? 0);
});

child.on('error', error => {
  console.error(error);
  process.exit(1);
});
