import { Entity } from "../../shared/entity.abstract";

type UserProps = {
  id: string;
  emailAddress: string;
  name: string;
  password: string;
};

export class User extends Entity<UserProps> {
  isSameUser(userId: string): boolean {
    return this.props.id === userId;
  }
}
