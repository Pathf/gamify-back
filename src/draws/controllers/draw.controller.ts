import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { User } from "../../users/entities/user.entity";
import { CancelDrawCommand } from "../commands/cancel-draw";
import { CloseDrawCommand } from "../commands/close-draw";
import { OrganizeDrawCommand } from "../commands/organize-draw";
import { RunDrawCommand } from "../commands/run-draw";
import { DrawsAPI } from "../contracts";
import { GetDrawsQuery } from "../queries/get-draws";

@ApiTags("draws")
@Controller()
export class DrawController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get("/draws")
  async handleGetDraws(): Promise<DrawsAPI.GetDraws.Response> {
    return this.queryBus.execute(new GetDrawsQuery());
  }

  @Get("/draw/:id/run")
  async handleRunDraw(
    @Param("id") drawId: string,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.RunDraw.Response> {
    return this.commandBus.execute(new RunDrawCommand(request.user, drawId));
  }

  @Get("/draw/:id/close")
  async handleCloseDraw(
    @Param("id") drawId: string,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.CloseDraw.Response> {
    return this.commandBus.execute(new CloseDrawCommand(request.user, drawId));
  }

  @Post("/draws")
  async handleOrganizeDraw(
    @Body(new ZodValidationPipe(DrawsAPI.OrganizeDraw.schema))
    body: DrawsAPI.OrganizeDraw.Request,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.OrganizeDraw.Response> {
    return this.commandBus.execute(
      new OrganizeDrawCommand(body.title, request.user.props.id, body.year),
    );
  }

  @Delete("/draw/:id")
  async handleCancelDraw(
    @Param("id") drawId: string,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.CancelDraw.Response> {
    return this.commandBus.execute(new CancelDrawCommand(drawId, request.user));
  }
}
