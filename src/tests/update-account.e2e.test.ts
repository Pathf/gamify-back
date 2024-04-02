import * as request from "supertest";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../users/ports/user-repository.interface";
import { e2eUserRoles } from "./seeds/user-roles-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Updating account", () => {
  const userId = e2eUsers.alice.entity.props.id;
  const payload = {
    user: e2eUsers.alice.entity,
    userId,
    emailAddress: "alice.new@gmail.com",
    password: "cool",
    name: "Alicia",
  };

  let userRepository: IUserRepository;
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([e2eUsers.alice, e2eUserRoles.aliceRoles]);
    userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should register the user", async () => {
      const result = await request(app.getHttpServer())
        .post(`/user/${userId}`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken())
        .send(payload);

      expect(result.status).toBe(201);

      const user = await userRepository.findOne(userId);

      expect(user).toBeDefined();
      expect(user?.props).toEqual({
        id: userId,
        emailAddress: payload.emailAddress,
        name: payload.name,
        password: expect.any(String),
      });
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer())
        .post(`/user/${userId}`)
        .send(payload);
      expect(result.status).toBe(403);

      const user = await userRepository.findOne(userId);
      expect(user?.props).toEqual({
        id: userId,
        emailAddress: e2eUsers.alice.entity.props.emailAddress,
        name: e2eUsers.alice.entity.props.name,
        password: expect.any(String),
      });
    });
  });
});
