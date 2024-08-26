import { amountByPersonType } from 'src/consts/person';
import { toBrazilianCurrency } from 'src/utils/formatters/mask';
import {
  getIdentificationType,
  validatePersonIdentification,
} from 'src/utils/functions/person';
import { z } from 'zod';

export const createLoanSchema = z
  .object({
    personId: z.string().refine((value) => {
      const { isValid } = validatePersonIdentification(value);
      return isValid;
    }, 'Identificação inválida'),
    amount: z.number().positive(),
    installmentsQty: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    const { amount, personId, installmentsQty } = data;
    const identificationType = getIdentificationType(personId);
    const { maximumTotalAmount, minimumMonthAmount } =
      amountByPersonType[identificationType];

    if (amount > maximumTotalAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Valor total do empréstimo (${toBrazilianCurrency(amount)}) excede o limite (${toBrazilianCurrency(maximumTotalAmount)})`,
      });
    }

    const monthAmount = amount / installmentsQty;
    if (monthAmount < minimumMonthAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Valor da parcela (${toBrazilianCurrency(monthAmount.toFixed(2))}) inferior ao permitido (${toBrazilianCurrency(minimumMonthAmount)})`,
      });
    }
  });

export type CreateLoanDto = Required<z.infer<typeof createLoanSchema>>;
