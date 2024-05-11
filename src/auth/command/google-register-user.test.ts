import { FixedIDGenerator } from "../../core/adapters/fixed/fixed-id-generator";
import { FixedSecurity } from "../../core/adapters/fixed/fixed-security";
import { InMemoryMailer } from "../../core/adapters/in-memory/in-memory-mailer";
import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { GoogleRegisterUserCommandHandler } from "./google-register-user";

describe("Feature: Google Register User", () => {
  let fixedSecurity: FixedSecurity;
  let fixedIdGenerator: FixedIDGenerator;
  let userRepository: InMemoryUserRepository;
  let mailer: InMemoryMailer;
  let useCase: GoogleRegisterUserCommandHandler;

  beforeEach(() => {
    fixedSecurity = new FixedSecurity();
    fixedIdGenerator = new FixedIDGenerator();
    userRepository = new InMemoryUserRepository([testUsers.bob]);
    mailer = new InMemoryMailer([]);
    useCase = new GoogleRegisterUserCommandHandler(
      fixedSecurity,
      fixedIdGenerator,
      userRepository,
      mailer,
    );
  });

  describe("Scenario: Happy path", () => {
    const payload = {
      email: testUsers.alice.props.emailAddress,
      name: testUsers.alice.props.name,
    };

    it("should register user", async () => {
      await useCase.execute(payload);

      const user = userRepository.findOneSync("id-1");

      expect(user).toBeDefined();
      expect(user?.props).toEqual({
        id: "id-1",
        emailAddress: testUsers.alice.props.emailAddress,
        name: testUsers.alice.props.name,
        password: expect.any(String),
      });
    });

    it("should send email to user", async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails).toHaveLength(1);
      expect(mailer.sentEmails[0]).toEqual({
        to: payload.email,
        subject: "Confirmation e-mail",
        body: "Welcome to the gamify community!",
      });
    });
  });

  describe("Scenario: User already exists", () => {
    const payload = {
      email: testUsers.bob.props.emailAddress,
      name: testUsers.bob.props.name,
    };

    it("should throw error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "User already exists",
      );

      expect(userRepository.database).toHaveLength(1);
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });
});
