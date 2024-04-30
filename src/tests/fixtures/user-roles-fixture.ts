import { UserRoles } from "../../auth/entities/user-roles.entity";
import {
  IUserRolesRepository,
  I_USER_ROLES_REPOSITORY,
} from "../../auth/ports/user-roles-repository.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class UserRolesFixture implements IFixture {
  private app: TestApp;

  constructor(public entity: UserRoles) {}

  async load(app: TestApp) {
    this.app = app;

    const userRolesRepository = app.get<IUserRolesRepository>(
      I_USER_ROLES_REPOSITORY,
    );

    for (const role of this.entity.props.roles) {
      await userRolesRepository.addRoleToUser(this.entity.props.userId, role);
    }
  }
}
