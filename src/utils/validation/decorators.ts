import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { doNothing } from '../functions/general';
import { removeNotNumbers } from '../functions/masks';

@ValidatorConstraint({ name: 'isNumberCustom', async: false })
export class IsNumberCustom implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    doNothing(args);
    return typeof value === 'number';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} deve ser um número válido.`;
  }
}



@ValidatorConstraint({ name: 'validateCEP', async: false })
export class ValidarCEP implements ValidatorConstraintInterface {
  validate(cep: string) {
    const normalizedCep = removeNotNumbers(cep);
    return normalizedCep.length === 8 && /^\d{8}$/.test(normalizedCep);
  }

  defaultMessage() {
    return 'O CEP informado não é válido. Deve conter exatamente 8 dígitos.';
  }
}


@ValidatorConstraint({ name: 'validateCNPJ', async: false })
export class ValidarCNPJ implements ValidatorConstraintInterface {
  validate(cnpj: string) {
    const normalizedCpf = removeNotNumbers(cnpj);
    if (normalizedCpf.length !== 14 || /^(.)\1+$/.test(normalizedCpf)) {
      return false;
    }

    function calculateVerifierDigitCNPJ(cnpj: string, fatores: number[]) {
      const sum = cnpj
        .split('')
        .reduce(
          (acc, digit, index) => acc + parseInt(digit) * fatores[index],
          0,
        );
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    }

    const firstFactors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondFactors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const verifiedDigitA = calculateVerifierDigitCNPJ(
      normalizedCpf.slice(0, 12),
      firstFactors,
    );
    const verifiedDigitB = calculateVerifierDigitCNPJ(
      normalizedCpf.slice(0, 12) + verifiedDigitA,
      secondFactors,
    );

    return (
      verifiedDigitA === parseInt(normalizedCpf[12]) &&
      verifiedDigitB === parseInt(normalizedCpf[13])
    );
  }

  defaultMessage() {
    return 'O CNPJ informado não é válido.';
  }
}

@ValidatorConstraint({ name: 'validateCPF', async: false })
export class ValidarCPF implements ValidatorConstraintInterface {
  validate(cpf: string) {
    const normalizedCpf = removeNotNumbers(cpf);

    if (normalizedCpf.length !== 11 || /^(.)\1+$/.test(normalizedCpf)) {
      return false;
    }

    function calculateVerifiedDigit(digits: string, factor: number): number {
      const sum = digits
        .split('')
        .reduce(
          (acc, digit, index) => acc + parseInt(digit) * (factor - index),
          0,
        );
      const rest = (sum * 10) % 11;
      return rest === 10 ? 0 : rest;
    }

    const verifiedDigitA = calculateVerifiedDigit(
      normalizedCpf.slice(0, 9),
      10,
    );
    if (verifiedDigitA !== parseInt(normalizedCpf[9])) {
      return false;
    }

    const verifiedDigitB = calculateVerifiedDigit(
      normalizedCpf.slice(0, 10),
      11,
    );
    if (verifiedDigitB !== parseInt(normalizedCpf[10])) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'O CPF informado não é válido.';
  }
}