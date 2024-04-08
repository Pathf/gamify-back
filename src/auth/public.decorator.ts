import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Public = Reflector.createDecorator<void>();

export const contextIsPublic = (
  context: ExecutionContext,
  reflector: Reflector,
): boolean => {
  return Boolean(reflector.get(Public, context.getHandler()));
};
