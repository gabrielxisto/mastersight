import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import oauth2 from "@fastify/oauth2";
import prisma from "@/prisma";

export default async function (fastify: FastifyInstance) {
    fastify.register(oauth2, {
        name: "googleOAuth2",
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID!,
                secret: process.env.GOOGLE_CLIENT_SECRET!,
            },
            auth: {
                authorizeHost: "https://accounts.google.com",
                authorizePath: "/o/oauth2/v2/auth",
                tokenHost: "https://oauth2.googleapis.com",
                tokenPath: "/token",
            },
        },
        scope: ["profile", "email"],
        startRedirectPath: "/google",
        callbackUri: "http://localhost:8080/auth/google/callback",
    });

    fastify.get(
        "/google/callback",
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const callback =
                    await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                        req,
                    );
                if (!callback?.token?.access_token)
                    return reply.status(401).send({ error: "invalid-token" });

                const profile = await fetch(
                    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${callback.token.access_token}`,
                ).then((res) => res.json());

                let user = await prisma.users.findFirst({
                    where: {
                        email: profile.email,
                    },
                });

                if (!user) {
                    user = await prisma.users.create({
                        data: {
                            email: profile.email,
                            name: profile.name,
                            cpf: "000.000.000-00",
                        },
                    });
                }

                const jwtToken = fastify.jwt.sign({ id: user.id });

                reply.setCookie("mastersight-access", jwtToken, {
                    httpOnly: true,
                    path: "/",
                });

                return reply.redirect(
                    `${process.env.FRONTEND_ENDPOINT}/dashboard`,
                );
            } catch (err) {
                console.error(err);
                return reply
                    .status(500)
                    .send({ error: "internal-server-error" });
            }
        },
    );
}
