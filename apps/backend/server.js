import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT ?? 4000);
const HOST = process.env.HOST ?? '0.0.0.0';

const dbPath = fileURLToPath(new URL('./data/db.json', import.meta.url));
const routesPath = fileURLToPath(new URL('./routes.json', import.meta.url));

const args = ['json-server', dbPath, '--port', String(PORT), '--host', HOST, '--watch', '--routes', routesPath];

console.log(`[backend] starting json-server on http://${HOST}:${PORT}`);
console.log(`[backend] DB: ${dbPath}`);
console.log(`[backend] routes: ${routesPath} (/api/v1/* -> /*, reserved for API agent)`);
console.log(`[backend] cmd: npx ${args.join(' ')}`);

const child = spawn('npx', args, { stdio: 'inherit' });

child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (err) => {
  console.error('[backend] failed to start:', err);
  process.exit(1);
});
