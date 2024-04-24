import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { ChainedDrawAPI } from "../contracts";
import { GetDrawByIdQuery } from "../queries/get-draw-by-id";
import { GetDrawByParticipantIdQuery } from "../queries/get-draw-by-participant-id";

@ApiTags("draws")
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

  @Get("/draw/:drawId/result")
  async handleGetDrawById(
    @Param("drawId") drawId: string,
  ): Promise<ChainedDrawAPI.GetDrawById.Response> {
    return this.queryBus.execute(new GetDrawByIdQuery(drawId));
  }
}
