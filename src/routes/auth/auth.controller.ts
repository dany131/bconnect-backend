import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { LoginDto, SignupDto } from "../../dto/auth";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { BusinessIdDto } from "../../dto/query-params";


@ApiTags("Auth")
@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SIGNUP })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.EMAIL_EXISTS })
  async signUp(@Query() query: BusinessIdDto, @Body() reqBody: SignupDto) {
    return await this.authService.signUp(query.businessId, reqBody);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.LOGIN })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.USER_NOT_EXISTS} or ${ErrorResponseMessages.INVALID_PASSWORD}`
  })
  async login(@Query() query: BusinessIdDto, @Body() reqBody: LoginDto) {
    return await this.authService.login(query.businessId, reqBody);
  }

}
