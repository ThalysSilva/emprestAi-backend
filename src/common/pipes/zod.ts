import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodTypeAny } from 'zod';
import { BadRequestError } from '../applicationError';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodTypeAny) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value; // Só valida o corpo da requisição
    }

    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors = result.error.errors
        .map((error) => error.message)
        .join(', ');
      throw new BadRequestError({
        message: errors,
        action: 'validateBody',
        saveLog: false,
        details: {
          errors: result.error.errors,
        },
      });
    }

    return result.data; // Retorna os dados validados e normalizados
  }
}
