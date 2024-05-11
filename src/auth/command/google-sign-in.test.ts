import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { FixedJwtService } from "../adapters/fixed-jwt-service";
import { GoogleSignInCommandHandler } from "./google-sign-in";

describe("Feature: Google Sign In", () => {
  let userRepository: InMemoryUserRepository;
  let jwtService: FixedJwtService;
  let googleSignInCommandHandler: GoogleSignInCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    jwtService = new FixedJwtService();
    googleSignInCommandHandler = new GoogleSignInCommandHandler(
      userRepository,
      jwtService,
    );
  });

  describe("Scenario: Happy Path", () => {
    const payload = {
      email: testUsers.alice.props.emailAddress,
    };

    it("should return a valid access token", async () => {
      const response = await googleSignInCommandHandler.execute(payload);

      expect(response).toEqual({
        access_token: expect.any(String),
        id: testUsers.alice.props.id,
        name: testUsers.alice.props.name,
        emailAddress: testUsers.alice.props.emailAddress,
      });
    });
  });

  describe("Scenario: User not found", () => {
    const payload = {
      email: "unknown@gmail.com",
    };
    it("should throw an error", async () => {
      await expect(
        googleSignInCommandHandler.execute(payload),
      ).rejects.toThrowError("User not found");
    });
  });
});
