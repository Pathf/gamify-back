import { ApiProperty } from "@nestjs/swagger";
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
      id: string;
      name: string;
      emailAddress: string;
    };

    export class SwaggerBody {
      @ApiProperty()
      emailAddress: string;
      @ApiProperty()
      password: string;
    }

    export class SwaggerResponse {
      @ApiProperty()
      access_token: string;

      @ApiProperty()
      id: string;
      @ApiProperty()
      name: string;
      @ApiProperty()
      emailAddress: string;
    }
  }
}
