import { RoleEnum } from "../decorators/roles.decorator";
import { UserRoles } from "../entities/user-roles.entity";

export const I_USER_ROLES_REPOSITORY = "I_USER_ROLES_REPOSITORY";

export interface IUserRolesRepository {
  findOne(userId: string): Promise<UserRoles | null>;

  isAdmin(userId: string): Promise<boolean>;

  addRoleToUser(userId: string, role: RoleEnum): Promise<void>;

  deleteRoleByUserId(userId: string, role: RoleEnum): Promise<void>;
  deleteRolesByUserId(userId: string): Promise<void>;

  deleteAll(): Promise<void>;
}
