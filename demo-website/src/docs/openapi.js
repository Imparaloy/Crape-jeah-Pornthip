// OpenAPI 3.0 specification for the API
export default {
  openapi: "3.0.3",
  info: {
    title: "Crape-jeah API",
    description:
      "REST API documentation for authentication, menus, cart, and orders. All routes are mounted under /api.",
    version: "1.0.0",
  },
  servers: [{ url: "/api", description: "Current server" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          role: { type: "string", enum: ["customer", "seller", "admin"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Menu: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          categoryId: { type: "string" },
          isRecommended: { type: "boolean" },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          menuId: { type: "string" },
          qty: { type: "integer" },
          note: { type: "string" },
        },
        required: ["menuId", "qty"],
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string", nullable: true },
                nameSnap: { type: "string" },
                unitPriceSnap: { type: "number" },
                quantity: { type: "integer" },
                detailsSnap: { type: "string" },
                linePrice: { type: "number" },
                toppings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nameSnap: { type: "string" },
                      priceSnap: { type: "number" },
                    },
                  },
                },
              },
            },
          },
          totalPrice: { type: "number" },
          status: {
            type: "string",
            enum: ["pending", "preparing", "completed"],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  password: { type: "string" },
                  phone: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["customer", "seller", "admin"],
                  },
                },
                required: ["name", "password"],
              },
              example: {
                name: "alice",
                password: "secret",
                phone: "0800000000",
                role: "customer",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and get token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  password: { type: "string" },
                },
                required: ["name", "password"],
              },
              example: { name: "alice", password: "secret" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (clears cookie token)",
        responses: { 200: { description: "OK" } },
      },
    },
    "/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
        },
      },
    },

    "/menus": {
      get: {
        tags: ["Menu"],
        summary: "List menus",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Menu" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Menu"],
        summary: "Create menu (seller only)",
        responses: { 201: { description: "Created" } },
      },
    },
    "/menus/{id}": {
      get: {
        tags: ["Menu"],
        summary: "Get menu by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
      put: {
        tags: ["Menu"],
        summary: "Update menu (seller only)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Menu"],
        summary: "Delete menu (seller only)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 204: { description: "No Content" } },
      },
    },

    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get my cart",
        responses: { 200: { description: "OK" } },
      },
    },
    "/cart/items": {
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CartItem" },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/cart/custom": {
      post: {
        tags: ["Cart"],
        summary: "Add custom item to cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  custom: { type: "object" },
                  qty: { type: "integer" },
                  note: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/cart/items/{itemMenuId}": {
      put: {
        tags: ["Cart"],
        summary: "Update cart item qty",
        parameters: [
          {
            name: "itemMenuId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove cart item",
        parameters: [
          {
            name: "itemMenuId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/cart/clear": {
      post: {
        tags: ["Cart"],
        summary: "Clear my cart",
        responses: { 200: { description: "OK" } },
      },
    },

    "/orders": {
      get: {
        tags: ["Order"],
        summary: "List my orders",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Order"],
        summary: "Create order from my cart",
        requestBody: { required: false },
        responses: { 201: { description: "Created" } },
      },
    },
    "/orders/latest": {
      get: {
        tags: ["Order"],
        summary: "Get my latest order",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Order"],
        summary: "Get order by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Order"],
        summary: "Update order status (seller)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "preparing", "completed"],
                  },
                },
                required: ["status"],
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
  },
};
