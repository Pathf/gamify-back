import * as request from "supertest";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Getting users", () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eUsers.charles,
      e2eUsers.david,
    ]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should succeed", async () => {
      const result = await request(app.getHttpServer())
        .get("/users")
        .set("Authorization", e2eUsers.alice.createAuthorizationToken());

      expect(result.status).toBe(200);

      expect(result.body).toHaveLength(4);
      expect(result.body).toEqual(
        expect.arrayContaining([
          {
            id: e2eUsers.alice.entity.props.id,
            email: e2eUsers.alice.entity.props.emailAddress,
            username: e2eUsers.alice.entity.props.name,
          },
          {
            id: e2eUsers.bob.entity.props.id,
            email: e2eUsers.bob.entity.props.emailAddress,
            username: e2eUsers.bob.entity.props.name,
          },
          {
            id: e2eUsers.charles.entity.props.id,
            email: e2eUsers.charles.entity.props.emailAddress,
            username: e2eUsers.charles.entity.props.name,
          },
          {
            id: e2eUsers.david.entity.props.id,
            email: e2eUsers.david.entity.props.emailAddress,
            username: e2eUsers.david.entity.props.name,
          },
        ]),
      );
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).get("/users");

      expect(result.status).toBe(401);
    });
  });
});
