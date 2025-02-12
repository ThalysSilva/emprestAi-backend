import { Decimal } from '@prisma/client/runtime/library';

type ConvertDecimalAttributes<T> = {
  [K in keyof T]: T[K] extends Date
    ? T[K]
    : T[K] extends Decimal
      ? number
      : T[K] extends Array<infer U>
        ? ConvertDecimalAttributes<U>[]
        : T[K] extends object
          ? ConvertDecimalAttributes<T[K]>
          : T[K];
};

export function convertDecimalAttributes<T>(
  data: T,
): ConvertDecimalAttributes<T> {
  if (!data) {
    return data as ConvertDecimalAttributes<T>;
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      convertDecimalAttributes(item),
    ) as ConvertDecimalAttributes<T>;
  }

  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value instanceof Date) {
          return [key, value];
        }
        if (value instanceof Decimal) {
          return [key, value.toNumber()];
        }
        if (typeof value === 'object' && value !== null) {
          return [key, convertDecimalAttributes(value)];
        }
        return [key, value];
      }),
    ) as ConvertDecimalAttributes<T>;
  }

  return data as ConvertDecimalAttributes<T>;
}
