import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();

export const USER_ROLE = "USER",
  ADMIN_ROLE = "ADMIN";

export const matchOneRoles = (
  roles: string[],
  otherRoles: string[],
): boolean => {
  return roles.some((apiRole) => otherRoles.includes(apiRole));
};
