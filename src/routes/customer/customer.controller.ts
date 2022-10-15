import { Body, Controller, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseMessages } from "../../common/messages";
import { BusinessIdDto } from "../../dto/query-params";
import { ValidateMongoId } from "../../common/pipes";
import { CustomerService } from "./customer.service";
import { SignupDto } from "../../dto/auth";
import { ChangePasswordDto } from "../../dto/customer";


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
                              @Body() reqBody: SignupDto) {
    return await this.customerService.updateCustomerDetails(query.businessId, customerId, reqBody);
  }

  @Put("password")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async changeCustomerPassword(@Query("customerId", ValidateMongoId) customerId: string,
                               @Body() reqBody: ChangePasswordDto) {
    return await this.customerService.changeCustomerPassword(customerId, reqBody);
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

}
