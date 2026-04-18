import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

type HttpExceptionBody = {
  message?: string | string[];
  error?: string;
};

function normalizeMessage(message: HttpExceptionBody['message']) {
  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const rawBody = isHttpException
      ? (exception.getResponse() as string | HttpExceptionBody)
      : null;
    const body =
      typeof rawBody === 'string' ? { message: rawBody } : (rawBody ?? {});

    const responseBody: Record<string, unknown> = {
      message:
        normalizeMessage(body.message) ??
        (isHttpException ? exception.message : 'Internal server error.'),
      error: body.error ?? HttpStatus[status] ?? 'Error',
      statusCode: status,
    };

    response.status(status).json(responseBody);
  }
}
