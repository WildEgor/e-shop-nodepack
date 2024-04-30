import { HttpException, HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { ValidationError } from 'class-validator';
import { CommonErrorCodes } from '../dtos';

export const getAllConstraints = (errors: ValidationError[]): string[] => {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children) {
      const childConstraints = getAllConstraints(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
};

export const getCustomValidationError = (message: string | string[]): Record<string | number, unknown> => {
  if (Array.isArray(message)) {
    return {
      key: CommonErrorCodes.VALIDATION_ERROR,
      message: message.join('; ')
    };
  }

  return {
    key: CommonErrorCodes.VALIDATION_ERROR,
    message
  };
};

export const formatMessagePipe = (errors: ValidationError[]): HttpException => new HttpException(getCustomValidationError(getAllConstraints(errors)), HttpStatus.BAD_REQUEST);

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {

  constructor(
    opts: ValidationPipeOptions
  ) {
    super(opts);

    this.exceptionFactory = formatMessagePipe;
  }

}
