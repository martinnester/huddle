import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';
// import { timestamps } from './columns.helpers';

export const users = pgTable('users', {
	id: uuid().primaryKey().defaultRandom(),
	username: text().notNull(),
	hashedPassword: text().notNull()
});

export const sessions = pgTable('sessions', {
	id: uuid().primaryKey(),
	userAgent: text(),
	ipAddress: text().notNull(),
	userId: uuid()
});

export const relations = defineRelations(
	{
		users,
		sessions
	},
	(r) => ({
		sessions: {
			user: r.one.users({
				from: r.sessions.userId,
				to: r.users.id
			})
		},
		users: {
			sessions: r.many.sessions({
				from: r.users.id,
				to: r.sessions.userId
			})
		}
	})
);
