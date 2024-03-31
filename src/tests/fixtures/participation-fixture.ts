import { Participation } from "../../draws/entities/participation.entity";
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from "../../draws/ports/participation-repository.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class ParticipationFixture implements IFixture {
  constructor(public readonly entity: Participation) {}

  async load(app: TestApp): Promise<void> {
    const drawRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );
    await drawRepository.create(this.entity);
  }
}
