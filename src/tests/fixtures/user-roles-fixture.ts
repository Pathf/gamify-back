import { UserRoles } from "../../users/entities/user-roles.entity";
import {
  IUserRolesRepository,
  I_USER_ROLES_REPOSITORY,
} from "../../users/ports/user-roles-repository.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class UserRolesFixture implements IFixture {
  constructor(public entity: UserRoles) {}

  async load(app: TestApp) {
    const userRolesRepository = app.get<IUserRolesRepository>(
      I_USER_ROLES_REPOSITORY,
    );
    const userId = this.entity.props.userId;

    for (const role of this.entity.props.roles) {
      await userRolesRepository.addRoleToUser(userId, role);
    }
  }
}
