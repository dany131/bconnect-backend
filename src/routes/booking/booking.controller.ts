import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { SuccessResponseMessages } from "../../common/messages";
import { BusinessIdDto } from "../../dto/query-params";
import { ValidateMongoId } from "../../common/pipes";
import { CreateBookingDto, FilterBookingsDto, RescheduleBookingDto } from "../../dto/booking";
import { PaginationParamsDto } from "../../dto/pagination";
import { Public } from "../../common/decorators";


@ApiTags("Booking")
@Controller("booking")
export class BookingController {

  constructor(private bookingService: BookingService) {
  }

  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async createBooking(@Query() query: BusinessIdDto,
                      @Query("customerId", ValidateMongoId) customerId: string,
                      @Body() reqBody: CreateBookingDto) {
    return await this.bookingService.createBooking(query.businessId, customerId, reqBody);
  }

  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async rescheduleBooking(@Query("bookingId", ValidateMongoId) bookingId: string,
                          @Body() reqBody: RescheduleBookingDto) {
    return await this.bookingService.rescheduleBooking(bookingId, reqBody);
  }

  @Put("cancel")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async cancelBooking(@Query("bookingId", ValidateMongoId) bookingId: string) {
    return await this.bookingService.cancelBooking(bookingId);
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBooking(@Query("bookingId", ValidateMongoId) bookingId: string) {
    return await this.bookingService.getBooking(bookingId);
  }

  @Public()
  @Get("business")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBusinessBookings(@Query() queryBusiness: BusinessIdDto,
                            @Query() query: PaginationParamsDto) {
    return await this.bookingService.getBusinessBookings(queryBusiness.businessId, query.page, query.limit);
  }

  @Public()
  @Get("business/service")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBusinessServiceBookings(@Query() queryBusiness: BusinessIdDto,
                                   @Query("serviceId", ValidateMongoId) serviceId: string,
                                   @Query() query: PaginationParamsDto) {
    return await this.bookingService.getBusinessServiceBookings(queryBusiness.businessId, serviceId, query.page, query.limit);
  }

  @Get("business/filter")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getFilteredBookings(@Query() queryBusiness: BusinessIdDto,
                            @Query() queryFilter: FilterBookingsDto,
                            @Query() query: PaginationParamsDto) {
    return await this.bookingService.getFilteredBookings(queryBusiness.businessId, queryFilter.isPrevious, query.page, query.limit);
  }

  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getBookingStats(@Query() queryBusiness: BusinessIdDto) {
    return await this.bookingService.getBookingStats(queryBusiness.businessId);
  }

  @Public()
  @Get("business/filter/customer")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getFilteredBookingsByCustomer(@Query("customerId", ValidateMongoId) customerId: string,
                                      @Query() queryFilter: FilterBookingsDto,
                                      @Query() query: PaginationParamsDto) {
    return await this.bookingService.getFilteredBookingsByCustomer(customerId, queryFilter.isPrevious, query.page, query.limit);
  }

  @Public()
  @Get("stats/customer")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getCustomerBookingStats(@Query("customerId", ValidateMongoId) customerId: string) {
    return await this.bookingService.getCustomerBookingStats(customerId);
  }

}
