import { RoleEnum } from "../../decorators/roles.decorator";
import { UserRoles } from "../../entities/user-roles.entity";
import { IUserRolesRepository } from "../../ports/user-roles-repository.interface";

export class InMemoryUserRolesRepository implements IUserRolesRepository {
  constructor(public usersRoles: UserRoles[] = []) {}

  async findOne(userId: string): Promise<UserRoles | null> {
    return (
      this.usersRoles.find((userRoles) => userRoles.props.userId === userId) ||
      null
    );
  }

  async isAdmin(userId: string): Promise<boolean> {
    const userRoles = this.usersRoles.find(
      (userRoles) => userRoles.props.userId === userId,
    );

    return userRoles ? userRoles.props.roles.includes(RoleEnum.ADMIN) : false;
  }

  async addRoleToUser(userId: string, role: RoleEnum): Promise<void> {
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

  async deleteRoleByUserId(userId: string, role: RoleEnum): Promise<void> {
    const userRoles = this.usersRoles.find(
      (userRoles) => userRoles.props.userId === userId,
    );

    if (!userRoles) {
      return;
    }

    const roleIndex = userRoles.props.roles.findIndex(
      (userRole) => userRole === role,
    );

    if (roleIndex === -1) {
      return;
    }

    userRoles.props.roles.splice(roleIndex, 1);
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

  async deleteAll(): Promise<void> {
    this.usersRoles = [];
  }
}
