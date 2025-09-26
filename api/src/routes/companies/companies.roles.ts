import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "types";

import { isAuthenticated, isInCompany } from "@/lib/session";
import { formatCurrency } from "@/lib/misc";

import prisma from "@/prisma";

export default async function (fastify: FastifyInstance) {
    fastify.get("/roles", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = req.query as { companyId: string };
            if (!companyId) return reply.status(400).send({ error: "invalid-company-id" });
        
            const departments = await prisma.companiesDepartments.findMany({ where: { companyId: Number(companyId) } });
            const roles = await prisma.companiesRoles.findMany({ where: { companyId: Number(companyId) } });
            const users = await prisma.companiesUsers.findMany({ where: { companyId: Number(companyId) } });

            const data = roles.map((role: Role) => {
                const roleDepartment = departments.find(department => department.id === role.departmentId);
                const roleUsers = users.filter(user => user.role === role.id);
                
                return {
                    ...role,
                    department: roleDepartment ? roleDepartment.name : "",
                    users: roleUsers.length,
                };
            });

            return reply.status(200).send({ roles: data });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/roles/create", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId, name, departmentId, salary } = req.body as { companyId: number, name: string, departmentId: number, salary: string };
                        
            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const formattedSalary = formatCurrency(salary);

            const inCompany = await isInCompany({ userId: user.id, companyId });
            if (!inCompany) return reply.status(403).send({ error: "forbidden" });

            if (!departmentId) return reply.status(400).send({ error: "invalid-department-id" });
            if (!name || name.length < 3) return reply.status(400).send({ error: "invalid-name" });
            if (!salary || formattedSalary < 0) return reply.status(400).send({ error: "invalid-salary" });

            const role = await prisma.companiesRoles.create({
                data: {
                    companyId,
                    name,
                    departmentId,
                    salary: formattedSalary
                }
            });

            return reply.status(200).send({ role });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/roles/update", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id, companyId, name, departmentId, salary } = req.body as { id: number, companyId: number, name: string, departmentId: number, salary: string };
            
            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const inCompany = await isInCompany({ userId: user.id, companyId });
            if (!inCompany) return reply.status(403).send({ error: "forbidden" });

            const formattedSalary = formatCurrency(salary);
        
            if (!departmentId) return reply.status(400).send({ error: "invalid-department-id" });
            if (!name || name.length < 3) return reply.status(400).send({ error: "invalid-name" });
            if (!salary || formattedSalary < 0) return reply.status(400).send({ error: "invalid-salary" });

            await prisma.companiesRoles.update({
                where: { id, companyId },
                data: {
                    name,
                    departmentId,
                    salary: formattedSalary
                }
            });

            return reply.status(200).send({ success: true });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });

    fastify.post("/roles/delete", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id, companyId } = req.body as { id: number, companyId: number };

            const user = await isAuthenticated({ fastify, request: req });
            if (!user) return reply.status(401).send({ error: "unauthorized" });

            const inCompany = await isInCompany({ userId: user.id, companyId });
            if (!inCompany) return reply.status(403).send({ error: "forbidden" });
            
            await prisma.companiesRoles.delete({ where: { id, companyId } });

            return reply.status(200).send({ success: true });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "internal-server-error" });
        }
    });
}