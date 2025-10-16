import request from "supertest";
import { setupTestServer, teardownDb } from "./setup.js";

let app;
let token;

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await teardownDb();
});

test("POST /api/register -> 201 creates user", async () => {
  const response = await request(app)
    .post("/api/register")
    .send({
      name: "tester",
      password: "pass123",
      phone: "0812345678",
      role: "customer",
    })
    .expect(201);
  expect(response.body).toHaveProperty("user");
  expect(response.body.user.name).toBe("tester");
});

test("POST /api/login -> 200 returns token", async () => {
  const response = await request(app)
    .post("/api/login")
    .send({ name: "tester", password: "pass123" })
    .expect(200);
  expect(response.body).toHaveProperty("token");
  token = response.body.token;
});

test("GET /api/me -> 200 returns profile", async () => {
  const response = await request(app)
    .get("/api/me")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(response.body).toHaveProperty("user");
  expect(response.body.user.name).toBe("tester");
});
