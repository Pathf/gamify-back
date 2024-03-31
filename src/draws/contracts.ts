import { z } from "zod";

export namespace DrawsAPI {
  export namespace OrganizeDraw {
    export const schema = z.object({
      title: z.string(),
      year: z.number(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace CancelDraw {
    export type Response = void;
  }

  export namespace RegisterParticipation {
    export const schema = z.object({
      participantId: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace CancelParticipation {
    export type Response = void;
  }
}
