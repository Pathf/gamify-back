import { testUsers } from "../../users/tests/user-seeds";
import { RoleEnum } from "../decorators/roles.decorator";
import { UserRoles } from "../entities/user-roles.entity";

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
