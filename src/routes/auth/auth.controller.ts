import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { LoginDto, SignupDto } from "../../dto/auth";
import { ApiResponse } from "@nestjs/swagger";


@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SIGNUP })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.EMAIL_EXISTS })
  async signUp(@Body() reqBody: SignupDto) {
    return await this.authService.signUp(reqBody);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.LOGIN })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.USER_NOT_EXISTS} or ${ErrorResponseMessages.INVALID_PASSWORD}`
  })
  async login(@Body() reqBody: LoginDto) {
    return await this.authService.login(reqBody);
  }

}
