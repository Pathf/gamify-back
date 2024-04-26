import { UserDTO } from "../../users/dto/user.dto";
import { User } from "../../users/entities/user.entity";

export type ParticipantResultDTO = {
  donor: ParticipantDTO;
  reveiver: ParticipantDTO;
  draw: DrawDTO;
};

export type ParticipantDTO = {
  id: string;
  name: string;
};

export type DrawDTO = {
  id: string;
  title: string;
  year: number;
  organizer: UserDTO;
};

export class ParticipantMapper {
  toDTO(user: User): ParticipantDTO {
    return {
      id: user.props.id,
      name: user.props.name,
    };
  }
}
