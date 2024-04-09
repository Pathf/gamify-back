import { FixedIDGenerator } from "../../core/adapters/fixed/fixed-id-generator";
import { FixedSecurity } from "../../core/adapters/fixed/fixed-security";
import { InMemoryMailer } from "../../core/adapters/in-memory/in-memory-mailer";
import { InMemoryUserRepository } from "../adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import {
  RegisterUserCommand,
  RegisterUserCommandHandler,
} from "./register-user";

describe("Feature: Registering a user", () => {
  let mailer: InMemoryMailer;
  const idGenerator: FixedIDGenerator = new FixedIDGenerator();
  let security: FixedSecurity;
  let userRepository: InMemoryUserRepository;
  let useCase: RegisterUserCommandHandler;

  beforeEach(async () => {
    mailer = new InMemoryMailer();
    security = new FixedSecurity();
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    useCase = new RegisterUserCommandHandler(
      userRepository,
      idGenerator,
      security,
      mailer,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = new RegisterUserCommand(
      testUsers.bob.props.emailAddress,
      testUsers.bob.props.name,
      testUsers.bob.props.password,
    );

    it("should creat a user", async () => {
      await useCase.execute(payload);

      const bob = await userRepository.findByEmailAddress(
        testUsers.bob.props.emailAddress,
      );
      expect(bob?.props).toEqual({
        id: "id-1",
        emailAddress: testUsers.bob.props.emailAddress,
        name: testUsers.bob.props.name,
        password: testUsers.bob.props.password, // for test, hash = password plain text
      });
    });

    it("should send an confirmation e-mail to the user", async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.bob.props.emailAddress,
        subject: "Confirmation e-mail",
        body: "Welcome to the gamify community!",
      });
    });
  });

  describe("Scenario: user already exists", () => {
    const payload = new RegisterUserCommand(
      testUsers.alice.props.emailAddress,
      testUsers.bob.props.name,
      testUsers.bob.props.password,
    );

    it("should fail user register", async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrowError(
        "User already exists with this e-mail address",
      );

      const alice = await userRepository.findByEmailAddress(
        testUsers.alice.props.emailAddress,
      );
      expect(alice?.props).toEqual({
        id: testUsers.alice.props.id,
        emailAddress: testUsers.alice.props.emailAddress,
        name: testUsers.alice.props.name,
        password: testUsers.alice.props.password,
      });
    });
  });
});
