export const I_USER_ROLES_REPOSITORY = "I_USER_ROLES_REPOSITORY";

export interface IUserRolesRepository {
  findRolesByUserId(userId: string): Promise<string[]>;

  isAdmin(userId: string): Promise<boolean>;

  addRoleToUser(userId: string, role: string): Promise<void>;

  deleteRolesByUserId(userId: string): Promise<void>;
}
