import { testUsers } from "../../users/tests/user-seeds";
import { Draw } from "../entities/draw.entity";

export const testDraws = {
  secretSanta: new Draw({
    id: "secret-santa-id",
    title: "Secret Santa",
    organizerId: testUsers.alice.props.id,
    year: 2024,
  }),
  tombola: new Draw({
    id: "tombola-id",
    title: "Tombola",
    organizerId: testUsers.bob.props.id,
    year: 2022,
  }),
};
