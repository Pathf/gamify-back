import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();

export const matchOneRoles = (
  roles: string[],
  otherRoles: string[],
): boolean => {
  return roles.some((apiRole) => otherRoles.includes(apiRole));
};
