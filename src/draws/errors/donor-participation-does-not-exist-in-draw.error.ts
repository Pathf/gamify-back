export class DonorParticipationDoesNotExistInDrawError extends Error {
  constructor() {
    super("Donor participation does not exist in the draw");
  }
}
