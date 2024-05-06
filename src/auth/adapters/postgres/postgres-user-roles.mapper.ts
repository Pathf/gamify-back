import { RoleEnum } from "../../decorators/roles.decorator";
import { UserRoles } from "../../entities/user-roles.entity";
import { PostgresUserRole } from "./postgres-user-roles";

export class UserRolesMapper {
  toPeristence(userId: string, role: RoleEnum): PostgresUserRole {
    const postgresUserRole = new PostgresUserRole();
    postgresUserRole.userId = userId;
    postgresUserRole.role = role;
    return postgresUserRole;
  }

  toDomain(postgresUserRoles: PostgresUserRole[]): UserRoles {
    return new UserRoles({
      userId: postgresUserRoles[0].userId,
      roles: postgresUserRoles.map((ur) => ur.role),
    });
  }
}
