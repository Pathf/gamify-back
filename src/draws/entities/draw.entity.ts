import { Entity } from "../../shared/entity.abstract";
import { User } from "../../users/entities/user.entity";

type DrawProps = {
  id: string;
  title: string;
  organizerId: string;
  year: number;
};

export class Draw extends Entity<DrawProps> {
  isOrganizer(user: User): boolean {
    return this.isOrganizerId(user.props.id);
  }

  isOrganizerId(organizerId: string): boolean {
    return this.props.organizerId === organizerId;
  }
}
