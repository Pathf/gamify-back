import { User } from "../../entities/user.entity";
import { PostgresUser } from "./postgres-user";

export class UserMapper {
  toDomain({ id, name, emailAddress, password }: PostgresUser): User {
    return new User({
      id,
      name,
      emailAddress,
      password,
    });
  }

  toPersistence(user: User): PostgresUser {
    const postgreUser = new PostgresUser();
    postgreUser.id = user.props.id;
    postgreUser.name = user.props.name;
    postgreUser.emailAddress = user.props.emailAddress;
    postgreUser.password = user.props.password;
    return postgreUser;
  }
}
