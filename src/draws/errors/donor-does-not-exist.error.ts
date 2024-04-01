export class DonorDoesNotExistError extends Error {
  constructor() {
    super("Donor does not exist");
  }
}
