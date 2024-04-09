import { FixedSecurity } from "../../core/adapters/fixed/fixed-security";
import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { testUsers } from "../../users/tests/user-seeds";
import { FixedJwtService } from "../adapters/fixed-jwt-service";
import { SignInCommandHandler } from "./sign-in";

describe("Feature: Sign in", () => {
  let userRepository: IUserRepository;
  let jwtService: FixedJwtService;
  let securityService: FixedSecurity;
  let useCase: SignInCommandHandler;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    jwtService = new FixedJwtService();
    securityService = new FixedSecurity();
    useCase = new SignInCommandHandler(
      userRepository,
      jwtService,
      securityService,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      emailAddress: testUsers.alice.props.emailAddress,
      password: testUsers.alice.props.password,
    };
    it("should return access_token", async () => {
      const result = await useCase.execute(payload);
      expect(result).not.toBeNull();
      expect(result).toEqual({
        access_token: expect.any(String),
      });
    });
  });

  describe("Scenario: user does not exist", () => {
    const payload = {
      emailAddress: testUsers.bob.props.emailAddress,
      password: testUsers.bob.props.password,
    };
    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "User not found",
      );
    });
  });

  describe("Scenario: wrong password", () => {
    const payload = {
      emailAddress: testUsers.alice.props.emailAddress,
      password: "wrong-password",
    };
    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "User not found",
      );
    });
  });
});
