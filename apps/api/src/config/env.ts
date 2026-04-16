import { config } from 'dotenv';

config({ path: '../../.env' });

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  apiPort: getEnv('API_PORT'),
  webAppUrl: getEnv('WEB_APP_URL', 'http://localhost:4200'),
};
