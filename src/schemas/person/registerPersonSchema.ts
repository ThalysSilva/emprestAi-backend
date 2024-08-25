import moment from 'moment';
import { personIdentificationLength } from 'src/consts/person';
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
    }, 'Invalid birthdate'),
  identification: z
    .string()
    .min(1)
    .refine(({ length }) => {
      const identificationLengths = Object.values(personIdentificationLength);
      return identificationLengths.includes(length);
    }, 'Invalid identification'),
});

export type RegisterPersonDto = Required<z.infer<typeof registerPersonSchema>>;
