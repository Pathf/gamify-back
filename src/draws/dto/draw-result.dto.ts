import { UserDTO } from "../../users/dto/user.dto";
import { ParticipantDTO } from "./participant-result.dto";

export type ChainedDrawDTO = {
  donor: ParticipantDTO;
  receiver: ParticipantDTO;
};

export type DrawResultDTO = {
  id: string;
  title: string;
  year: number;
  runDrawDate: string;
  organizer: UserDTO;
  chainedDraws: ChainedDrawDTO[];
};
