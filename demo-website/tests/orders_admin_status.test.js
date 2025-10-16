import request from "supertest";
import { setupTestServer, teardownDb } from "./setup.js";

let app;
let sellerToken;
let customerToken;
let orderId;

beforeAll(async () => {
  app = await setupTestServer();
  await request(app)
    .post("/api/register")
    .send({ name: "seller3", password: "pass123", role: "seller" })
    .expect(201);
  sellerToken = (
    await request(app)
      .post("/api/login")
      .send({ name: "seller3", password: "pass123" })
      .expect(200)
  ).body.token;
  await request(app)
    .post("/api/register")
    .send({ name: "customer3", password: "pass123" })
    .expect(201);
  customerToken = (
    await request(app)
      .post("/api/login")
      .send({ name: "customer3", password: "pass123" })
      .expect(200)
  ).body.token;

  const menuResponse = await request(app)
    .post("/api/menus")
    .set("Authorization", `Bearer ${sellerToken}`)
    .send({ name: "Menu B", price: 45 })
    .expect(201);

  const menuId = menuResponse.body._id || menuResponse.body.id;

  await request(app)
    .post("/api/cart/items")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({ menuId, qty: 1 })
    .expect(200);

  const orderResponse = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({})
    .expect(201);

  orderId = orderResponse.body._id || orderResponse.body.id;
});

afterAll(async () => {
  await teardownDb();
});

test("PUT /api/orders/:id/status -> 200 updates order status", async () => {
  const response = await request(app)
    .put(`/api/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${sellerToken}`)
    .send({ status: "preparing" })
    .expect(200);
  expect(response.body.status).toBe("preparing");
});
