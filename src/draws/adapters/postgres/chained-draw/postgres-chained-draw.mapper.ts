import { ChainedDraw } from "../../../entities/chained-draw.entity";
import { PostgresChainedDraw } from "./postgres-chained-draw";

export class ChainedDrawMapper {
  toDomain({
    drawId,
    donorId,
    receiverId,
    dateDraw,
  }: PostgresChainedDraw): ChainedDraw {
    return new ChainedDraw({
      drawId,
      donorId,
      receiverId,
      dateDraw,
    });
  }

  toPersistence(chainedDraw: ChainedDraw): PostgresChainedDraw {
    const postgresChainedDraw = new PostgresChainedDraw();
    postgresChainedDraw.drawId = chainedDraw.props.drawId;
    postgresChainedDraw.donorId = chainedDraw.props.donorId;
    postgresChainedDraw.receiverId = chainedDraw.props.receiverId;
    postgresChainedDraw.dateDraw = chainedDraw.props.dateDraw;
    return postgresChainedDraw;
  }
}
