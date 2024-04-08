import * as request from "supertest";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../users/ports/user-repository.interface";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Deleting account", () => {
  let app: TestApp;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([e2eUsers.alice]);
    userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should delete the account", async () => {
      const result = await request(app.getHttpServer())
        .delete("/user")
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken());
      expect(result.status).toBe(200);

      const user = await userRepository.findByEmailAddress(
        e2eUsers.alice.entity.props.emailAddress,
      );
      expect(user).toBeNull();
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).delete("/user");
      expect(result.status).toBe(401);

      const alice = await userRepository.findByEmailAddress(
        e2eUsers.alice.entity.props.emailAddress,
      );
      expect(alice).toEqual(e2eUsers.alice.entity);
    });
  });
});
