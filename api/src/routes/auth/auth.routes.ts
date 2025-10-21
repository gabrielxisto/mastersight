import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Admin, User } from "@/types";

import { sendResetPasswordEmail } from "@/services/mailer.service";
import { hash, compare } from "bcrypt";
import prisma from "@/prisma";

import authGoogle from "./auth.google";

export default async function(fastify: FastifyInstance) {
	fastify.post("/credentials", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const { email, password, type } = req.body as { email: string; password: string; type: "admins" | "users" };

			let user: User | Admin | null = null;
			if (type === "admins") {
				user = await prisma.admins.findUnique({ where: { email } });
			} else {
				user = await prisma.users.findUnique({ where: { email } });
			}

			if (!user || !user.password) return reply.status(401).send({ error: "user-not-exists" });

			const match = await compare(password, user.password);
			if (!match) return reply.status(401).send({ error: "invalid-credentials" });

			const token = fastify.jwt.sign({ id: user.id, user: true });
			reply.setCookie("mastersight-access", token, { httpOnly: true, path: "/" });
            
			return reply.status(200).send({ success: true });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.post("/logout", async (_, reply: FastifyReply) => {
		try {
			reply.clearCookie("mastersight-access", { path: "/" });
			return reply.status(200).send({ message: "logged-out" });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.post("/forgot-password", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const { email } = req.body as { email: string };
		
			const user = await prisma.users.findUnique({ where: { email } });
			if (!user) return reply.status(404).send({ error: "user-not-found" });

			const token = (Math.random() + 1).toString(36).substring(2);
			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 1);

			await prisma.passwordResets.create({
				data: {
					email,
					token,
					expiresAt,
				}
			});

			sendResetPasswordEmail({
				email,
				name: user.name,
				token
			});

			return reply.status(200).send({ success: true });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.get("/validate-token", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const { token } = req.query as { token: string };

			const resetData = await prisma.passwordResets.findUnique({ where: { token } });
			if (!resetData) return reply.status(404);
			if (resetData.expiresAt < new Date()) return reply.status(400).send({ error: "token-expired" });

			return reply.status(200).send({ email: resetData?.email });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.post("/reset-password", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const { token, password } = req.body as { token: string; password: string };

			const resetData = await prisma.passwordResets.findUnique({ where: { token } });
			if (!resetData) return reply.status(404).send({ error: "token-not-found" });
			if (resetData.expiresAt < new Date()) return reply.status(400).send({ error: "token-expired" });

			const hashedPassword = await hash(password, 10);

			await prisma.users.updateMany({
				where: { email: resetData.email },
				data: { password: hashedPassword },
			});

			reply.clearCookie("mastersight-access", { path: "/" });
			return reply.status(200).send({ message: "password-updated" });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	authGoogle(fastify);
}
