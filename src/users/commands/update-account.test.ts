import { FixedSecurity } from "../../core/adapters/fixed/fixed-security";
import { InMemoryMailer } from "../../core/adapters/in-memory/in-memory-mailer";
import { InMemoryUserRepository } from "../adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import { UpdateAccountCommandHandler } from "./update-account";

describe("Feature: Updating Account", () => {
  let userRepository: InMemoryUserRepository;
  let securityService: FixedSecurity;
  let mailer: InMemoryMailer;
  let useCase: UpdateAccountCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    securityService = new FixedSecurity();
    mailer = new InMemoryMailer([]);
    useCase = new UpdateAccountCommandHandler(
      userRepository,
      securityService,
      mailer,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      user: testUsers.alice,
      userId: testUsers.alice.props.id,
      emailAddress: "alice.new@gmail.com",
      password: "cool",
      name: "Alicia",
    };

    it("should update user Alice", async () => {
      await useCase.execute(payload);

      const alice = userRepository.findOneSync(testUsers.alice.props.id);
      expect(alice).toBeDefined();
      expect(alice?.props).toEqual({
        ...testUsers.alice.props,
        emailAddress: "alice.new@gmail.com",
        password: "cool",
        name: "Alicia",
      });
    });
  });

  describe("Scenario: user at change does not exist", () => {
    const payload = {
      user: testUsers.alice,
      userId: "non-existing-id",
      emailAddress: "alice.new@gmail.com",
      password: "cool",
      name: "Alicia",
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "User not found",
      );

      const alice = userRepository.findOneSync(testUsers.alice.props.id);
      expect(alice).toBeDefined();
      expect(alice?.props).toEqual(testUsers.alice.props);
    });
  });

  describe("Scenario: user at change is admin or same user", () => {
    const payload = {
      user: testUsers.bob,
      userId: testUsers.alice.props.id,
      emailAddress: "alice.new@gmail.com",
      password: "cool",
      name: "Alicia",
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "You are not allowed to update this user",
      );

      const alice = userRepository.findOneSync(testUsers.alice.props.id);
      expect(alice).toBeDefined();
      expect(alice?.props).toEqual(testUsers.alice.props);
    });
  });
});
