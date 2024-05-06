import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEnum } from "../../decorators/roles.decorator";
import { UserRoles } from "../../entities/user-roles.entity";
import { IUserRolesRepository } from "../../ports/user-roles-repository.interface";
import { PostgresUserRole } from "./postgres-user-roles";
import { UserRolesMapper } from "./postgres-user-roles.mapper";

@Injectable()
export class PostgresUserRolesRepository implements IUserRolesRepository {
  private readonly mapper = new UserRolesMapper();

  constructor(
    @InjectRepository(PostgresUserRole)
    private readonly userRolesRepository: Repository<PostgresUserRole>,
  ) {}

  async findOne(userId: string): Promise<UserRoles | null> {
    const postgresUserRoles = await this.userRolesRepository.findBy({ userId });

    if (!postgresUserRoles || postgresUserRoles.length === 0) {
      return null;
    }
    return this.mapper.toDomain(postgresUserRoles);
  }

  async isAdmin(userId: string): Promise<boolean> {
    const roleAdmin = await this.userRolesRepository.findOneBy({
      userId,
      role: RoleEnum.ADMIN,
    });
    return !!roleAdmin;
  }

  async addRoleToUser(userId: string, role: RoleEnum): Promise<void> {
    const postgresUserRole = this.mapper.toPeristence(userId, role);
    await this.userRolesRepository.save(postgresUserRole);
  }

  async deleteRoleByUserId(userId: string, role: RoleEnum): Promise<void> {
    const postgresUserRole = this.mapper.toPeristence(userId, role);
    await this.userRolesRepository.delete(postgresUserRole);
  }

  async deleteRolesByUserId(userId: string): Promise<void> {
    await this.userRolesRepository.delete({ userId: userId });
  }

  async deleteAll(): Promise<void> {
    await this.userRolesRepository.clear();
  }
}
