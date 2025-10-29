import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UserData } from "@/types";

import { isAuthenticated, isInCompany } from "@/lib/session";

import prisma from "@/prisma";
import { hash } from "bcryptjs";
import {
    sendCreatedUserEmail,
    sendInviteUserEmail,
} from "@/services/mailer.service";

export default async function (fastify: FastifyInstance) {
    fastify.get("/team", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = req.query as { companyId: string };
            if (!companyId)
                return reply.status(400).send({ error: "invalid-company-id" });

            const users = await prisma.companiesUsers.findMany({
                where: { companyId: Number(companyId) },
            });

            const data = await Promise.all(
                users.map(async (user) => {
                    const userInfos = await prisma.users.findUnique({
                        where: { id: user.userId },
                    });

                    const userAdmin = await prisma.admins.findFirst({
                        where: {
                            email: userInfos?.email || "",
                        }
                    });

                    return {
                        ...user,
                        name: userInfos?.name || "Usuário deletado",
                        email: userInfos?.email || "E-mail indisponível",
                        cpf: userInfos?.cpf || "CPF indisponível",
                        description: userInfos?.description || "",
                        image: userInfos?.image || null,
                        department: user.department,
                        admin: !!userAdmin,
                    };
                }),
            );

            return reply.status(200).send({ team: data });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post(
        "/team/add",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const {
                    companyId,
                    email,
                    name,
                    department,
                    role,
                    permissions,
                } = req.body as {
                    companyId: number;
                    email: string;
                    name: string;
                    department: number;
                    role: number;
                    permissions: string[];
                };

                const user = await isAuthenticated({ fastify, request: req });
                if (!user)
                    return reply.status(401).send({ error: "unauthorized" });

                const inCompany = await isInCompany({
                    userId: user.id,
                    companyId,
                });
                if (!inCompany)
                    return reply.status(403).send({ error: "forbidden" });

                const companyData = await prisma.companies.findUnique({
                    where: { id: companyId },
                });
                if (!companyData)
                    return reply
                        .status(404)
                        .send({ error: "company-not-found" });

                if (!email)
                    return reply.status(400).send({ error: "invalid-email" });
                if (!name || name.length < 3)
                    return reply.status(400).send({ error: "invalid-name" });
                if (!department)
                    return reply
                        .status(400)
                        .send({ error: "invalid-department-id" });
                if (!role)
                    return reply.status(400).send({ error: "invalid-role-id" });

                const userExists = await prisma.users.findUnique({
                    where: { email },
                });

                if (!userExists) {
                    if (
                        companyData.domain &&
                        email.includes(companyData.domain)
                    ) {
                        const randomPassword = Math.random()
                            .toString(36)
                            .slice(-8);
                        const hashedPassword = await hash(randomPassword, 10);

                        const userData = await prisma.users.create({
                            data: {
                                email,
                                name,
                                password: hashedPassword,
                                cpf: "000.000.000-00",
                            },
                        });

                        await prisma.companiesUsers.create({
                            data: {
                                userId: userData.id,
                                companyId,
                                role: Number(role),
                                department: Number(department),
                                permissions,
                                status: "active",
                            },
                        });

                        sendCreatedUserEmail({
                            email,
                            name,
                            password: randomPassword,
                        });

                        return reply
                            .status(200)
                            .send({ message: "user-created-and-added" });
                    }

                    return reply.status(400).send({ error: "user-not-exists" });
                }

                const alreadyInCompany = await isInCompany({
                    userId: userExists.id,
                    companyId,
                });

                if (alreadyInCompany)
                    return reply
                        .status(400)
                        .send({ error: "user-already-in-company" });

                const userData = await prisma.users.findUnique({
                    where: { id: user.id },
                });

                await prisma.companiesUsers.create({
                    data: {
                        userId: userExists.id,
                        companyId,
                        role: Number(role),
                        department: Number(department),
                        permissions,
                        status: "invited",
                    },
                });

                sendInviteUserEmail({
                    email: userExists.email,
                    name: userExists.name,
                    inviter: userData?.name || "Um usuário",
                    company: companyData.name,
                });

                return reply.status(200).send({ message: "user-invited" });
            } catch (err) {
                console.error(err);
                return reply
                    .status(500)
                    .send({ error: "internal-server-error" });
            }
        },
    );

    fastify.post(
        "/team/remove",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const { companyId, userId } = req.body as {
                    companyId: number;
                    userId: number;
                };

                if (!companyId)
                    return reply
                        .status(400)
                        .send({ error: "invalid-company-id" });
                if (!userId)
                    return reply.status(400).send({ error: "invalid-user-id" });

                const user = await isAuthenticated({ fastify, request: req });
                if (!user)
                    return reply.status(401).send({ error: "unauthorized" });

                const inCompany = await isInCompany({
                    userId: user.id,
                    companyId,
                });
                if (!inCompany)
                    return reply.status(403).send({ error: "forbidden" });

                await prisma.companiesUsers.delete({
                    where: { companyId, id: userId },
                });

                await prisma.companiesTasks.deleteMany({
                    where: { companyId, userId },
                });

                await prisma.companiesFeedbacks.deleteMany({
                    where: { companyId, userId },
                });

                return reply.status(200).send({ success: true });
            } catch (err) {
                console.error(err);
                return reply
                    .status(500)
                    .send({ error: "internal-server-error" });
            }
        },
    );

    fastify.post(
        "/team/edit",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const { companyId, userId, department, role, salary, permissions } = req.body as {
                    companyId: number;
                    userId: number;
                    department: string;
                    role: string;
                    salary: string;
                    permissions: string[];
                };

                if (!companyId)
                    return reply
                        .status(400)
                        .send({ error: "invalid-company-id" });

                if (!userId)
                    return reply.status(400).send({ error: "invalid-user-id" });

                const user = await isAuthenticated({ fastify, request: req });
                if (!user)
                    return reply.status(401).send({ error: "unauthorized" });

                const inCompany = await isInCompany({
                    userId: user.id,
                    companyId,
                });

                if (!inCompany)
                    return reply.status(403).send({ error: "forbidden" });

                await prisma.companiesUsers.updateMany({
                    where: {
                        companyId,
                        id: userId,
                    },
                    data: {
                        department: Number(department),
                        role: Number(role),
                        salary: salary ? Number.parseFloat(salary.replace(/\D/g, '')) / 100 : 0,
                        permissions,
                    },
                });

                return reply.status(200).send({ message: "user-edited" });
            } catch (err) {
                console.error(err);
                return reply
                    .status(500)
                    .send({ error: "internal-server-error" });
            }
        },
    );
}
