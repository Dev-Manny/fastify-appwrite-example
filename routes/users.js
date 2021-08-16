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

// Get users log Schema
const getUserLogsOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          logs: { type: "array" },
        },
      },
    },
  },
};

// Get users prefs Schema
const getUserPrefsOpts = {
  schema: {
    response: {
      200: {
        type: "object",
      },
    },
  },
};

// Update user prefs Schema
const updateUserPrefsOpts = {
  schema: {
    body: {
      type: "object",
    },
    response: {
      200: {
        type: "object",
      },
    },
  },
};

// Get users log Schema
const getUserSessionsOpts = {
  schema: {
    response: {
      200: {
        type: "object",
      },
    },
  },
};

async function userRoutes(fastify, opts) {
 
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

  /**
   * Get User Logs
   *
   * Get a user activity logs list by its unique ID.
   *
   * @param {string} userId
   */
  fastify.get("/users/:id/logs", getUserLogsOpts, async (req, reply) => {
    const { id } = req.params;
    const result = await fastify.user.getLogs(id);
    if (result.status != 200) {
      return reply.code(result.status).send(result.data);
    }
    reply.code(result.status).send(result.response);
  });

  /**
   * Get User Preferences
   *
   * Get the user preferences by its unique ID.
   *
   * @param {string} userId
   */
  fastify.get("/users/:id/prefs", getUserPrefsOpts, async (req, reply) => {
    const { id } = req.params;
    const result = await fastify.user.getPrefs(id);
    if (result.status != 200) {
      return reply.code(result.status).send(result.data);
    }
    reply.code(result.status).send(result.response);
  });

  /**
   * Get User Preferences
   *
   * Get the user preferences by its unique ID.
   *
   * @param {string} userId
   */
  fastify.patch("/users/:id/prefs", updateUserPrefsOpts, async (req, reply) => {
    const { id, prefs } = req.params;
    const result = await fastify.user.getPrefs(id, prefs);
    if (result.status != 200) {
      return reply.code(result.status).send(result.data);
    }
    reply.code(result.status).send(result.response);
  });

  /**
   * Get User Sessions
   *
   * Get the user sessions list by its unique ID.
   *
   * @param {string} userId
   */
  fastify.get(
    "/users/:id/sessions",
    getUserSessionsOpts,
    async (req, reply) => {
      const { id } = req.params;
      const result = await fastify.user.getSessions(id);
      if (result.status != 200) {
        return reply.code(result.status).send(result.data);
      }
      reply.code(result.status).send(result.response);
    }
  );
}

module.exports = userRoutes;
