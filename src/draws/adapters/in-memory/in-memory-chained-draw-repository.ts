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
    return this.findByDonorIdSync(drawId, donorId);
  }

  async findRunDrawDate(drawId: string): Promise<Date | null> {
    const chainedDraw = this.chainedDraws.find(
      (chainedDraw) => chainedDraw.props.drawId === drawId,
    );

    return chainedDraw ? chainedDraw.props.dateDraw : null;
  }

  async findAllByDonorId(donorId: string): Promise<ChainedDraw[]> {
    return this.chainedDraws.filter(
      (chainedDraw) => chainedDraw.props.donorId === donorId,
    );
  }

  async isDrawRun(drawId: string): Promise<boolean> {
    return this.chainedDraws.some(
      (chainedDraw) =>
        chainedDraw.props.drawId === drawId &&
        chainedDraw.props.dateDraw !== null,
    );
  }

  async create(chainedDraw: ChainedDraw): Promise<void> {
    this.chainedDraws.push(chainedDraw);
  }

  async deleteAllByDrawId(drawId: string): Promise<void> {
    this.chainedDraws = this.chainedDraws.filter(
      (chainedDraw) => chainedDraw.props.drawId !== drawId,
    );
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

  findByDonorIdSync(drawId: string, donorId: string): ChainedDraw | null {
    return (
      this.chainedDraws.find(
        (chainedDraw) =>
          chainedDraw.props.donorId === donorId &&
          chainedDraw.props.drawId === drawId,
      ) || null
    );
  }
}
