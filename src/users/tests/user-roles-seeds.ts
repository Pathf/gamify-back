import { ADMIN_ROLE, USER_ROLE } from "../../core/utils/roles.decorator";
import { UserRoles } from "../entities/user-roles.entity";
import { testUsers } from "./user-seeds";

export const testUserRoles = {
  aliceRoles: new UserRoles({
    userId: testUsers.alice.props.id,
    roles: [USER_ROLE, ADMIN_ROLE],
  }),

  bobRoles: new UserRoles({
    userId: testUsers.bob.props.id,
    roles: [USER_ROLE],
  }),
};
