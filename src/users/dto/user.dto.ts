import { User } from "../entities/user.entity";

export type UserDTO = {
  id: string;
  email: string;
  username: string;
};

export class UserMapper {
  toDTO(organizer: User): UserDTO {
    return {
      id: organizer.props.id,
      email: organizer.props.emailAddress,
      username: organizer.props.name,
    };
  }
}
