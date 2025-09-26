import type { FastifyInstance } from "fastify";
import authRoutes from "./auth/auth.routes";
import usersRoutes from './users/users.routes';
import companiesRegister from './companies/companies.routes';

export default async function (app: FastifyInstance) {
	app.register(authRoutes, { prefix: "/auth" });
	app.register(usersRoutes, { prefix: '/users' });
	app.register(companiesRegister, { prefix: '/companies' });
}
