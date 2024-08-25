export type PersonIdentificationType =
  | 'naturalPerson'
  | 'legalPerson'
  | 'student'
  | 'retiree';

export type AmountLimits = {
  minimumMonthAmount: number;
  maximumTotalAmount: number;
};

export type Person = {
  name: string;
  identification: string;
  birthdate: Date;
  identificationType: PersonIdentificationType;
} & AmountLimits;
