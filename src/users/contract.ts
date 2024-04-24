import { z } from "zod";
import { UserDTO } from "./dto/user.dto";
import { UsersDTO } from "./dto/users.dto";

export namespace UserAPI {
  export namespace RegisterUser {
    export const schema = z.object({
      emailAddress: z.string().email(),
      name: z.string(),
      password: z.string(),
      createCode: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace DeleteAccount {
    export type Response = void;
  }

  export namespace UpdateAccount {
    export const schema = z.object({
      emailAddress: z.string().email(),
      name: z.string(),
      password: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace GetUsers {
    export type Response = UsersDTO;
  }

  export namespace GetUserById {
    export type Response = UserDTO;
  }
}
