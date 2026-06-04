if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';
import { relations } from './schema';

export const db = drizzle(env.DATABASE_URL, { relations });
