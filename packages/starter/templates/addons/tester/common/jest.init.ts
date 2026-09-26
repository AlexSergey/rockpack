import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(__dirname, './.env.test');

// Variables already set in the environment win over the file, as with dotenv.
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}
