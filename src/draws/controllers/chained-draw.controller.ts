import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ChainedDrawAPI } from "../contracts";
import { GetDrawByParticipantIdQuery } from "../queries/get-draw-by-participant-id";

@Controller()
export class ChainedDrawController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get("/draw/:drawId/participant/:participantId/result")
  async handleGetDrawByParticipantId(
    @Param("drawId") drawId: string,
    @Param("participantId") participantId: string,
  ): Promise<ChainedDrawAPI.GetDrawByParticipantId.Response> {
    return this.queryBus.execute(
      new GetDrawByParticipantIdQuery(drawId, participantId),
    );
  }
}
