import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import { AuthService } from "./authenticator";

describe("Authenticator", () => {
  let userRepository: InMemoryUserRepository;
  let authenticator: AuthService;
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();

    await userRepository.createUser(testUsers.alice);
    await userRepository.createUser(testUsers.bob);

    authenticator = new AuthService(userRepository);
  });

  describe("Case: the token is valid", () => {
    it("should return the user", async () => {
      const payload = Buffer.from("alice@gmail.com:azerty", "utf-8").toString(
        "base64",
      );
      const user = await authenticator.authenticator(payload);

      expect(user.props).toEqual(testUsers.alice.props);
    });
  });

  describe("Case: the user does not exist", () => {
    it("should fail", async () => {
      const payload = Buffer.from("uknown@gmail.com:azerty", "utf-8").toString(
        "base64",
      );

      await expect(() => authenticator.authenticator(payload)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("Case: the password is not valid", () => {
    it("should fail", async () => {
      const payload = Buffer.from(
        "alice@gmail.com:not-valid",
        "utf-8",
      ).toString("base64");

      await expect(() => authenticator.authenticator(payload)).rejects.toThrow(
        "Password invalid",
      );
    });
  });
});
