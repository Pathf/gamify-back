import { Entity } from "../../shared/entity.abstract";

type UserRolesProps = {
  userId: string;
  roles: string[];
};

export class UserRoles extends Entity<UserRolesProps> {}
