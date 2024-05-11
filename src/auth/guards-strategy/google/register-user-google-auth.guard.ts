import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ICodeRepository,
  I_CODE_REPOSITORY,
} from "../../../users/ports/code-repository.interface";

@Injectable()
export class RegisterUserGoogleAuthGuard extends AuthGuard("googleRegister") {
  constructor(
    @Inject(I_CODE_REPOSITORY) private readonly codeRepository: ICodeRepository,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const codeRegister = this.getRequest(context).query.codeRegister;
    const codeDB = await this.codeRepository.findRegisterUserCode();

    if (!codeDB || !codeDB.isSame(codeRegister)) {
      throw new UnauthorizedException();
    }

    return (await super.canActivate(context)) ? true : false;
  }
}
