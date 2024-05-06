import { Entity } from "../../shared/entity.abstract";
import { RoleEnum } from "../decorators/roles.decorator";

type UserRolesProps = {
  userId: string;
  roles: RoleEnum[];
};

export class UserRoles extends Entity<UserRolesProps> {
  public matchOneRoles(roles: RoleEnum[]): boolean {
    return roles.some((role) => this.props.roles.includes(role));
  }

  public isAdmin(): boolean {
    return this.props.roles.includes(RoleEnum.ADMIN);
  }
}
