import { Resend } from "resend";
import { Email, IMailer } from "../ports/mailer.interface";

export class ResendMailer implements IMailer {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_MAILER_KEY);
  }

  async send({ to, subject, body }: Email): Promise<void> {
    this.resend.emails.send({
      from: "no-reply@gamify.fr",
      to,
      subject,
      html: body,
    });
  }
}
