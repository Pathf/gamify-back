import { Entity } from "../../shared/entity.abstract";

type ChainedDrawProps = {
  drawId: string;
  donorId: string;
  receiverId: string;
  dateDraw: Date;
};

export class ChainedDraw extends Entity<ChainedDrawProps> {}
