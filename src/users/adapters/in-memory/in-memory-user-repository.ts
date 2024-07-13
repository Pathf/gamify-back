import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../ports/user-repository.interface";

export class InMemoryUserRepository implements IUserRepository {
  constructor(public readonly users: User[] = []) {}

  async findOne(id: string): Promise<User | null> {
    return this.findOneSync(id);
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.users.filter((userDb) => ids.includes(userDb.props.id));
  }

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const user = this.users.find(
      (userDb) => userDb.props.emailAddress === emailAddress,
    );
    return user ?? null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async createUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.props.id === user.props.id);
    this.users[index] = user;
    user.commit();
  }

  async delete(user: User): Promise<void> {
    const userIndex = this.users.findIndex(
      (userDb) => userDb.props.id === user.props.id,
    );

    if (userIndex === -1) {
      return;
    }

    this.users.splice(userIndex, 1);
  }

  async deleteAll(): Promise<void> {
    this.users.length = 0;
  }

  // Just for testing purposes
  findOneSync(id: string): User | null {
    const user = this.users.find((userDb) => userDb.props.id === id);
    return user ?? null;
  }
}
