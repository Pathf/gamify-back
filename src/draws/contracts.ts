import { z } from "zod";
import { ChainedDrawResultDTO } from "./dto/chained-draw-result.dto";
import { DrawResultDTO } from "./dto/draw-result.dto";
import { DrawsDTO } from "./dto/draws.dto";
import { ParticipantResultDTO } from "./dto/participant-result.dto";

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

  export namespace RunDraw {
    export type Response = void;
  }

  export namespace GetDraws {
    export type Response = DrawsDTO[];
  }

  export namespace CloseDraw {
    export type Response = void;
  }
}

export namespace ParticipationAPI {
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

export namespace ConditionAPI {
  export namespace RegisterCondition {
    export const schema = z.object({
      donorId: z.string(),
      receiverId: z.string(),
      isViceVersa: z.boolean(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }
}

export namespace ChainedDrawAPI {
  export namespace GetDrawByParticipantId {
    export type Response = ParticipantResultDTO;
  }

  export namespace GetChainedDrawsByIdParticipant {
    export type Response = ChainedDrawResultDTO[];
  }

  export namespace GetDrawById {
    export type Response = DrawResultDTO;
  }
}
