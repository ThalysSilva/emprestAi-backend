import { personIdentificationLength } from 'src/consts/person';

export function calculateCheckDigit(digits: string, factor: number): number {
  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + parseInt(digit) * (factor - index), 0);
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function validateCPF(cpf: string): boolean {
  const cpfNormalized = cpf.replace(/[^\d]+/g, '');
  if (cpfNormalized.length !== 11 || /^(.)\1+$/.test(cpfNormalized)) {
    return false;
  }
  const checkDigit1 = calculateCheckDigit(cpfNormalized.slice(0, 9), 10);
  if (checkDigit1 !== parseInt(cpfNormalized[9])) {
    return false;
  }
  const checkDigit2 = calculateCheckDigit(cpfNormalized.slice(0, 10), 11);
  if (checkDigit2 !== parseInt(cpfNormalized[10])) {
    return false;
  }
  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  const cnpjNormalized = cnpj.replace(/[^\d]+/g, '');
  if (cnpjNormalized.length !== 14 || /^(.)\1+$/.test(cnpjNormalized)) {
    return false;
  }

  const calculateCNPJCheckDigit = (cnpj: string, factors: number[]): number => {
    const sum = cnpj
      .split('')
      .reduce((acc, digit, index) => acc + parseInt(digit) * factors[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstFactors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondFactors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const checkDigit1 = calculateCNPJCheckDigit(
    cnpjNormalized.slice(0, 12),
    firstFactors,
  );
  const checkDigit2 = calculateCNPJCheckDigit(
    cnpjNormalized.slice(0, 12) + checkDigit1,
    secondFactors,
  );

  return (
    checkDigit1 === parseInt(cnpjNormalized[12]) &&
    checkDigit2 === parseInt(cnpjNormalized[13])
  );
}

export function validateStudentIdentification(identification: string): boolean {
  const studentIdentificationLength = personIdentificationLength['student'];
  const isValidLength = identification.length === studentIdentificationLength;
  const correctSum = 9;
  const sumOfFirstAndLastDigits =
    parseInt(identification[0]) +
    parseInt(identification[studentIdentificationLength - 1]);

  return isValidLength && sumOfFirstAndLastDigits === correctSum;
}

export function validateRetireeIdentification(identification: string): boolean {
  const retireeIdentificationLength = personIdentificationLength['retiree'];
  const isValidLength = identification.length === retireeIdentificationLength;
  const lastDigit = parseInt(identification[retireeIdentificationLength - 1]);
  const restOfDigits = identification.slice(0, retireeIdentificationLength - 1);
  const notRepeatLastDigit = !restOfDigits.includes(lastDigit.toString());

  return isValidLength && notRepeatLastDigit;
}
