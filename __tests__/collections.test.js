const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/collections", () => {
  it("should create a collection with valid data", async () => {
    const res = await request(app)
      .post("/api/collections")
      .send({ name: "Test Collection", description: "A test", color: "#FF5733" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Collection");
    expect(res.body.color).toBe("#FF5733");
  });

  it("should reject invalid color format", async () => {
    const res = await request(app)
      .post("/api/collections")
      .send({ name: "Bad Color", color: "not-a-color" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation Error");
  });

  it("should reject duplicate name", async () => {
    await request(app).post("/api/collections").send({ name: "Unique Name" });
    const res = await request(app).post("/api/collections").send({ name: "Unique Name" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Conflict");
  });
});

describe("GET /api/collections", () => {
  it("should list collections with note count", async () => {
    const res = await request(app).get("/api/collections");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
