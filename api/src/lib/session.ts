import type { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "@/prisma";

export const isAuthenticated = async ({ fastify, request }: {fastify: FastifyInstance, request: FastifyRequest}) => {
	if (!request || !request.cookies["mastersight-access"]) return false;
	const user = await fastify.jwt.verify<{ id: number; admin: boolean }>(request.cookies["mastersight-access"]);
	if (!user) return false;
    
    return user;
}

export const isInCompany = async ({userId, companyId}: {userId: number, companyId: number}) => {
	const user = await prisma.companiesUsers.findFirst({
		where: {
			userId,
			companyId
		}
	})

	if (!user) return false;
	return true;
}