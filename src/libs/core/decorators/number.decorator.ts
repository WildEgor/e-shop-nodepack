import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

const lengthValidation = (min: number, max: number): string => `Введите число от ${min} до ${max}`;

export const MinMaxNumber = (
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
): ReturnType<typeof applyDecorators> => applyDecorators(
  Transform(p => Number.parseInt(p.value)),
  IsNumber({ allowNaN: false }),
  Min(min, { message: lengthValidation(min, max) }),
  Max(max, { message: lengthValidation(min, max) }),
);
