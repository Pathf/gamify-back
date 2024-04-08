import * as request from "supertest";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Sign in", () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([e2eUsers.alice]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    const payload = {
      emailAddress: e2eUsers.alice.entity.props.emailAddress,
      password: e2eUsers.alice.entity.props.password,
    };
    it("should get jwt", async () => {
      const result = await request(app.getHttpServer())
        .post("/auth/sign-in")
        .send(payload);

      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        access_token: expect.any(String),
      });
    });
  });
});
