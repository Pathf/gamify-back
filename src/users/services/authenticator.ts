import { User } from "../entities/user.entity";
import { IUserRepository } from "../ports/user-repository.interface";
import { IUserRolesRepository } from "../ports/user-roles-repository.interface";

class UserWithRoles {
  constructor(
    public user: User,
    public roles: string[],
  ) {}
}

export interface IAuthenticator {
  authenticator(token: string): Promise<UserWithRoles>;
}

export class Authenticator implements IAuthenticator {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userRolesRepository: IUserRolesRepository,
  ) {}

  async authenticator(token: string): Promise<{ user; roles }> {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [emailAddress, password] = decoded.split(":");

    const user = await this.userRepository.findByEmailAddress(emailAddress);

    if (user === null) {
      throw new Error("User not found");
    }

    if (user.props.password !== password) {
      throw new Error("Password invalid");
    }

    const roles = await this.userRolesRepository.findRolesByUserId(
      user.props.id,
    );

    return new UserWithRoles(user, roles);
  }
}
