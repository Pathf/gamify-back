import { UserDTO } from "../../users/dto/user.dto";

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
