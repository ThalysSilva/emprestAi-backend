import { amountByPersonType } from 'src/consts/person';
import {
  getIdentificationType,
  isValidPersonIdentification,
} from 'src/utils/functions/person';
import { z } from 'zod';

export const createLoanSchema = z
  .object({
    personId: z.string().refine((value) => {
      return isValidPersonIdentification(value);
    }),
    amount: z.number().positive(),
    installmentsQty: z.number().int().positive(),
  })
  .refine(({ amount, personId }) => {
    const identificationType = getIdentificationType(personId);
    const { maximumTotalAmount } = amountByPersonType[identificationType];
    const isValidTotalAmount = amount <= maximumTotalAmount;

    return isValidTotalAmount;
  }, 'Invalid amount')
  .refine(({ amount, installmentsQty, personId }) => {
    const identificationType = getIdentificationType(personId);
    const { minimumMonthAmount } = amountByPersonType[identificationType];
    const monthAmount = amount / installmentsQty;
    const isValidMonthAmount = monthAmount >= minimumMonthAmount;

    return isValidMonthAmount;
  }, 'Installments amount is below the minimum');

export type CreateLoanDto = Required<z.infer<typeof createLoanSchema>>;
