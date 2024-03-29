import { FixedIDGenerator } from '../../core/adapters/fixed-id-generator';
import { InMemoryMailer } from '../../core/adapters/in-memory-mailer';
import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { testUsers } from '../tests/user-seeds';
import { RegisterUserCommand, CreateUserCommandHandler as RegisterUserCommandHandler } from './register-user';

describe('Feature: Registering a user', () => {
  let mailer: InMemoryMailer;
  let idGenerator: FixedIDGenerator;
  let userRepository: InMemoryUserRepository;
  let useCase: RegisterUserCommandHandler;

  beforeEach(async () => {
    mailer = new InMemoryMailer();
    idGenerator = new FixedIDGenerator();
    userRepository = new InMemoryUserRepository();
    useCase = new RegisterUserCommandHandler(userRepository, idGenerator, mailer);
  });

  describe('Scenario: happy path', () => {
    const payload = new RegisterUserCommand(
      testUsers.alice.props.emailAddress,
      testUsers.alice.props.name,
      testUsers.alice.props.password,
    );

    it('should creat a user', async () => {
      await useCase.execute(payload);

      const userDB = await userRepository.findByEmailAddress(testUsers.alice.props.emailAddress); //?
      expect(userDB!.props).toEqual({
        id: 'id-1',
        emailAddress: testUsers.alice.props.emailAddress,
        name: testUsers.alice.props.name,
        password: 'hash-1',
      });
    });

    /*it('should send an confirmation e-mail to the user', async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.alice.props.emailAddress,
        subject: 'New participation',
        body: `User ${testUsers.bob.props.emailAddress} has reserved a seat for webinaire ${webinaire.props.title}`,
      });
    });*/
  });

// scenario: user already exists
});
