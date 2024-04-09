import { ChainedDraw } from "../entities/chained-draw.entity";

export const I_CHAINED_DRAW_REPOSITORY = "I_CHAINED_DRAW_REPOSITORY";

export interface IChainedDrawRepository {
  findByDrawId(drawId: string): Promise<ChainedDraw[]>;
  findByDonorId(drawId: string, donorId: string): Promise<ChainedDraw | null>;

  create(chainedDraw: ChainedDraw): Promise<void>;

  deleteAll(): Promise<void>;
}
