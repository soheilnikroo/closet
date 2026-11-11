import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';

if (existsSync('.env')) process.loadEnvFile('.env');
const ports = [['web', Number(process.env.WEB_PORT || 5173)], ['API', Number(process.env.API_PORT || 8080)]];
for (const [name, port] of ports) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(`Invalid ${name} port: ${port}`);
    process.exit(1);
  }
  try {
    for (const host of ["127.0.0.1", "::1"]) await new Promise((resolve, reject) => {
      const probe = createServer();
      probe.once('error', reject);
      probe.listen(port, host, () => probe.close(resolve));
    });
  } catch (error) {
    console.error(`\nCloset cannot start: ${name} port ${port} is unavailable (${error.code}).\nIf Closet is already running, open http://localhost:${ports[0][1]}.\nOtherwise stop its previous terminal with Ctrl+C, then run pnpm dev again.\nNo existing processes were stopped.\n`);
    process.exit(1);
  }
}
const children = new Set();
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    try {
      if (process.platform === 'win32') child.kill('SIGTERM');
      else process.kill(-child.pid, 'SIGTERM');
    } catch { /* Process already exited. */ }
  }
  setTimeout(() => {
    for (const child of children) {
      try {
        if (process.platform === 'win32') child.kill('SIGKILL');
        else process.kill(-child.pid, 'SIGKILL');
      } catch { /* Process already exited. */ }
    }
    process.exit(code);
  }, 1500);
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
function run(args) {
  const child = spawn('pnpm', args, { stdio: 'inherit', detached: process.platform !== 'win32', env: process.env });
  children.add(child);
  child.once('error', (error) => { console.error(error.message); stop(1); });
  child.once('exit', () => children.delete(child));
  return child;
}
const built = await new Promise((resolve) => run(['--filter', '@closet/shared', 'build']).once('exit', code => resolve(code === 0)));
if (!built) stop(1);
else if (!stopping) {
  console.log(`\nCloset → http://localhost:${ports[0][1]} · Ctrl+C stops all services\n`);
  for (const args of [
    ['--filter', '@closet/shared', 'dev'],
    ['--filter', '@closet/api', 'dev'],
    ['--filter', '@closet/web', 'exec', 'react-router', 'dev', '--port', String(ports[0][1])],
  ]) run(args).once('exit', (code) => { if (!stopping) stop(code || 1); });
}
