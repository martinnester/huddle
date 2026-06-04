import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { SESSION_ID } from './contants';
export const load: PageServerLoad = async (e) => {
	const sessionId = e.cookies.get(SESSION_ID) ?? crypto.randomUUID();
	if (e.cookies.get(SESSION_ID) !== sessionId) {
		e.cookies.set(SESSION_ID, sessionId, {
			httpOnly: true,
			path: '/',
			secure: true,
			maxAge: 60 * 60 * 24
		});
	}
	const session =
		(await db.query.sessions.findFirst({
			where: {
				id: sessionId
			},
			with: {
				user: true
			}
		})) ??
		(await (async () => {
			const newSession = (
				await db
					.insert(sessions)
					.values({
						id: sessionId,
						userAgent: e.request.headers.get('user-agent'),
						ipAddress: e.getClientAddress(),
						userId: null
					})
					.returning()
			)[0]!;
			return { ...newSession, user: null };
		})());
	return session;
};
