import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserModel } from "../../models/schemas";
import { GeneratorsHelper } from "../../common/helpers";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { LoginDto, SignupDto } from "../../dto/auth";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Role } from "../../common/enums";


@Injectable()
export class AuthService {

  constructor(@InjectModel("User") private readonly User: Model<UserModel>,
              private generator: GeneratorsHelper,
              private readonly httpService: HttpService,
              private readonly configService: ConfigService) {
  }

  // Customer will be unique for a business
  async signUp(signUpObj: SignupDto) {
    const { userName, email, password, phoneNumber, businessId } = signUpObj;
    const userExists = await this.User.findOne({ email, businessId });
    if (userExists) throw new BadRequestException(ErrorResponseMessages.EMAIL_EXISTS);
    const newUser: any = new this.User({
      userName,
      email,
      password,
      phoneNumber,
      businessId,
      // verificationCode: "",
      profilePicture: "placeholder.png"
    });
    newUser.password = await this.generator.hashData(password);
    await newUser.save();
    const tokens = await this.generator.getTokens(newUser._id.toString(), newUser.createdAt);
    newUser.password = undefined;
    newUser.verificationCode = undefined;
    return { message: SuccessResponseMessages.SIGNUP, data: { user: newUser, tokens } };
  }

  async login(loginObj: LoginDto) {
    let user: any;
    let tokens: any;
    const { email, password, businessId, role } = loginObj;
    if (role === Role.Customer) {
      user = await this.User.findOne({ email, businessId });
      if (!user) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) throw new BadRequestException(ErrorResponseMessages.INVALID_PASSWORD);
      user.password = undefined;
      user.isBusiness = false;
      tokens = await this.generator.getTokens(user._id.toString(), user.createdAt);
    } else {
      const remoteBaseUrl = this.configService.get<string>("REMOTE_BASE_URL");
      const session = await this.httpService.axiosRef.get(`${remoteBaseUrl}/sanctum/csrf-cookie`);
      const xsrf = session.headers["set-cookie"][0];
      const xsrfOnly = xsrf.split(";")[0];
      const token = xsrfOnly.split("%")[0];
      const xsrfToken = token.split("=")[1];
      const laravelSession = session.headers["set-cookie"][1];
      const laravelToken = laravelSession.split(";")[0];
      // this.httpService.axiosRef.defaults.headers.common["X-XSRF-TOKEN"] = newToken;
      // this.httpService.axiosRef.defaults.headers["Cookie"] = `${xsrfToken}; ${laravelToken}`;
      try {
        const response = await this.httpService.axiosRef.post(`https://api.bconnect-staging.com/api/login`, {
            email,
            password
          },
          {
            headers: {
              "X-XSRF-TOKEN": `${xsrfToken}`,
              "Content-Type": "application/json",
              "Cookie": `${xsrfToken}; ${laravelToken};`
            }
          });
        if (response.status === 201) {
          user = response.data.businessData;
          user.isBusiness = true;
          tokens = await this.generator.getTokens(user.id.toString(), user.created_at);
        }
      } catch (e) {
        throw new BadRequestException(ErrorResponseMessages.INVALID_PASSWORD);
      }
    }
    return { message: SuccessResponseMessages.LOGIN, data: { user, tokens } };
  }


}
