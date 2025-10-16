import request from "supertest";
import { setupTestServer, teardownDb } from "./setup.js";

let app;
let sellerToken;
let createdMenuId;

beforeAll(async () => {
  app = await setupTestServer();
  await request(app)
    .post("/api/register")
    .send({ name: "customer", password: "pass123" })
    .expect(201);
  await request(app)
    .post("/api/register")
    .send({ name: "seller", password: "pass123", role: "seller" })
    .expect(201);
  sellerToken = (
    await request(app)
      .post("/api/login")
      .send({ name: "seller", password: "pass123" })
      .expect(200)
  ).body.token;
});

afterAll(async () => {
  await teardownDb();
});

test("GET /api/menus -> 200 returns array", async () => {
  const response = await request(app).get("/api/menus").expect(200);
  expect(Array.isArray(response.body)).toBe(true);
});

test("POST /api/menus -> 201 creates menu", async () => {
  const response = await request(app)
    .post("/api/menus")
    .set("Authorization", `Bearer ${sellerToken}`)
    .send({ name: "Crepe", price: 50, description: "basic crepe" })
    .expect(201);
  createdMenuId = response.body._id || response.body.id;
  expect(createdMenuId).toBeTruthy();
});

test("GET /api/menus/:id -> 200 returns created menu", async () => {
  const response = await request(app)
    .get(`/api/menus/${createdMenuId}`)
    .expect(200);
  expect(response.body.name).toBe("Crepe");
});
