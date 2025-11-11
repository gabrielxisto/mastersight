import { isAuthenticated } from "@/lib/session";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "@/prisma";

export default async function (fastify: FastifyInstance) {
    fastify.post(
        "/feedbacks/delete",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const { feedbackId } = req.body as { feedbackId: number };

                if (!feedbackId) return reply.status(400).send({ error: "invalid-feedback-id" });

                const user = await isAuthenticated({ fastify, request: req });
                if (!user) return reply.status(401).send({ error: "unauthorized" });
            
                const feedbackExists = await prisma.companiesFeedbacks.findUnique({
                    where: { 
                        id: feedbackId
                    },
                });

                if (!feedbackExists) return reply.status(404).send({ error: "feedback-not-found" });

                await prisma.companiesFeedbacks.delete({ where: { id: feedbackId } });

                return reply.status(200).send({ message: "feedback-deleted" })
            } catch (err) {
                console.error(err);
                return reply.status(500).send({ error: "internal-server-error" });
            } 
        },
    );

    fastify.post(
        "/feedbacks/add",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const {
                    userId,
                    creatorId,
                    companyId,
                    score,
                    content
                } = req.body as {
                    userId: number;
                    creatorId: number;
                    companyId: number;
                    score: string;
                    content: string;
                }

                const user = await isAuthenticated({ fastify, request: req });
                if (!user) return reply.status(401).send({ error: "unauthorized" });

                await prisma.companiesFeedbacks.create({
                    data: {
                        userId,
                        creatorId,
                        companyId,
                        score: Number(score),
                        content
                    },
                });

                return reply.status(200).send({ message: "feedback-added" });
            } catch (err) {
                console.error(err);
                return reply.status(500).send({ error: "internal-server-error" });
            }
        },
    );
}   
