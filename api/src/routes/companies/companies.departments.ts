import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Department } from "@/types";

import { isAuthenticated, isInCompany } from "@/lib/session";
import { formatCurrency } from "@/lib/misc";

import prisma from "@/prisma";

export default async function (fastify: FastifyInstance) {
    fastify.get("/departments", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = req.query as { companyId: string };
            if (!companyId) return reply.status(400).send({ error: "invalid-company-id" });
        
            const departments = await prisma.companiesDepartments.findMany({ where: { companyId: Number(companyId) } });
            const roles = await prisma.companiesRoles.findMany({ where: { companyId: Number(companyId) } });
            const users = await prisma.companiesUsers.findMany({ where: { companyId: Number(companyId) } });

            const data = departments.map((department: Department) => {
                const departmentRoles = roles.filter(role => role.departmentId === department.id);
                const departmentRoleIds = departmentRoles.map(role => role.id);
                const departmentUsers = users.filter(user => departmentRoleIds.includes(user.role));
                
                return {
                    ...department,
                    roles: departmentRoles.length,
                    users: departmentUsers.length,
                };
            });

            return reply.status(200).send({ departments: data });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/departments/create", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId, name, description, salary } = req.body as { companyId: number, name: string, description: string, salary: string };
                        
            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const formattedSalary = formatCurrency(salary);

            const inCompany = await isInCompany({ userId: user.id, companyId });
            if (!inCompany) return reply.status(403).send({ error: "forbidden" });

            if (!companyId) return reply.status(400).send({ error: "invalid-company-id" });
            if (!name || name.length < 2) return reply.status(400).send({ error: "invalid-name" });
            if (!salary || formattedSalary < 0) return reply.status(400).send({ error: "invalid-salary" });
            
            const department = await prisma.companiesDepartments.create({
                data: {
                    companyId,
                    name,
                    description,
                    salary: formattedSalary
                }
            });

            return reply.status(200).send({ department });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/departments/update", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id, companyId, name, description, salary } = req.body as { id: number, companyId: number, name?: string, description?: string, salary?: string };
            
            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const inCompany = await isInCompany({ userId: user.id, companyId });
            if (!inCompany) return reply.status(403).send({ error: "forbidden" });

            const formattedSalary = formatCurrency(salary || "0");

            if (!name || name.length < 2) return reply.status(400).send({ error: "invalid-name" });
            if (!salary || formattedSalary < 0) return reply.status(400).send({ error: "invalid-salary" });

            await prisma.companiesDepartments.update({
                where: { id, companyId },
                data: {
                    name,
                    description,
                    salary: formattedSalary
                }
            });

            return reply.status(200).send({ success: true });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/departments/delete", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id, companyId } = req.body as { id: number, companyId: number };

            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });
            
            const inCompany = await isInCompany({ userId: user.id, companyId });
            if (!inCompany) return reply.status(403).send({ error: "forbidden" });
            
            await prisma.companiesDepartments.delete({ where: { id, companyId } });

            return reply.status(200).send({ success: true });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });
}