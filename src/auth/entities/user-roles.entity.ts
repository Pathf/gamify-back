import { Entity } from "../../shared/entity.abstract";
import { RoleEnum } from "../roles.decorator";

type UserRolesProps = {
  userId: string;
  roles: RoleEnum[];
};

export class UserRoles extends Entity<UserRolesProps> {
  public matchOneRoles(roles: RoleEnum[]): boolean {
    return roles.some((role) => this.props.roles.includes(role));
  }
}
