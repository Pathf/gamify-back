import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IUserRepository } from "../users/ports/user-repository.interface";
import { IJwtService } from "./ports/jwt-service.interface";
import { contextIsPublic } from "./public.decorator";
import { extractBearerToken } from "./utils/extract-token";

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (contextIsPublic(context, this.reflector)) {
      return true;
    }

    const request = this.getRequest(context);
    const header = request.headers.authorization;

    if (!header) {
      throw new UnauthorizedException();
    }

    const token = extractBearerToken(header);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userRepository.findOne(payload.sub);
      request.user = user;
    } catch (_) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
