import { IShuffleService } from "../ports/shuffle-service.interface";

export class ShuffleService implements IShuffleService {
  shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
