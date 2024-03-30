import { v4 as uuidv4 } from "uuid";
import { IIDGenerator } from "../ports/id-generator.interface";

export class RandomIDGenartor implements IIDGenerator {
  generate(): string {
    return uuidv4();
  }
}
