import { form, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { SESSION_ID } from './contants';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const te = new TextEncoder();
const td = new TextDecoder();

export const login = form(
	v.object({
		username: v.pipe(v.string(), v.nonEmpty('Provide a username')),
		password: v.pipe(v.string(), v.nonEmpty('Provide a password'))
	}),
	async (data) => {
		const e = getRequestEvent();
		const digest = await crypto.subtle.digest('SHA-512', te.encode(data.password).buffer);
		const hashedPassword = td.decode(digest);
		const user = await db.query.users.findFirst({
			where: {
				username: data.username,
				hashedPassword
			}
		});
		if (!user) {
			return null;
		}
		const sessionId = e.cookies.get(SESSION_ID);
		if (!sessionId) {
			error(401, 'Request must have a session');
		}
		await db.update(sessions).set({ userId: user.id }).where(eq(sessions.id, sessionId));
		return { ...user, hashedPassword: null };
	}
);
