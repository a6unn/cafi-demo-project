const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");

beforeAll(async () => {
  // Reset DB before tests
  await prisma.noteTag.deleteMany();
  await prisma.note.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.tag.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/notes", () => {
  it("should return empty list initially", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.hasMore).toBe(false);
  });
});

describe("POST /api/notes", () => {
  it("should create a note with valid data", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({ title: "Test Note", content: "Some content" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Note");
    expect(res.body.content).toBe("Some content");
    expect(res.body.id).toBeDefined();
    expect(res.body.pinned).toBe(false);
  });

  it("should reject empty title", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({ title: "", content: "Some content" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation Error");
  });

  it("should reject missing title", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({ content: "No title here" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation Error");
  });
});

describe("GET /api/notes/:id", () => {
  it("should return a note by id", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Find Me" });

    const res = await request(app).get(`/api/notes/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Find Me");
  });

  it("should return 404 for non-existent id", async () => {
    const res = await request(app).get("/api/notes/nonexistent-id-12345");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/notes/:id", () => {
  it("should update a note", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Original Title" });

    const res = await request(app)
      .patch(`/api/notes/${created.body.id}`)
      .send({ title: "Updated Title", pinned: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
    expect(res.body.pinned).toBe(true);
  });
});

describe("DELETE /api/notes/:id", () => {
  it("should delete a note", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "Delete Me" });

    const res = await request(app).delete(`/api/notes/${created.body.id}`);
    expect(res.status).toBe(204);

    // Verify it's gone
    const check = await request(app).get(`/api/notes/${created.body.id}`);
    expect(check.status).toBe(404);
  });
});

describe("Pagination", () => {
  beforeAll(async () => {
    // Create multiple notes for pagination testing
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/notes").send({ title: `Paginated Note ${i}` });
    }
  });

  it("should respect limit parameter", async () => {
    const res = await request(app).get("/api/notes?limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.hasMore).toBe(true);
    expect(res.body.pagination.nextCursor).toBeDefined();
  });

  it("should paginate using cursor", async () => {
    const page1 = await request(app).get("/api/notes?limit=3");
    const cursor = page1.body.pagination.nextCursor;

    const page2 = await request(app).get(`/api/notes?limit=3&cursor=${cursor}`);
    expect(page2.status).toBe(200);
    expect(page2.body.data.length).toBeGreaterThan(0);

    // Ensure no overlap between pages
    const page1Ids = page1.body.data.map((n) => n.id);
    const page2Ids = page2.body.data.map((n) => n.id);
    const overlap = page1Ids.filter((id) => page2Ids.includes(id));
    expect(overlap.length).toBe(0);
  });
});
