import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { User } from '../entities/user.entity';
import { Authenticator } from './authenticator';

describe('Authenticator', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;
  beforeEach(async () => {
    repository = new InMemoryUserRepository();

    await repository.createUser(
      new User({
        id: 'id-1',
        emailAddress: 'johndoe@gmail.com',
        name: 'John Doe',
        password: 'azerty',
      }),
    );

    authenticator = new Authenticator(repository);
  });

  describe('Case: the token is valid', () => {
    it('should return the user', async () => {
      const payload = Buffer.from('johndoe@gmail.com:azerty', 'utf-8').toString(
        'base64',
      );
      const user = await authenticator.authenticator(payload);

      expect(user.props).toEqual({
        id: 'id-1',
        emailAddress: 'johndoe@gmail.com',
        name: 'John Doe',
        password: 'azerty',
      });
    });
  });

  describe('Case: the user does not exist', () => {
    it('should fail', async () => {
      const payload = Buffer.from('uknown@gmail.com:azerty', 'utf-8').toString(
        'base64',
      );

      await expect(() => authenticator.authenticator(payload)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('Case: the password is not valid', () => {
    it('should fail', async () => {
      const payload = Buffer.from(
        'johndoe@gmail.com:not-valid',
        'utf-8',
      ).toString('base64');

      await expect(() => authenticator.authenticator(payload)).rejects.toThrow(
        'Password invalid',
      );
    });
  });
});
