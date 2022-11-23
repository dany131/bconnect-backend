import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseMessages } from "../../common/messages";
import { BusinessIdDto } from "../../dto/query-params";
import { ValidateMongoId } from "../../common/pipes";
import { CustomerService } from "./customer.service";
import { PaginationParamsDto } from "../../dto/pagination";
import { SearchCustomerDto, UpdateCustomerDetailsDto } from "../../dto/customer";


@ApiTags("Customer")
@Controller("customer")
export class CustomerController {

  constructor(private customerService: CustomerService) {
  }

  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async updateCustomerDetails(@Query() query: BusinessIdDto,
                              @Query("customerId", ValidateMongoId) customerId: string,
                              @Body() reqBody: UpdateCustomerDetailsDto) {
    return await this.customerService.updateCustomerDetails(query.businessId, customerId, reqBody);
  }

  @Put("password")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async changeCustomerPassword(@Query("customerId", ValidateMongoId) customerId: string) {
    return await this.customerService.changeCustomerPassword(customerId);
  }

  @Post("issue-promo-code")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async issuePromoCode(@Query() query: BusinessIdDto,
                       @Query("customerId", ValidateMongoId) customerId: string,
                       @Query("promoCodeId", ValidateMongoId) promoCodeId: string) {
    return await this.customerService.issuePromoCode(query.businessId, customerId, promoCodeId);
  }

  @Get("business")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBusinessCustomers(@Query() queryBusiness: BusinessIdDto,
                             @Query() query: PaginationParamsDto) {
    return await this.customerService.getBusinessCustomers(queryBusiness.businessId, query.page, query.limit);
  }

  @Get("recent")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getRecentBookings(@Query("customerId", ValidateMongoId) customerId: string) {
    return await this.customerService.getRecentBookings(customerId);
  }

  @Get("search")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async searchCustomer(@Query() query: SearchCustomerDto,
                       @Query() pagination: PaginationParamsDto) {
    return await this.customerService.searchCustomer(query.searchQuery, pagination.page, pagination.limit);
  }

}
