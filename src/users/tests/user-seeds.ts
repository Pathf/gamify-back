import { User } from "../entities/user.entity";

export const testUsers = {
  alice: new User({
    id: "alice-id",
    emailAddress: "alice@gmail.com",
    name: "Alice",
    password: "azerty",
  }),

  bob: new User({
    id: "bob-id",
    emailAddress: "bob@gmail.com",
    name: "Bob",
    password: "azerty",
  }),

  charles: new User({
    id: "charles-id",
    emailAddress: "charles@gmail.com",
    name: "Charles",
    password: "azerty",
  }),
  david: new User({
    id: "david-id",
    emailAddress: "david@gmail.com",
    name: "David",
    password: "azerty",
  }),
};
