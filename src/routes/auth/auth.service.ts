import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserModel } from "../../models/schemas";
import { DateHelper, GeneratorsHelper, RemoteHelper } from "../../common/helpers";
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
              private readonly configService: ConfigService,
              private readonly dateHelper: DateHelper,
              private readonly remoteHelper: RemoteHelper) {
  }

  // Customer will be unique for a business
  async signUp(businessId: number, signUpObj: SignupDto) {
    const { userName, email, password, phoneNumber } = signUpObj;
    const userExists = await this.User.findOne({ email, businessId });
    if (userExists) throw new BadRequestException(ErrorResponseMessages.EMAIL_EXISTS);
    let newUser: any;
    newUser = new this.User({
      userName,
      email,
      password,
      phoneNumber,
      businessId,
      profilePicture: "placeholder.png"
    });
    newUser.password = await this.generator.hashData(password);
    await newUser.save();
    // Create remote session
    const remoteSession = await this.remoteHelper.createSession();
    const userNames = userName.split(" ");
    const firstName = (userNames[0]) ? userNames[0] : ".";
    const lastName = (userNames[1]) ? userNames[1] : ".";
    const utcNow = await this.dateHelper.utcDateTimeNow();
    const date = utcNow.split("T")[0];
    const time = utcNow.split("T")[1].split(".")[0];
    try {
      // Create remote subscriber
      await this.remoteHelper.createRemoteCustomer(remoteSession.xsrfToken, remoteSession.laravelToken,
        firstName, lastName, phoneNumber, businessId, `${date} ${time}`);
      const tokens = await this.generator.getTokens(newUser._id.toString(), newUser.createdAt);
      newUser.password = undefined;
      newUser.verificationCode = undefined;
      return { message: SuccessResponseMessages.SIGNUP, data: { user: newUser, tokens } };
    } catch (error) {
      await this.User.deleteOne({ _id: newUser._id });
      throw new BadRequestException(ErrorResponseMessages.INVALID_DATA);
    }
  }

  async login(businessId: number, loginObj: LoginDto) {
    let user: any;
    let tokens: any;
    const { email, password, role } = loginObj;
    if (role === Role.Customer) {
      user = await this.User.findOne({ email, businessId });
      if (!user) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) throw new BadRequestException(ErrorResponseMessages.INVALID_PASSWORD);
      user.password = undefined;
      user.isBusiness = false;
      tokens = await this.generator.getTokens(user._id.toString(), user.createdAt);
    } else {
      const remoteSession = await this.remoteHelper.createSession();
      try {
        const businessLogin = await this.remoteHelper.businessLogin(remoteSession.xsrfToken, remoteSession.laravelToken, email, password);
        user = businessLogin.data.businessData;
        user.isBusiness = true;
        tokens = await this.generator.getTokens(user.id.toString(), user.created_at);
      } catch (e) {
        throw new BadRequestException(ErrorResponseMessages.INVALID_PASSWORD);
      }
    }
    return { message: SuccessResponseMessages.LOGIN, data: { user, tokens } };
  }

}
