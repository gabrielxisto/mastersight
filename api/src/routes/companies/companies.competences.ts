import { isAuthenticated } from "@/lib/session";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "@/prisma";

export default async function (fastify: FastifyInstance) {
    fastify.post(
        "/competences/delete",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const { 
                    userId, 
                    companyId,
                    competenceIndex 
                } = req.body as { 
                    userId: number;
                    companyId: number;
                    competenceIndex: number;
                };

                console.log(userId, companyId, competenceIndex);

                if (!userId) return reply.status(400).send({ error: "invalid-user-id" });
                if (!competenceIndex) return reply.status(400).send({ error: "invalid-competence-index" });

                const user = await isAuthenticated({ fastify, request: req });
                if (!user) return reply.status(401).send({ error: "unauthorized" });
            
                const userExists = await prisma.companiesUsers.findUnique({
                    where: { 
                        id: userId, 
                        companyId 
                    },
                });

                if (!userExists) return reply.status(404).send({ error: "user-not-found" });

                const competences = Array.isArray(userExists.competences) ? userExists.competences : [];
                if (Number(competenceIndex) < 0 || Number(competenceIndex) >= competences.length) {
                    return reply.status(400).send({ error: "competence-index-out-of-bounds" });
                }

                const updated = [
                    ...competences.slice(0, Number(competenceIndex)),
                    ...competences.slice(Number(competenceIndex) + 1),
                ];

                await prisma.companiesUsers.update({
                    where: { id: userId },
                    data: {
                        competences: updated
                    },
                });

                return reply.status(200).send({ message: "competence-deleted" })
            } catch (err) {
                console.error(err);
                return reply.status(500).send({ error: "internal-server-error" });
            } 
        },
    );

    fastify.post(
        "/competences/add",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const {
                    userId,
                    companyId,
                    title,
                    description,
                    documents
                } = req.body as {
                    userId: number;
                    companyId: number;
                    title: string;
                    description: string;
                    documents: string[];
                }

                const user = await isAuthenticated({ fastify, request: req });
                if (!user) return reply.status(401).send({ error: "unauthorized" });

                const userExists = await prisma.companiesUsers.findUnique({
                    where: {
                        id: userId,
                        companyId
                    },
                });

                if (!userExists) return reply.status(404).send({ error: "user-not-found" });

                await prisma.companiesUsers.update({
                    where: { id: userId },
                    data: {
                        competences: [
                            ...(Array.isArray(userExists.competences) ? userExists.competences : []),
                            {
                                title,
                                description,
                                documents
                            }
                        ]
                    },
                });

                return reply.status(200).send({ message: "competence-added" });
            } catch (err) {
                console.error(err);
                return reply.status(500).send({ error: "internal-server-error" });
            }
        },
    );

    fastify.post(
        "/competences/update",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const {
                    userId,
                    companyId,
                    competenceIndex,
                    title,
                    description,
                    documents
                } = req.body as {
                    userId: number;
                    companyId: number;
                    competenceIndex: number;
                    title: string;
                    description: string;
                    documents: string[];
                }

                const user = await isAuthenticated({ fastify, request: req });
                if (!user) return reply.status(401).send({ error: "unauthorized" });

                const userExists = await prisma.companiesUsers.findUnique({
                    where: {
                        id: userId,
                        companyId
                    },
                });

                if (!userExists) return reply.status(404).send({ error: "user-not-found" });

                const competences = Array.isArray(userExists.competences) ? userExists.competences : [];
                if (Number(competenceIndex) < 0 || Number(competenceIndex) >= competences.length) {
                    return reply.status(400).send({ error: "competence-index-out-of-bounds" });
                }

                competences[Number(competenceIndex)] = {
                    title,
                    description,
                    documents
                };

                await prisma.companiesUsers.update({
                    where: { id: userId },
                    data: {
                        competences
                    },
                });

                return reply.status(200).send({ message: "competence-updated" });
            } catch (err) {
                console.error(err);
                return reply.status(500).send({ error: "internal-server-error" });
            }
        },
    );
}   
