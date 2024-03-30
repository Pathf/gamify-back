import { ADMIN_ROLE, USER_ROLE } from "../../core/utils/roles.decorator";
import { UserRoles } from "../../users/entities/user-roles.entity";
import { UserRolesFixture } from "../fixtures/user-roles-fixture";
import { e2eUsers } from "./user-seeds.e2e";

export const e2eUserRoles = {
  aliceRoles: new UserRolesFixture(
    new UserRoles({
      userId: e2eUsers.alice.entity.props.id,
      roles: [USER_ROLE, ADMIN_ROLE],
    }),
  ),
  bobRoles: new UserRolesFixture(
    new UserRoles({
      userId: e2eUsers.bob.entity.props.id,
      roles: [USER_ROLE],
    }),
  ),
};
