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
  await fastify.client
  .setEndpoint("http://localhost:4003/v1")
  .setProject("611274fe2b683")
  .setKey(
    "85dfd135face9124586ac3ece5b5ed6452f304f95a0f24e3022a57d0818d4ae5c171dd85e367ab32c606344b2b927e31cf596b59d069ae9b34120c36642d7a0df6730e3b82638d7967586ee2a8ed59f9db67dc4ec3e64d3067f6e9000799275f3bdbdb65d5bf0b54ddd31facaeb77bea62d0a5974a647587bbcc785e7f81935f"
  );
   
  try {
    await fastify.listen(PORT);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
