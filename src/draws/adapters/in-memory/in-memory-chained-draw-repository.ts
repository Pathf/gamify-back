import { ChainedDraw } from "../../entities/chained-draw.entity";
import { IChainedDrawRepository } from "../../ports/chained-draw-repository.interface";

export class InMemoryChainedDrawRepository implements IChainedDrawRepository {
  constructor(private chainedDraws: ChainedDraw[] = []) {}

  async findByDrawId(drawId: string): Promise<ChainedDraw[]> {
    return this.findByDrawIdSync(drawId);
  }

  async findByDonorId(
    drawId: string,
    donorId: string,
  ): Promise<ChainedDraw | null> {
    return (
      this.chainedDraws.find(
        (chainedDraw) =>
          chainedDraw.props.donorId === donorId &&
          chainedDraw.props.drawId === drawId,
      ) || null
    );
  }

  async create(chainedDraw: ChainedDraw): Promise<void> {
    this.chainedDraws.push(chainedDraw);
  }

  async deleteAll(): Promise<void> {
    this.chainedDraws = [];
  }

  // Just for testing purposes
  findByDrawIdSync(drawId: string): ChainedDraw[] {
    return this.chainedDraws.filter(
      (chainedDraw) => chainedDraw.props.drawId === drawId,
    );
  }
}
