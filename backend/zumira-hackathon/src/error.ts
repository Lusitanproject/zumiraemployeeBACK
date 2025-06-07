export class PublicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicError";
    Error.captureStackTrace?.(this, PublicError);
  }
}
