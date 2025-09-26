import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Admin, User } from "@/types";

import { isAuthenticated } from "@/lib/session";
import { writeFile } from "node:fs/promises";
import { hash } from "bcryptjs";
import { isEmail, isStrongPassword } from "validator";

import prisma from "@/prisma";
import path from "path";
import crypto from "node:crypto";

import usersCompanies from "./users.companies";

export default async function (fastify: FastifyInstance) {
	fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {		
		try {
            const user = await isAuthenticated({ fastify, request: req });
			if (!user) return reply.status(401).send({ error: "unauthorized" });

			let userData: User | Admin | null = null;

			if (user.admin) {
				userData = await prisma.admins.findUnique({ where: { id: user.id } });
			} else {
				userData = await prisma.users.findUnique({ where: { id: user.id } });
			}

			if (!userData) return reply.status(404).send({ error: "user-not-found" });
			return reply.status(200).send({ user: userData });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.post("/create", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const { name, email, cpf, password } = req.body as {
				name: string;
				email: string;
				cpf: string;
				password: string;
			};

			if (!isEmail(email)) return reply.status(400).send({ error: "invalid-email" });
			if (!isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})) return reply.status(400).send({ error: "weak-password" });

			const existingEmail = await prisma.users.findUnique({ where: { email: email } });
			if (existingEmail) return reply.status(400).send({ error: "email-already-registered" });

			const existingCpf = await prisma.users.findUnique({ where: { cpf: cpf } });
			if (existingCpf) return reply.status(400).send({ error: "cpf-already-registered" });

			const hashedPassword = await hash(password, 10);
			const newUser = await prisma.users.create({
				data: {
					name,
					email,
					cpf,
					password: hashedPassword,
				},
			});

			const token = fastify.jwt.sign({ id: newUser.id, user: true });
			reply.setCookie("mastersight-access", token, { httpOnly: true, path: "/" });
            return reply.status(200)
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.post("/update", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
            const user = await isAuthenticated({ fastify, request: req });
			if (!user) return reply.status(401).send({ error: "unauthorized" });

			const { name, cpf, birthday, image, description } = req.body as { [key: string]: string };

			const userData = await prisma.users.findUnique({ where: { id: user.id } });
			if (!userData) return reply.status(404).send({ error: "user-not-found" });

			const updateData: { [key: string]: string } = {};

			if (name) updateData.name = name;
			if (cpf) updateData.cpf = cpf;
			if (birthday) updateData.birthday = birthday;
			if (image) updateData.image = image;
			if (description) updateData.description = description;

			const updatedUser = await prisma.users.update({
				where: { id: user.id },
				data: updateData,
			});

			return reply.status(200).send({ user: updatedUser });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});
	
	fastify.post("/update-password", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
			const user = await isAuthenticated({ fastify, request: req });
			if (!user) return reply.status(401).send({ error: "unauthorized" });
			
			const { password } = req.body as { password: string };
	
			if (!isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})) return reply.status(400).send({ error: "weak-password" });

			const userData = await prisma.users.findUnique({ where: { id: user.id } });
			if (!userData) return reply.status(404).send({ error: "user-not-found" });

			const hashedPassword = await hash(password, 10);

			await prisma.users.update({
				where: { id: user.id },
				data: {
					password: hashedPassword,
				},
			});

			return reply.status(200).send({ success: true });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	fastify.post("/upload-image", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const file = await req.file();
				
			const user = await isAuthenticated({ fastify, request: req });
			if (!user) return reply.status(401).send({ error: "unauthorized" });

			if (!file) return reply.status(400).send({ error: "no-file" });
			if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" && file.mimetype !== "image/webp") {
				return reply.status(400).send({ error: "invalid-format" });
			}

			const buffer = await file.toBuffer();
			const hash = crypto.randomBytes(16).toString("hex");
			const ext = file.mimetype.replace("image/", "");
			const cdnPath = process.env.CDN_PATH || path.join(process.cwd(), "public", "images");
			const filePath = path.join(cdnPath, 'images', 'users', `${hash}.${ext}`);
			await writeFile(filePath, buffer);

			return reply.status(200).send({ hash: `${hash}.${ext}` });
		} catch (err) {
			console.error(err);
			return reply.status(500).send({ error: "internal-server-error" });
		}
	});

	usersCompanies(fastify);
}
