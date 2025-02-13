import { BadRequestException } from '@nestjs/common';
import { personIdentificationLength } from 'src/consts/person';
import {
  validateCNPJ,
  validateCPF,
  validateRetireeIdentification,
  validateStudentIdentification,
} from './verification';
import { PersonIdentificationType } from 'src/@entities/person';

export function getIdentificationType(identification: string) {
  const identificationTypeEntries = Object.entries(
    personIdentificationLength,
  ) as [PersonIdentificationType, number][];

  const identificationType = identificationTypeEntries.find(([, length]) => {
    return identification.length === length;
  })?.[0];

  if (!identificationType) {
    throw new BadRequestException('Identificação inválida');
  }

  return identificationType;
}

export function validatePersonIdentification(identification: string) {
  const identificationType = getIdentificationType(identification);

  if (identificationType === 'naturalPerson') {
    const isValid = validateCPF(identification);
    return {
      isValid,
      identificationType,
    };
  }

  if (identificationType === 'legalPerson') {
    const isValid = validateCNPJ(identification);
    return {
      isValid,
      identificationType,
    };
  }

  if (identificationType === 'student') {
    const isValid = validateStudentIdentification(identification);
    return {
      isValid,
      identificationType,
    };
  }

  if (identificationType === 'retiree') {
    const isValid = validateRetireeIdentification(identification);
    return {
      isValid,
      identificationType,
    };
  }
  return {
    isValid: false,
  };
}
