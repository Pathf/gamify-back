import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IAuthenticator } from "../users/services/authenticator";
import { extractToken } from "./utils/extract-token";
import { Roles, matchOneRoles } from "./utils/roles.decorator";

export class AuthGuard implements CanActivate {
  constructor(
    private readonly authenticator: IAuthenticator,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const apiRoles = this.reflector.get(Roles, context.getHandler());
    if (!apiRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header) {
      return false;
    }

    const token = extractToken(header);
    if (!token) {
      return false;
    }

    try {
      const { user, roles } = await this.authenticator.authenticator(token);
      request.user = user;
      return matchOneRoles(apiRoles, roles);
    } catch (_) {
      return false;
    }
  }
}
