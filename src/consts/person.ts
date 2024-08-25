import {
  AmountLimits,
  PersonIdentificationType,
} from 'src/@types/entities/person';

export const amountByPersonType = {
  naturalPerson: {
    minimumMonthAmount: 1000,
    maximumTotalAmount: 100000,
  },
  legalPerson: {
    minimumMonthAmount: 300,
    maximumTotalAmount: 10000,
  },
  retiree: {
    minimumMonthAmount: 400,
    maximumTotalAmount: 25000,
  },
  student: {
    minimumMonthAmount: 100,
    maximumTotalAmount: 10000,
  },
} as Record<PersonIdentificationType, AmountLimits>;

export const personIdentificationLength = {
  naturalPerson: 11,
  legalPerson: 14,
  retiree: 10,
  student: 8,
} as Record<PersonIdentificationType, number>;
