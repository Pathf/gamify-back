import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { InMemoryUserRolesRepository } from "../adapters/in-memory-user-roles-repository";
import { testUsers } from "../tests/user-seeds";
import { Authenticator } from "./authenticator";

describe("Authenticator", () => {
  let userRepository: InMemoryUserRepository;
  let userRolesRepository: InMemoryUserRolesRepository;
  let authenticator: Authenticator;
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    userRolesRepository = new InMemoryUserRolesRepository();

    await userRepository.createUser(testUsers.alice);
    await userRepository.createUser(testUsers.bob);

    await userRolesRepository.addRoleToUser(testUsers.alice.props.id, "ADMIN");

    authenticator = new Authenticator(userRepository, userRolesRepository);
  });

  describe("Case: the token is valid", () => {
    it("should return the user", async () => {
      const payload = Buffer.from("alice@gmail.com:azerty", "utf-8").toString(
        "base64",
      );
      const { user, roles } = await authenticator.authenticator(payload);

      expect(user.props).toEqual(testUsers.alice.props);
      expect(roles).toEqual(["ADMIN"]);
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
