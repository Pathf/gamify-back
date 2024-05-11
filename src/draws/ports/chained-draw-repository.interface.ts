import { ChainedDraw } from "../entities/chained-draw.entity";

export const I_CHAINED_DRAW_REPOSITORY = "I_CHAINED_DRAW_REPOSITORY";

export interface IChainedDrawRepository {
  findByDrawId(drawId: string): Promise<ChainedDraw[]>;
  findByDonorId(drawId: string, donorId: string): Promise<ChainedDraw | null>;
  findRunDrawDate(drawId: string): Promise<Date | null>;
  findAllByDonorId(donorId: string): Promise<ChainedDraw[]>;
  isDrawRun(drawId: string): Promise<boolean>;

  create(chainedDraw: ChainedDraw): Promise<void>;

  deleteAllByDrawId(drawId: string): Promise<void>;
  deleteAll(): Promise<void>;
}
