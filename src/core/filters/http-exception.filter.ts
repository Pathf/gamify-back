import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { DomainError } from "../../shared/domain.error";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = this.buildHttpStatus(exception);
    const message = this.buildMessage(exception);

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      detail: {
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        timestamp: new Date().toISOString(),
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private buildMessage(exception: unknown): string {
    if (exception instanceof DomainError) {
      return exception.domainMessage;
    }
    if (exception instanceof HttpException) {
      return exception.message;
    }
    return "Internal server error";
  }

  private buildHttpStatus(exception: unknown): number {
    if (exception instanceof DomainError) {
      return HttpStatus.BAD_REQUEST;
    }
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
