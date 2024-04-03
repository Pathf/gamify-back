import { IShuffleService } from "../ports/shuffle-service.interface";

export class FixedShuffleService implements IShuffleService {
  shuffle(array: string[]): string[] {
    return array.sort();
  }
}
