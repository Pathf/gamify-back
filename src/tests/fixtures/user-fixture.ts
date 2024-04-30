import {
  IJwtService,
  I_JWT_SERVICE,
} from "../../auth/ports/jwt-service.interface";
import { ISecurity, I_SECURITY } from "../../core/ports/security.interface";
import { User } from "../../users/entities/user.entity";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../../users/ports/user-repository.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class UserFixture implements IFixture {
  private app: TestApp;

  constructor(public entity: User) {}

  async load(app: TestApp) {
    this.app = app;
    const securityService = app.get<ISecurity>(I_SECURITY);
    const password = await securityService.hash(this.entity.props.password);
    this.entity.update({ password });
    this.entity.commit();

    const userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
    await userRepository.createUser(this.entity);
  }

  createAuthorizationToken() {
    const jwtService = this.app.get<IJwtService>(I_JWT_SERVICE);
    const payload = { sub: this.entity.props.id, name: this.entity.props.name };
    return `Bearer ${jwtService.sign(payload)}`;
  }
}
