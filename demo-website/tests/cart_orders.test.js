import request from "supertest";
import { setupTestServer, teardownDb } from "./setup.js";

let app;
let customerToken;
let createdOrderId;

beforeAll(async () => {
  app = await setupTestServer();
  await request(app)
    .post("/api/register")
    .send({ name: "buyer", password: "pass123" })
    .expect(201);
  customerToken = (
    await request(app)
      .post("/api/login")
      .send({ name: "buyer", password: "pass123" })
      .expect(200)
  ).body.token;
  await request(app)
    .post("/api/register")
    .send({ name: "seller2", password: "pass123", role: "seller" })
    .expect(201);
  const sellerToken = (
    await request(app)
      .post("/api/login")
      .send({ name: "seller2", password: "pass123" })
      .expect(200)
  ).body.token;

  await request(app)
    .post("/api/menus")
    .set("Authorization", `Bearer ${sellerToken}`)
    .send({ name: "Menu A", price: 100, description: "desc" })
    .expect(201);
});

afterAll(async () => {
  await teardownDb();
});

test("POST /api/cart/items -> 200 adds item", async () => {
  const menus = await request(app).get("/api/menus").expect(200);
  const menuId = menus.body[0]._id || menus.body[0].id;
  const response = await request(app)
    .post("/api/cart/items")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({ menuId, qty: 2 })
    .expect(200);
  expect(response.body).toBeTruthy();
});

test("GET /api/cart -> 200 returns cart", async () => {
  const response = await request(app)
    .get("/api/cart")
    .set("Authorization", `Bearer ${customerToken}`)
    .expect(200);
  expect(response.body).toBeDefined();
});

test("POST /api/orders -> 201 creates order from cart", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({ note: "no sugar" })
    .expect(201);
  createdOrderId = response.body._id || response.body.id;
  expect(createdOrderId).toBeTruthy();
});

test("GET /api/orders/latest -> 200 returns latest order", async () => {
  const response = await request(app)
    .get("/api/orders/latest")
    .set("Authorization", `Bearer ${customerToken}`)
    .expect(200);
  expect(Array.isArray(response.body.items)).toBe(true);
});
