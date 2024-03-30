import * as request from "supertest";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../users/ports/user-repository.interface";
import {
  IUserRolesRepository,
  I_USER_ROLES_REPOSITORY,
} from "../users/ports/user-roles-repository.interface";
import { e2eUserRoles } from "./seeds/user-roles-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Deleting account", () => {
  let app: TestApp;
  let userRepository: IUserRepository;
  let userRolesRepository: IUserRolesRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([e2eUsers.alice, e2eUserRoles.aliceRoles]);
    userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
    userRolesRepository = app.get<IUserRolesRepository>(
      I_USER_ROLES_REPOSITORY,
    );
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

      const roles = await userRolesRepository.findRolesByUserId(
        e2eUsers.alice.entity.props.id,
      );
      expect(roles).toEqual([]);
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).delete("/user");
      expect(result.status).toBe(403);

      const alice = await userRepository.findByEmailAddress(
        e2eUsers.alice.entity.props.emailAddress,
      );
      expect(alice).toEqual(e2eUsers.alice.entity);

      const roles = await userRolesRepository.findRolesByUserId(
        e2eUsers.alice.entity.props.id,
      );
      expect(roles).toEqual(e2eUserRoles.aliceRoles.entity.props.roles);
    });
  });
});
