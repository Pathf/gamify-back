import { testUsers } from "../../users/tests/user-seeds";
import { UserRoles } from "../entities/user-roles.entity";
import { RoleEnum } from "../roles.decorator";

export const testUserRoles = {
  alice: new UserRoles({
    userId: testUsers.alice.props.id,
    roles: [RoleEnum.USER],
  }),
  bob: new UserRoles({
    userId: testUsers.bob.props.id,
    roles: [RoleEnum.ADMIN, RoleEnum.USER],
  }),
};
