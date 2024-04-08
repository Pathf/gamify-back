import { User } from "../entities/user.entity";
import { IUserRepository } from "../ports/user-repository.interface";

export class InMemoryUserRepository implements IUserRepository {
  constructor(public readonly database: User[] = []) {}

  async findOne(id: string): Promise<User | null> {
    return this.findOneSync(id);
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

  async findAll(): Promise<User[]> {
    return this.database;
  }

  async createUser(user: User): Promise<void> {
    this.database.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.database.findIndex((u) => u.props.id === user.props.id);
    this.database[index] = user;
    user.commit();
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

  // Just for testing purposes
  findOneSync(id: string): User | null {
    const user = this.database.find((userDb) => userDb.props.id === id);
    return user ?? null;
  }
}
