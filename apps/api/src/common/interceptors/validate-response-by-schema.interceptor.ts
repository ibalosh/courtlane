import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ParseSchema } from '../schema.types';

@Injectable()
export class ValidateResponseBySchemaInterceptor<T> implements NestInterceptor<unknown, T> {
  constructor(private readonly schema: ParseSchema<T>) {}

  intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<T> {
    return next.handle().pipe(
      map((value) => {
        const result = this.schema.safeParse(value);

        if (result.success) {
          return result.data;
        }

        throw new BadRequestException({
          message: 'Invalid response',
          errors: result.error.flatten(),
        });
      }),
    );
  }
}
