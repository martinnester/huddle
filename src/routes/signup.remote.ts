import { form, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { SESSION_ID } from './contants';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { sessions, users } from '$lib/server/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

const te = new TextEncoder();
const td = new TextDecoder();

export const signup = form(
	v.pipeAsync(
		v.objectAsync({
			username: v.pipeAsync(
				v.string(),
				v.minLength(3, 'Must have atleast 3 characters'),
				v.checkAsync(
					async (username) =>
						!(await db.query.users.findFirst({
							where: {
								username
							}
						})),
					'Username is already taken'
				)
			),
			password: v.pipe(v.string(), v.minLength(8, 'Must have atleast 8 characters')),
			confirmPassword: v.string()
		}),
		v.forward(
			v.partialCheck(
				[['password'], ['confirmPassword']],
				(input) => input.confirmPassword === input.password,
				'The passwords entered do not match'
			),
			['confirmPassword']
		)
	),
	async ({ username, password }) => {
		const e = getRequestEvent();
		const sessionId = e.cookies.get(SESSION_ID);
		if (!sessionId) {
			error(400, 'Session needed to sign up.');
		}
		const hashedPassword = td.decode(
			await crypto.subtle.digest('SHA-512', te.encode(password).buffer)
		);

		return await db.transaction(async (tx) => {
			const user = (await tx.insert(users).values({ username, hashedPassword }).returning())[0];
			await tx
				.update(sessions)
				.set({ userId: user?.id })
				.where(and(eq(sessions.id, sessionId), isNull(sessions.userId)));
			return user && { ...user, hashedPassword: null };
		});
	}
);
