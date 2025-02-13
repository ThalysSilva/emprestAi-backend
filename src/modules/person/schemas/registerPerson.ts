import { personIdentificationLength } from 'src/consts/person';
import { z } from 'zod';
import moment from 'moment-timezone';
import { validatePersonIdentification } from 'src/utils/functions/person';
import { createZodDto } from '@anatine/zod-nestjs';

export const registerPersonSchema = z.object({
  name: z.string().min(3),
  birthdate: z
    .string()
    .min(1)
    .refine((value) => {
      const date = moment(value);
      const today = moment();
      const isValidBirthdate = date.isValid() && date.isBefore(today);
      return isValidBirthdate;
    }, 'Data de   aniversário inválida'),
  identification: z
    .string()
    .min(1)
    .refine((identification) => {
      const identificationLengths = Object.values(personIdentificationLength);
      const isValidLength = identificationLengths.includes(
        identification.length,
      );
      if (!isValidLength) return false;
      const { isValid } = validatePersonIdentification(identification);
      return isValid;
    }, 'Identificação inválida'),
});

export type RegisterPersonSchemaData = Required<
  z.infer<typeof registerPersonSchema>
>;
export class RegisterPersonDto extends createZodDto(registerPersonSchema) {}
