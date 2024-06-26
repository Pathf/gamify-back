import { User } from "../entities/user.entity";

export const I_USER_REPOSITORY = "I_USER_REPOSITORY";
export interface IUserRepository {
  findOne(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;
  findByEmailAddress(emailAddress: string): Promise<User | null>;
  findAll(): Promise<User[]>;

  createUser(user: User): Promise<void>;

  update(user: User): Promise<void>;

  delete(user: User): Promise<void>;
  deleteAll(): Promise<void>;
}
