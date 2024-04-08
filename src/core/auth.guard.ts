import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IAuthService } from "../users/services/authenticator";
import { extractToken } from "./utils/extract-token";
import { contextIsPublic } from "./utils/public.decorator";

export class AuthGuard implements CanActivate {
  constructor(
    private readonly authenticator: IAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (contextIsPublic(context, this.reflector)) {
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
      const user = await this.authenticator.authenticator(token);
      request.user = user;
      return true;
    } catch (_) {
      return false;
    }
  }
}
