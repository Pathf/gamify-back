import * as request from "supertest";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../users/ports/user-repository.interface";
import { e2eUserRoles } from "./seeds/user-roles-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Deleting account", () => {
  const aliceId = e2eUsers.alice.entity.props.id;

  let app: TestApp;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eUserRoles.aliceRoles,
      e2eUserRoles.bobRoles,
    ]);
    userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should delete the account", async () => {
      const result = await request(app.getHttpServer())
        .delete(`/user/${aliceId}`)
        .set("Authorization", e2eUsers.alice.createAuthorizationToken());
      expect(result.status).toBe(200);

      const alice = await userRepository.findOne(aliceId);
      expect(alice).toBeNull();
    });

    it("should delete the account when admin", async () => {
      const result = await request(app.getHttpServer())
        .delete(`/user/${aliceId}`)
        .set("Authorization", e2eUsers.bob.createAuthorizationToken());
      expect(result.status).toBe(200);

      const alice = await userRepository.findOne(aliceId);
      expect(alice).toBeNull();
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).delete(
        `/user/${aliceId}`,
      );
      expect(result.status).toBe(401);

      const alice = await userRepository.findOne(aliceId);
      expect(alice).toEqual(e2eUsers.alice.entity);
    });
  });
});
