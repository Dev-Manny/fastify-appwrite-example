// User Schema
const User = {
  type: "object",
  properties: {
    $id: { tpye: "string" },
    name: { type: "string" },
    registration: { type: "number" },
    status: { type: "number" },
    email: { type: "string" },
    emailVerification: { type: "boolean" },
  },
};

// Create a user Schema
const postUserOpts = {
  schema: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string" },
        password: { type: "string" },
        name: { type: "string" },
      },
    },
    response: {
      201: User,
    },
  },
};

// Get a user Schema
const getUserOpts = {
  schema: {
    response: {
      200: User,
    },
  },
};

// Get all users Schema
const getUsersOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: User,
      },
    },
  },
};

async function userRoutes(fastify, opts) {
  await fastify.client
    .setEndpoint("http://localhost:4003/v1")
    .setProject("611274fe2b683")
    .setKey(
      "85dfd135face9124586ac3ece5b5ed6452f304f95a0f24e3022a57d0818d4ae5c171dd85e367ab32c606344b2b927e31cf596b59d069ae9b34120c36642d7a0df6730e3b82638d7967586ee2a8ed59f9db67dc4ec3e64d3067f6e9000799275f3bdbdb65d5bf0b54ddd31facaeb77bea62d0a5974a647587bbcc785e7f81935f"
    );

  /**
   * List Users
   *
   * Get a list of all the project's users. You can use the query params to
   * filter your results.
   *
   * @param {string} search
   * @param {number} limit
   * @param {number} offset
   * @param {string} orderType
   */
  fastify.get("/users", getUsersOpts, async (req, reply) => {
    const result = await fastify.user.list();
    reply.code(result.status).send(result.response.users);
  });

  /**
   * Get User
   *
   * Get a user by its unique ID.
   *
   * @param {string} userId
   * @returns {Promise}
   */
  fastify.get("/users/:id", getUserOpts, async (req, reply) => {
    const { id } = req.params;
    const result = await fastify.user.get(id);
    console.log(result);
    if (result.status != 200) {
      return reply.code(result.status).send(result.data);
    }
    reply.code(result.status).send(result.response);
  });

  /**
   * Create User
   *
   * Create a new user.
   *
   * @param {string} email
   * @param {string} password
   * @param {string} name
   */
  fastify.post("/users", postUserOpts, async (req, reply) => {
    const { email, password, name } = req.body;
    const result = await fastify.user.create(email, password, name);
    if (result.status != 201) {
      return reply.code(result.status).send(result.data);
    }
    reply
      .code(result.status)
      .send({ id: result.response["$id"], ...result.response });
  });

  /**
   * Delete User
   *
   * Delete a user by its unique ID.
   *
   * @param {string} userId
   */
  fastify.delete("/users/:id", getUserOpts, async (req, reply) => {
    const { id } = req.params;
    const result = await fastify.user.delete(id);
    reply.code(result.status).send(result.data);
  });
}

module.exports = userRoutes;
