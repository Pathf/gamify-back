import { z } from "zod";

export namespace AuthAPI {
  export namespace SignIn {
    export const schema = z.object({
      emailAddress: z.string().email(),
      password: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      access_token: string;
    };
  }
}
