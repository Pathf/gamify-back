import { IIDGenerator } from '../ports/id-generator.interface';

export class FixedIDGenerator implements IIDGenerator {
  private numberId: number = 1;
  generate(): string {
    const id = `id-${this.numberId}`;
    this.numberId++;
    return id;
  }
}
