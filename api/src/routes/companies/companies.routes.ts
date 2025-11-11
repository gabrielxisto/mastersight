import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuthenticated, isInCompany } from "@/lib/session";
import { writeFile } from "node:fs/promises";

import prisma from "@/prisma";
import path from "path";
import crypto from "node:crypto";

import companiesDepartments from "./companies.departments";
import companiesRoles from "./companies.roles";
import companiesTeam from "./companies.team";
import companiesCompetences from "./companies.competences";
import companiesFeedbacks from "./companies.feedbacks";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.query as { id: string };
      if (!id) return reply.status(400).send({ error: "invalid-id" });

      const company = await prisma.companies.findUnique({
        where: { id: Number(id) },
      });

      if (!company)
        return reply.status(404).send({ error: "company-not-found" });

      return reply.status(200).send({ company: { 
        ...company,
        departments: await prisma.companiesDepartments.findMany({ where: { companyId: company.id } }),
        roles: await prisma.companiesRoles.findMany({ where: { companyId: company.id } }),
      }});
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

      if (
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/webp"
      ) {
        return reply.status(400).send({ error: "invalid-format" });
      }

      const buffer = await file.toBuffer();
      const hash = crypto.randomBytes(16).toString("hex");
      const ext = file.mimetype.replace("image/", "");
      const cdnPath = process.env.CDN_PATH || path.join(process.cwd(), "public", "images");
      const filePath = path.join(
        cdnPath,
        "images",
        "companies",
        `${hash}.${ext}`,
      );
      
      await writeFile(filePath, buffer);
      return reply.status(200).send({ hash: `${hash}.${ext}` });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "internal-server-error" });
    }
  });

  fastify.post("/update", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id, name, cnpj, address, color, image } = req.body as {
        id: number;
        name?: string;
        cnpj?: string;
        address?: string;
        color?: string;
        image?: string;
      };

      const user = await isAuthenticated({ fastify, request: req });
      if (!user) return reply.status(401).send({ error: "unauthorized" });

      const company = await prisma.companies.findUnique({
        where: { id: Number(id) },
      });
      if (!company)
        return reply.status(404).send({ error: "company-not-found" });

      const inCompany = await isInCompany({ userId: user.id, companyId: id });
      if (!inCompany) return reply.status(403).send({ error: "forbidden" });

      const companyUpdates = await prisma.companies.update({
        where: {
          id: Number(id),
        },
        data: {
          name: name || company.name,
          cnpj: cnpj || company.cnpj,
          address: address || company.address,
          color: color || company.color,
          image: image || company.image,
        },
      });

      return reply.status(200).send({ company: companyUpdates });
    } catch (err) {
      console.error(err);
    }
  });

  companiesDepartments(fastify);
  companiesRoles(fastify);
  companiesTeam(fastify);
  companiesCompetences(fastify);
  companiesFeedbacks(fastify);
}
