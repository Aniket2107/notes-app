const app = require("../app");
const request = require("supertest");
const { disconnectDB } = require("../config/db");

afterAll(async () => {
  await disconnectDB();
});

let email = "anikettest@gmail.com";

describe("Auth", () => {
  describe("signup", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          fullName: "John Doe",
          email: email,
          password: "password123",
        })
        .expect(201);

      expect(response.body).toHaveProperty("accessToken");
    });

    it("should handle registration error", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          fullName: "John Doe",
          email: email,
          password: "password123",
        })
        .expect(400);

      expect(response.body).toEqual({
        message: "User already exists with this email",
      });
    });
  });

  describe("login", () => {
    it("should login and return token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: email,
          password: "password123",
        })
        .expect(201);

      expect(response.body).toHaveProperty("accessToken");
    });

    it("should handle registration error", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "john2@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid credentials",
      });
    });
  });

  describe("Refresh Token API", () => {
    it("should refresh access token with a valid refresh token", async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: email,
        password: "password123",
      });

      const refreshToken = loginResponse.body.refreshToken;

      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
    });

    it("should return an error for an invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "invalid-refresh-token" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Invalid refresh token." });
    });
  });
});
