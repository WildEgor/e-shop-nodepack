import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {RESTController} from '../../shared/decorators/rest.controller';
import {BadRequestException, Body, Get, Post, Version} from '@nestjs/common';
import {SimUtils} from '../../shared/utils/sim.utils';
import {IServiceResponse, ResponseFactory} from "../../../libs/core/dtos";
import {ValidDto, ValidResponse} from "./dtos/valid.dto";

@ApiTags('Test Controller')
@RESTController()
export class TestController {

  @ApiOperation({})
  @Version('1')
  @Get('simulator/cpu-usage')
  public async test(): Promise<void> {
    await SimUtils.cpuUsage(100)
  }

  @ApiOperation({})
  @ApiResponse({
    type: ValidResponse,
  })
  @Version('1')
  @Get('response')
  public async resp(): Promise<ValidResponse> {
    const resp = ResponseFactory.init();
    await SimUtils.cpuUsage(0.1)

    resp.data('test')
    // resp.error({
    //   key: 0,
    //   message: 'err'
    // })

    return resp.toJSON()
  }

  @ApiOperation({})
  @Version('1')
  @Post('exception')
  public async exception(
    @Body() dto: ValidDto,
  ): Promise<IServiceResponse<unknown>> {
    throw new BadRequestException()
  }
}
