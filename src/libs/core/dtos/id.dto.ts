import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UuidIdDto {

  @ApiProperty()
  @IsUUID('4')
  public id!: string;

}
