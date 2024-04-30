import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";
import {ServiceResponseDto} from "../../../../libs/core/dtos";

export class ValidDto {

  @ApiProperty()
  @IsString()
  str!: string
}

export class ValidResponse extends ServiceResponseDto<string> {

  @ApiProperty({
    isArray: true,
    type: String,
  })
  public data: string[];

  constructor(data: string[]) {
    super();

    this.data = data;
  }
}
