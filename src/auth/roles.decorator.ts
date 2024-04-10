import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "./entities/user-roles.entity";

export const Roles = Reflector.createDecorator<RoleEnum[]>();

export enum RoleEnum {
  USER = "USER_ROLE",
  ADMIN = "ADMIN_ROLE",
}

export const contextCorrespondingAtUserRoles = (
  context: ExecutionContext,
  reflector: Reflector,
  userRole: UserRoles | null,
): boolean => {
  const apiRoles = reflector.get(Roles, context.getHandler());
  if (!apiRoles) {
    return true;
  }

  if (!userRole) {
    return false;
  }
  return userRole.matchOneRoles(apiRoles);
};
