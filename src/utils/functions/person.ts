import { BadRequestException } from '@nestjs/common';
import { PersonIdentificationType } from 'src/@types/entities/person';
import { personIdentificationLength } from 'src/consts/person';

export function getIdentificationType(identification: string) {
  const identificationTypeEntries = Object.entries(
    personIdentificationLength,
  ) as [PersonIdentificationType, number][];

  const identificationType = identificationTypeEntries.find(([, length]) => {
    return identification.length === length;
  })?.[0];

  if (!identificationType) {
    throw new BadRequestException('Invalid identification');
  }

  return identificationType;
}

export function isValidPersonIdentification(
  identification: string,
  identificationType?: PersonIdentificationType,
) {
  if (!identificationType) {
    const identificationLengths = Object.values(personIdentificationLength);
    return identificationLengths.includes(length);
  }
  const identificationLength = personIdentificationLength[identificationType];
  return identification.length === identificationLength;
}
