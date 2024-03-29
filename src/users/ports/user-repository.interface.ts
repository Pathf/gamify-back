import { User } from '../entities/user.entity';

export const I_USER_REPOSITORY = 'I_USER_REPOSITORY';
export interface IUserRepository {
  createUser(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmailAddress(emailAddress: string): Promise<User | null>;
}
