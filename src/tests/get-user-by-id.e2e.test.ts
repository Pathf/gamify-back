import * as request from "supertest";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Getting a user by id", () => {
  const userId = e2eUsers.alice.entity.props.id;

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
    it("should succeed", async () => {
      const result = await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken());

      expect(result.status).toBe(200);

      expect(result.body).toEqual({
        id: e2eUsers.alice.entity.props.id,
        email: e2eUsers.alice.entity.props.emailAddress,
        username: e2eUsers.alice.entity.props.name,
      });
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).get(`/user/${userId}`);

      expect(result.status).toBe(401);
    });
  });
});
