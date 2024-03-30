import * as request from "supertest";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../users/ports/user-repository.interface";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Registering a user", () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should register the user", async () => {
      const result = await request(app.getHttpServer()).post("/user").send({
        emailAddress: e2eUsers.alice.entity.props.emailAddress,
        name: e2eUsers.alice.entity.props.name,
        password: e2eUsers.alice.entity.props.password,
      });

      expect(result.status).toBe(201);

      const userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
      const user = await userRepository.findByEmailAddress(
        e2eUsers.alice.entity.props.emailAddress,
      );

      expect(user).toBeDefined();
      expect(user?.props).toEqual({
        id: expect.any(String),
        emailAddress: e2eUsers.alice.entity.props.emailAddress,
        name: e2eUsers.alice.entity.props.name,
        password: expect.any(String),
      });
    });
  });
});
