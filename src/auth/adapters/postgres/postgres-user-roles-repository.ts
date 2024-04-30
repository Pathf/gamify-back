import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRoles } from "../../entities/user-roles.entity";
import { IUserRolesRepository } from "../../ports/user-roles-repository.interface";
import { RoleEnum } from "../../roles.decorator";
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
    return postgresUserRoles ? this.mapper.toDomain(postgresUserRoles) : null;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const postgresUserRoles = await this.userRolesRepository.findBy({ userId });
    if (!postgresUserRoles) {
      return false;
    }
    return postgresUserRoles.map((ur) => ur.role).includes(RoleEnum.ADMIN);
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
