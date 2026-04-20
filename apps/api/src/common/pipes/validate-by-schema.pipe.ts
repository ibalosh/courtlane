import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ParseSchema } from '../schema.types';

@Injectable()
export class ValidateBySchemaPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ParseSchema<T>) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);

    if (result.success) {
      return result.data;
    }

    throw new BadRequestException({
      message: `Invalid ${metadata.type ?? 'input'}`,
      errors: result.error.flatten(),
    });
  }
}
