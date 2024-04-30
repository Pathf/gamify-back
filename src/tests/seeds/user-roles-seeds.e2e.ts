import { testUserRoles } from "../../auth/tests/user-roles-seeds";
import { UserRolesFixture } from "../fixtures/user-roles-fixture";

export const e2eUserRoles = {
  aliceRoles: new UserRolesFixture(testUserRoles.alice),
  bobRoles: new UserRolesFixture(testUserRoles.bob),
};
