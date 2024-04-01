import { Entity } from "../../shared/entity.abstract";

type ConditionProps = {
  drawId: string;
  donorId: string;
  receiverId: string;
  isViceVersa: boolean;
};

export class Condition extends Entity<ConditionProps> {
  isDonor(otherDonorParticipantid: string): boolean {
    return this.props.donorId === otherDonorParticipantid;
  }

  isReceiver(otherParticipantReceivesId: string): boolean {
    return this.props.receiverId === otherParticipantReceivesId;
  }

  isDraw(drawId: string): boolean {
    return this.props.drawId === drawId;
  }
}
