import { InMemoryUserRepository } from "../adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import { DeleteAccountCommandHandler } from "./delete-account";

describe("Feature: Deleting account", () => {
  function checkUserDeleted() {
    const alice = userRepository.findOneSync(testUsers.alice.props.id);
    expect(alice).toBeNull();
  }

  function checkUserNotDeleted() {
    const alice = userRepository.findOneSync(testUsers.alice.props.id);
    expect(alice).toEqual(testUsers.alice);
  }

  let userRepository: InMemoryUserRepository;
  let useCase: DeleteAccountCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    useCase = new DeleteAccountCommandHandler(userRepository);
  });

  describe("Scenario: happy path", () => {
    it("should delete the account when user is same", async () => {
      const payload = {
        user: testUsers.alice,
        isAdmin: false,
        userId: testUsers.alice.props.id,
      };
      await useCase.execute(payload);
      checkUserDeleted();
    });

    it("should delete the account when user is admin", async () => {
      const payload = {
        user: testUsers.bob,
        isAdmin: true,
        userId: testUsers.alice.props.id,
      };
      await useCase.execute(payload);
      checkUserDeleted();
    });
  });

  describe("Scenario: user does not exist", () => {
    const payload = {
      user: testUsers.alice,
      isAdmin: false,
      userId: "unknown",
    };

    it("should fail", async () => {
      await expect(async () => useCase.execute(payload)).rejects.toThrowError(
        "User not found",
      );
      checkUserNotDeleted();
    });
  });

  describe("Scenario: user is not allowed to delete", () => {
    const payload = {
      user: testUsers.bob,
      isAdmin: false,
      userId: testUsers.alice.props.id,
    };

    it("should fail when ", async () => {
      await expect(async () => useCase.execute(payload)).rejects.toThrowError(
        "You are not allowed to delete this account",
      );
      checkUserNotDeleted();
    });
  });
});
