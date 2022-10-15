import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { BusinessIdDto } from "../../dto/query-params";
import { ValidateMongoId } from "../../common/pipes";
import { Public } from "../../common/decorators";
import { PaginationParamsDto } from "../../dto/pagination";
import { BusinessSettingService } from "./business-setting.service";
import { CreatePromoCodeDto, CreateScheduleDto } from "../../dto/business-setting";


@ApiTags("Business Settings")
@Controller("business-setting")
export class BusinessSettingController {

  constructor(private businessSettingService: BusinessSettingService) {
  }

  @Post("promo-code")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async createPromoCode(@Query() query: BusinessIdDto,
                        @Body() reqBody: CreatePromoCodeDto) {
    return await this.businessSettingService.createPromoCode(query.businessId, reqBody);
  }

  @Put("promo-code")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async updatePromoCode(@Query("promoCodeId", ValidateMongoId) promoCodeId: string,
                        @Body() reqBody: CreatePromoCodeDto) {
    return await this.businessSettingService.updatePromoCode(promoCodeId, reqBody);
  }

  @Delete("promo-code")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.DELETED })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.NOT_EXISTS })
  async deletePromoCode(@Query("promoCodeId", ValidateMongoId) promoCodeId: string) {
    return await this.businessSettingService.deletePromoCode(promoCodeId);
  }

  @Public()
  @Get("promo-code")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getProfessional(@Query("promoCodeId", ValidateMongoId) promoCodeId: string) {
    return await this.businessSettingService.getPromoCode(promoCodeId);
  }

  @Public()
  @Get("promo-code/business")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBusinessPromoCodes(@Query() queryBusiness: BusinessIdDto,
                              @Query() query: PaginationParamsDto) {
    return await this.businessSettingService.getBusinessPromoCodes(queryBusiness.businessId, query.page, query.limit);
  }

  @Post("schedule")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async createWorkingSchedule(@Query() query: BusinessIdDto,
                              @Body() reqBody: CreateScheduleDto) {
    return await this.businessSettingService.createWorkingSchedule(query.businessId, reqBody);
  }

  @Put("schedule")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async updateWorkingSchedule(@Query("scheduleId", ValidateMongoId) scheduleId: string,
                              @Body() reqBody: CreateScheduleDto) {
    return await this.businessSettingService.updateWorkingSchedule(scheduleId, reqBody);
  }

  @Public()
  @Get("schedule")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getWorkingSchedule(@Query("scheduleId", ValidateMongoId) scheduleId: string) {
    return await this.businessSettingService.getWorkingSchedule(scheduleId);
  }

  @Public()
  @Get("schedule/business")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBusinessWorkingSchedule(@Query() queryBusiness: BusinessIdDto) {
    return await this.businessSettingService.getBusinessWorkingSchedule(queryBusiness.businessId);
  }

  // @Public()
  // @Get("test")
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  // async test() {
  //   return await this.businessSettingService.test();
  // }

}
