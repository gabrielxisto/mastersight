import 'dotenv/config';
import 'module-alias/register';
import Fastify from 'fastify';
import multipart from "@fastify/multipart";
import cookie from '@fastify/cookie';
import cors from "@fastify/cors";
import jwt from '@fastify/jwt';
import routes from './routes';
const app = Fastify();

app.register(multipart);
app.register(cookie);
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey',
});

app.register(cors, {
  origin: process.env.FRONTEND_ENDPOINT,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

app.get('/', async (_, reply) => {
  reply.status(200).send('API is running');
});

const start = async() => {
  try {
    await app.listen({ port: (Number(process.env.PORT) || 8080) });
    console.log(`[Server] - Listening on port ${process.env.PORT || 8080}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

routes(app)
start()