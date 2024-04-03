import { ChainedDraw } from "./chained-draw.entity";

interface IDrawIdState {
  drawId: (drawId: string) => IDonorIdState;
}
interface IDonorIdState {
  donorId: (donorId: string) => IReceiverIdState;
}
interface IReceiverIdState {
  receiverId: (receiverId: string) => IDateDrawState;
}
interface IDateDrawState {
  dateDraw: (dateDraw: Date) => IBuildState;
}
interface IBuildState {
  build: () => ChainedDraw;
}
export class ChainedDrawBuilder
  implements
    IDrawIdState,
    IDonorIdState,
    IReceiverIdState,
    IDateDrawState,
    IBuildState
{
  private _drawId: string;
  private _donorId: string;
  private _receiverId: string;
  private _dateDraw: Date;
  private constructor() {}

  static use(): IDrawIdState {
    return new ChainedDrawBuilder();
  }

  drawId(drawId: string): IDonorIdState {
    this._drawId = drawId;
    return this;
  }

  donorId(donorId: string): IReceiverIdState {
    this._donorId = donorId;
    return this;
  }

  receiverId(receiverId: string): IDateDrawState {
    this._receiverId = receiverId;
    return this;
  }

  dateDraw(dateDraw: Date): IBuildState {
    this._dateDraw = dateDraw;
    return this;
  }

  build(): ChainedDraw {
    return new ChainedDraw({
      drawId: this._drawId,
      donorId: this._donorId,
      receiverId: this._receiverId,
      dateDraw: this._dateDraw,
    });
  }
}
