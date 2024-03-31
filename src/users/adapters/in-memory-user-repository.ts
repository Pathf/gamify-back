import { User } from "../entities/user.entity";
import { IUserRepository } from "../ports/user-repository.interface";

export class InMemoryUserRepository implements IUserRepository {
  constructor(public readonly database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    const user = this.database.find((userDb) => userDb.props.id === id);
    return user ?? null;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.database.filter((userDb) => ids.includes(userDb.props.id));
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

  async delete(user: User): Promise<void> {
    const userIndex = this.database.findIndex(
      (userDb) => userDb.props.id === user.props.id,
    );

    if (userIndex === -1) {
      return;
    }

    this.database.splice(userIndex, 1);
  }
}
