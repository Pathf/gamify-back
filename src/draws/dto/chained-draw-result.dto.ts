import { UserDTO } from "../../users/dto/user.dto";
import { ParticipantDTO } from "./participant-result.dto";

export type ChainedDrawResultDTO = {
  id: string;
  title: string;
  year: number;
  runDrawDate: string;
  organizer: UserDTO;
  donor: ParticipantDTO;
  receiver: ParticipantDTO;
};
