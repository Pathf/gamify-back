import { ADMIN_ROLE } from "../../core/utils/roles.decorator";
import { UserRoles } from "../entities/user-roles.entity";
import { IUserRolesRepository } from "../ports/user-roles-repository.interface";

export class InMemoryUserRolesRepository implements IUserRolesRepository {
  constructor(public readonly usersRoles: UserRoles[] = []) {}

  async findRolesByUserId(userId: string): Promise<string[]> {
    const userRoles = this.usersRoles.find(
      (userRoles) => userRoles.props.userId === userId,
    );

    return userRoles ? userRoles.props.roles : [];
  }

  async isAdmin(userId: string): Promise<boolean> {
    const userRoles = this.usersRoles.find(
      (userRoles) => userRoles.props.userId === userId,
    );

    return userRoles ? userRoles.props.roles.includes(ADMIN_ROLE) : false;
  }

  async addRoleToUser(userId: string, role: string): Promise<void> {
    const userRoles = this.usersRoles.find(
      (userRoles) => userRoles.props.userId === userId,
    );

    if (!userRoles) {
      this.usersRoles.push(new UserRoles({ userId, roles: [role] }));
      return;
    }

    const roleAlreadyExists = userRoles.props.roles.includes(role);

    if (roleAlreadyExists) {
      return;
    }

    userRoles.props.roles.push(role);
  }

  async deleteRolesByUserId(userId: string): Promise<void> {
    const userRolesIndex = this.usersRoles.findIndex(
      (userRoles) => userRoles.props.userId === userId,
    );

    if (userRolesIndex === -1) {
      return;
    }

    this.usersRoles.splice(userRolesIndex, 1);
  }
}
