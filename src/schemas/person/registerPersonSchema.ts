import moment from 'moment';
import { personIdentificationLength } from 'src/consts/person';
import { validatePersonIdentification } from 'src/utils/functions/person';
import { z } from 'zod';

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

export type RegisterPersonDto = Required<z.infer<typeof registerPersonSchema>>;
