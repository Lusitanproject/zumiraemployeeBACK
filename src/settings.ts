export class Settings {
  static get phoneNumberIds(): string[] {
    return (process.env.PHONE_NUMBER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }
}
