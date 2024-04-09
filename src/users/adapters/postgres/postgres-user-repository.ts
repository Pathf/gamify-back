import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../ports/user-repository.interface";
import { PostgresUser } from "./postgres-user";
import { UserMapper } from "./postgres-user.mapper";

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  private readonly userMapper: UserMapper = new UserMapper();

  constructor(
    @InjectRepository(PostgresUser)
    private readonly userRepository: Repository<PostgresUser>,
  ) {}

  async findOne(id: string): Promise<User | null> {
    const postgreUser = await this.userRepository.findOneBy({ id });
    return postgreUser ? this.userMapper.toDomain(postgreUser) : null;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const postgreUsers = await this.userRepository.find({
      where: ids.map((id) => ({ id })),
    });
    return postgreUsers.map((postgreUser) =>
      this.userMapper.toDomain(postgreUser),
    );
  }

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const postgreUser = await this.userRepository.findOneBy({ emailAddress });
    return postgreUser ? this.userMapper.toDomain(postgreUser) : null;
  }

  async findAll(): Promise<User[]> {
    return (await this.userRepository.find()).map((postgreUser) =>
      this.userMapper.toDomain(postgreUser),
    );
  }

  async createUser(user: User): Promise<void> {
    const postgreUser = this.userMapper.toPersistence(user);
    await this.userRepository.save(postgreUser);
  }

  async update(user: User): Promise<void> {
    const postgreUser = this.userMapper.toPersistence(user);
    await this.userRepository.save(postgreUser);
  }

  async delete(user: User): Promise<void> {
    await this.userRepository.delete(user.props.id);
  }

  async deleteAll(): Promise<void> {
    await this.userRepository.clear();
  }
}
