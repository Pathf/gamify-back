import { User } from "../../users/entities/user.entity";
import { UserFixture } from "../fixtures/user-fixture";

export const e2eUsers = {
  alice: new UserFixture(
    new User({
      id: "id-alice",
      emailAddress: "alice@gmail.com",
      name: "Alice",
      password: "azerty",
    }),
  ),
  bob: new UserFixture(
    new User({
      id: "id-bob",
      emailAddress: "bob@gmail.com",
      name: "Bob",
      password: "azerty",
    }),
  ),
};
