import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import { GoogleUserDto } from "../../dto/google-user.dto";

export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const email = this.assertEmailExist(profile.emails, done);
    const [firstName, lastName] = this.assertNameExist(profile.name, done);
    const picture = this.assertPhotoExist(profile.photos, done);

    const user: GoogleUserDto = {
      email,
      firstName,
      lastName,
      picture,
      accessToken,
    };

    done(null, user);
  }

  private assertEmailExist(emails: any, done: VerifyCallback): string {
    if (!emails || !emails[0]) {
      done(new Error("Email not found"), undefined);
    }
    return emails[0].value;
  }

  private assertNameExist(name: any, done: VerifyCallback): string[] {
    if (!name || !name.givenName || !name.familyName) {
      done(new Error("Name not found"), undefined);
    }
    return [name.givenName, name.familyName];
  }

  private assertPhotoExist(photos: any, done: VerifyCallback): string {
    if (!photos || !photos[0]) {
      done(new Error("Photo not found"), undefined);
    }
    return photos[0].value;
  }
}
