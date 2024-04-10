import { UserDTO } from "../../users/dto/user.dto";

export type StateDrawDTO = {
  id: string;
  title: string;
  year: number;
  organizer: UserDTO;
  runDrawDate: string | null;
};

export type DrawsDTO = StateDrawDTO[];
