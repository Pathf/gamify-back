import { testUsers } from "../../users/tests/user-seeds";
import { UserFixture } from "../fixtures/user-fixture";

export const e2eUsers = {
  alice: new UserFixture(testUsers.alice),
  bob: new UserFixture(testUsers.bob),
  charles: new UserFixture(testUsers.charles),
};
