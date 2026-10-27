/**
 * Sobe um PostgreSQL embutido (sem Docker) para desenvolvimento local na Sprint 2.
 * Uso: node scripts/start-embedded-pg.mjs
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '.embedded-pg');
mkdirSync(dataDir, { recursive: true });

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'meritcoin',
  password: 'meritcoin',
  port: 5432,
  persistent: true,
});

async function main() {
  console.log('Inicializando PostgreSQL embutido em', dataDir);
  try {
    await pg.initialise();
  } catch (err) {
    // já inicializado
    if (!String(err?.message ?? err).toLowerCase().includes('already')) {
      console.warn('initialise:', err.message ?? err);
    }
  }

  await pg.start();
  try {
    await pg.createDatabase('meritcoin');
    console.log('Database meritcoin criada.');
  } catch {
    console.log('Database meritcoin já existe.');
  }

  console.log('');
  console.log('PostgreSQL embutido rodando em localhost:5432');
  console.log('DATABASE_URL=postgresql://meritcoin:meritcoin@localhost:5432/meritcoin?schema=public');
  console.log('Mantenha este processo aberto. Ctrl+C para parar.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
