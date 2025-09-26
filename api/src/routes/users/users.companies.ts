import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { isAuthenticated } from "@/lib/session";
import prisma from "@/prisma";

export default async function (fastify: FastifyInstance) {
    fastify.get("/companies", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const companies = []
            const usersCompanies = await prisma.companiesUsers.findMany({
                where: {
                    userId: user.id
                }
            });

            for (const userCompany of usersCompanies) {
                const company = await prisma.companies.findUnique({
                    where: {
                        id: userCompany.companyId
                    }
                });

                if (company) companies.push({
                    ...company,
                    lastAccess: userCompany.lastAccess?.getTime() || undefined,
                    permissions: userCompany.permissions
                });
            }

            return reply.status(200).send({ companies });
        } catch (err) {
            console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/companies/last-access", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const { companyId } = req.body as { companyId: number };
            if (!companyId) return reply.status(400).send({ error: "invalid-company" });

            const record = await prisma.companiesUsers.findFirst({ where: { userId: user.id, companyId } });
            if (!record) return reply.status(404).send({ error: "user-not-in-company" });

            await prisma.companiesUsers.update({
                where: {
                    id: record.id
                },
                data: {
                    lastAccess: new Date()
                }
            });

            return reply.status(200).send({ success: true });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });
}