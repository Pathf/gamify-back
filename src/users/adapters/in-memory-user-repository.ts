import { User } from "../entities/user.entity";
import { IUserRepository } from "../ports/user-repository.interface";

export class InMemoryUserRepository implements IUserRepository {
  constructor(public readonly database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    const user = this.database.find((userDb) => userDb.props.id === id);
    return user ?? null;
  }

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const user = this.database.find(
      (userDb) => userDb.props.emailAddress === emailAddress,
    );
    return user ?? null;
  }

  async createUser(user: User): Promise<void> {
    this.database.push(user);
  }
}
