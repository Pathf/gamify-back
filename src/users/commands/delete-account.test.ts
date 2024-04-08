import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import {
  DeleteAccountCommand,
  DeleteAccountCommandHandler,
} from "./delete-account";

describe("Feature: Deleting account", () => {
  let userRepository: InMemoryUserRepository;
  let useCase: DeleteAccountCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    useCase = new DeleteAccountCommandHandler(userRepository);
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

      expect(alice).toBeNull();
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

      expect(alice).toEqual(testUsers.alice);
    });
  });
});
