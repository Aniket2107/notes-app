const app = require("../app");
const request = require("supertest");

const { disconnectDB } = require("../config/db");

let accessToken;
let accessToken2;
let user2;

beforeAll(async () => {
  const registerUser1 = await request(app).post("/api/auth/signup").send({
    fullName: "Aniket",
    email: "atest@gmail.com",
    password: "Password@2",
  });

  const registerUser2 = await request(app).post("/api/auth/signup").send({
    fullName: "Aniket",
    email: "atest2@gmail.com",
    password: "Password@2",
  });

  accessToken = registerUser1.body.accessToken;
  accessToken2 = registerUser2.body.accessToken;
  user2 = registerUser2.body.user;
});

afterAll(async () => {
  await disconnectDB();
});

describe("Notes", () => {
  it("CREATE:", async () => {
    const response = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Test Note",
        content: "This is a test note content.",
        keywords: ["test", "note", "express"],
      })
      .expect(201);

    createdNoteId = response.body._id;

    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Test Note");
    expect(response.body.content).toBe("This is a test note content.");
  });

  it("GET BY ID", async () => {
    const response = await request(app)
      .get(`/api/notes/${createdNoteId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("_id", createdNoteId);
    expect(response.body.title).toBe("Test Note");
    expect(response.body.content).toBe("This is a test note content.");
  });

  it("GET-ALL NOTES", async () => {
    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body.notes)).toBe(true);
    expect(response.body.notes.length).toBeGreaterThan(0);
  });

  it("UPDATE", async () => {
    const updatedTitle = "Updated Test Note";
    const response = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: updatedTitle,
        content: "Updated test note content.",
      })
      .expect(200);

    expect(response.body).toHaveProperty("_id", createdNoteId);
    expect(response.body.title).toBe(updatedTitle);
    expect(response.body.content).toBe("Updated test note content.");
  });

  it("Share with other user", async () => {
    const response = await request(app)
      .post(`/api/notes/${createdNoteId}/share`)
      .send({ sharedUserId: user2?._id })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.sharedWith).toContain(user2._id);
  });

  it("Find shared note for other user", async () => {
    const response = await request(app)
      .get(`/api/notes`)
      .set("Authorization", `Bearer ${accessToken2}`)
      .expect(200);

    expect(
      response.body.notes.some((note) => note._id === createdNoteId)
    ).toBeTruthy();
  });

  it("QUERY search for valid query", async () => {
    const response = await request(app)
      .get("/api/search")
      .query({ q: "test" })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("QUERY search for invalid value", async () => {
    const response = await request(app)
      .get("/api/search")
      .query({ q: "invalidsearch" })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("DELETE", async () => {
    const response = await request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Note deleted successfully"
    );
  });
});
