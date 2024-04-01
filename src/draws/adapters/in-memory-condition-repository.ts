import { Condition } from "../entities/condition.entity";
import { IConditionRepository } from "../ports/condition-repositroy.interface";

export class InMemoryConditionRepository implements IConditionRepository {
  constructor(private conditions: Condition[] = []) {}

  async find(condition: Condition): Promise<Condition | null> {
    const { drawId, donorId, receiverId, isViceVersa } = condition.props;
    return this.findSync(drawId, donorId, receiverId, isViceVersa);
  }

  async create(condition: Condition): Promise<void> {
    this.conditions.push(condition);
  }

  // Just for testing purposes
  findSync(
    drawId: string,
    donorId: string,
    receiverId: string,
    viceVersa = false,
  ): Condition | null {
    if (viceVersa) {
      return (
        this.conditions.find((condition) => {
          const isDraw = condition.isDraw(drawId);
          const normalCase =
            condition.isDonor(donorId) && condition.isReceiver(receiverId);
          const viceVersaCase =
            condition.isDonor(receiverId) && condition.isReceiver(donorId);
          return isDraw && (normalCase || viceVersaCase);
        }) || null
      );
    }

    return (
      this.conditions.find(
        (condition) =>
          condition.isDraw(drawId) &&
          condition.isDonor(donorId) &&
          condition.isReceiver(receiverId),
      ) || null
    );
  }
}
