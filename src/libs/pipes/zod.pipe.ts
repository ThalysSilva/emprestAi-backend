import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { doNothing } from 'src/utils/functions/general';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    doNothing(metadata);
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const typedError = error as ZodError;
      const firstError = typedError.errors[0];

      throw new BadRequestException(firstError.message);
    }
  }
}
