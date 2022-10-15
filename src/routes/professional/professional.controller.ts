import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProfessionalService } from "./professional.service";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { CreateProfessionalDto } from "../../dto/professional";
import { ValidateMongoId } from "../../common/pipes";
import { PaginationParamsDto } from "../../dto/pagination";
import { Public } from "../../common/decorators";
import { BusinessIdDto } from "../../dto/query-params";


@ApiTags("Professional")
@Controller("professional")
export class ProfessionalController {
  constructor(private professionalService: ProfessionalService) {
  }

  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async createProfessional(@Query() query: BusinessIdDto, @Body() reqBody: CreateProfessionalDto) {
    return await this.professionalService.createProfessional(query.businessId, reqBody);
  }

  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async updateProfessional(@Query("professionalId", ValidateMongoId) professionalId: string,
                           @Body() reqBody: CreateProfessionalDto) {
    return await this.professionalService.updateProfessional(professionalId, reqBody);
  }

  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.DELETED })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.NOT_PROFESSIONAL })
  async deleteProfessional(@Query("professionalId", ValidateMongoId) professionalId: string) {
    return await this.professionalService.deleteProfessional(professionalId);
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getProfessional(@Query("professionalId", ValidateMongoId) professionalId: string) {
    return await this.professionalService.getProfessional(professionalId);
  }

  @Public()
  @Get("business")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBusinessProfessionals(@Query() queryBusiness: BusinessIdDto,
                                 @Query() query: PaginationParamsDto) {
    return await this.professionalService.getBusinessProfessionals(queryBusiness.businessId, query.page, query.limit);
  }

  @Public()
  @Get("service")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getServiceProfessionals(@Query() queryBusiness: BusinessIdDto,
                                @Query("serviceId", ValidateMongoId) serviceId: string,
                                @Query() query: PaginationParamsDto) {
    return await this.professionalService.getServiceProfessionals(queryBusiness.businessId, serviceId, query.page, query.limit);
  }

}

