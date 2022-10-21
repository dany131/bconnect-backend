import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../models/schemas";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "../../common/strategies";
import { DateHelper, GeneratorsHelper, RemoteHelper } from "../../common/helpers";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema }
  ]),
    JwtModule.register({}), HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy,
    GeneratorsHelper, DateHelper, RemoteHelper]
})
export class AuthModule {
}
