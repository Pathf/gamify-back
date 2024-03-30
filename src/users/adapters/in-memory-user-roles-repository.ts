import { UserRoles } from "../entities/user-roles.entity";
import { IUserRolesRepository } from "../ports/user-roles-repository.interface";

export class InMemoryUserRolesRepository implements IUserRolesRepository {
  private usersRoles: UserRoles[] = [];

  async findRolesByUserId(userId: string): Promise<string[]> {
    const userRoles = this.usersRoles.find(
      (userRoles) => userRoles.props.userId === userId,
    );

    return userRoles ? userRoles.props.roles : [];
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
}
