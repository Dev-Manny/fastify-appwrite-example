const fastify = require("fastify")({ logger: true });
const fastifyAppwrite = require("fastify-appwrite");
fastify.register(require("fastify-swagger"), {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "fastify-api" },
  },
});
const PORT = 5000;


fastify.register(fastifyAppwrite);
fastify.register(require("./routes/users"));

const start = async () => {
  
  await fastify.ready();
   
  try {
    await fastify.listen(PORT);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
