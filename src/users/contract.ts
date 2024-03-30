import { z } from "zod";

export namespace UserAPI {
  export namespace RegisterUser {
    export const schema = z.object({
      emailAddress: z.string().email(),
      name: z.string(),
      password: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }
}
