import { ServicesService } from "./services.service";
import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post, Put,
  Query, UploadedFile
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { ValidateMongoId } from "../../common/pipes";
import { PaginationParamsDto } from "../../dto/pagination";
import { ImageUpload, Public } from "../../common/decorators";
import { CreateServiceDto } from "../../dto/services";
import { BusinessIdDto } from "../../dto/query-params";


@ApiTags("Service")
@Controller("service")
export class ServicesController {

  constructor(private servicesService: ServicesService) {
  }

  @Post("/")
  @ImageUpload("media", false)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async createService(@Query() query: BusinessIdDto,
                      @Body() reqBody: CreateServiceDto,
                      @UploadedFile() file: Express.Multer.File) {
    return await this.servicesService.createService(query.businessId, reqBody, file);
  }

  @Put("/")
  @ImageUpload("media", false)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async updateService(@Query("serviceId", ValidateMongoId) serviceId: string,
                      @Body() reqBody: CreateServiceDto,
                      @UploadedFile() file: Express.Multer.File) {
    return await this.servicesService.updateService(serviceId, reqBody, file);
  }

  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.DELETED })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.NOT_SERVICE })
  async deleteService(@Query("serviceId", ValidateMongoId) serviceId: string) {
    return await this.servicesService.deleteService(serviceId);
  }

  @Public()
  @Get("all")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getServices(@Query() queryBusiness: BusinessIdDto,
                    @Query() query: PaginationParamsDto) {
    return await this.servicesService.getBusinessServices(queryBusiness.businessId, query.page, query.limit);
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getService(@Query("serviceId", ValidateMongoId) serviceId: string) {
    return await this.servicesService.getService(serviceId);
  }

}
