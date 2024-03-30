import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { InMemoryUserRolesRepository } from "../adapters/in-memory-user-roles-repository";
import { testUserRoles } from "../tests/user-roles-seeds";
import { testUsers } from "../tests/user-seeds";
import {
  DeleteAccountCommand,
  DeleteAccountCommandHandler,
} from "./delete-account";

describe("Feature: Deleting account", () => {
  let userRepository: InMemoryUserRepository;
  let userRolesRepository: InMemoryUserRolesRepository;
  let useCase: DeleteAccountCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    userRolesRepository = new InMemoryUserRolesRepository([
      testUserRoles.aliceRoles,
    ]);
    useCase = new DeleteAccountCommandHandler(
      userRepository,
      userRolesRepository,
    );
  });

  describe("Scenario: happy path", () => {
    it("should delete the account", async () => {
      const payload = new DeleteAccountCommand(
        testUsers.alice.props.emailAddress,
      );

      await useCase.execute(payload);

      const alice = await userRepository.findByEmailAddress(
        testUsers.alice.props.emailAddress,
      );
      const aliceRoles = await userRolesRepository.findRolesByUserId(
        testUsers.alice.props.id,
      );

      expect(alice).toBeNull();
      expect(aliceRoles).toEqual([]);
    });
  });

  describe("Scenario: user does not exist", () => {
    it("should fail", async () => {
      const payload = new DeleteAccountCommand("unknown@gmail.com");

      expect(async () => await useCase.execute(payload)).rejects.toThrowError(
        "User not found",
      );

      const alice = await userRepository.findByEmailAddress(
        testUsers.alice.props.emailAddress,
      );
      const roles = await userRolesRepository.findRolesByUserId(
        testUsers.alice.props.id,
      );

      expect(alice).toEqual(testUsers.alice);
      expect(roles).toEqual(testUserRoles.aliceRoles.props.roles);
    });
  });
});
