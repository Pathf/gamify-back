import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserNotFoundError } from "../users/errors/user-not-found.error";
import { IUserRepository } from "../users/ports/user-repository.interface";
import { IJwtService } from "./ports/jwt-service.interface";
import { IUserRolesRepository } from "./ports/user-roles-repository.interface";
import { contextIsPublic } from "./public.decorator";
import { contextCorrespondingAtUserRoles } from "./roles.decorator";
import { Scheme, extractToken } from "./utils/extract-token";

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository,
    private readonly userRolesRepository: IUserRolesRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (contextIsPublic(context, this.reflector)) {
      return true;
    }

    const request = this.getRequest(context);

    const authorization = this.assertAuthorizationExist(request);
    const token = this.assertTokenExist(authorization);

    try {
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.assertUserExist(sub);
      const userRoles = await this.userRolesRepository.findOne(sub);
      request.user = user;
      request.isAdmin = userRoles?.isAdmin() || false;

      return contextCorrespondingAtUserRoles(
        context,
        this.reflector,
        userRoles,
      );
    } catch (_) {
      throw new UnauthorizedException();
    }
  }

  private getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  private assertAuthorizationExist(request: any) {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException();
    }
    return authorization;
  }

  private assertTokenExist(authorization: string) {
    const token = extractToken(authorization, Scheme.Bearer);
    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  }

  private async assertUserExist(userId: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}
