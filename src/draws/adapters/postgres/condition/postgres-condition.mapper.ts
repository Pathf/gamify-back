import { Condition } from "../../../entities/condition.entity";
import { PostgresCondition } from "./postgres-condition";

export class ConditionMapper {
  toDomain({
    id,
    drawId,
    donorId,
    receiverId,
    isViceVersa,
  }: PostgresCondition): Condition {
    return new Condition({
      id,
      drawId,
      donorId,
      receiverId,
      isViceVersa,
    });
  }

  toPersistence(condition: Condition): PostgresCondition {
    const postgresCondition = new PostgresCondition();
    postgresCondition.id = condition.props.id;
    postgresCondition.drawId = condition.props.drawId;
    postgresCondition.donorId = condition.props.donorId;
    postgresCondition.receiverId = condition.props.receiverId;
    postgresCondition.isViceVersa = condition.props.isViceVersa;
    return postgresCondition;
  }
}
