export class DomainError extends Error {
  public domainMessage: string;

  constructor(message: string) {
    super(message);
    this.domainMessage = message;
  }
}
