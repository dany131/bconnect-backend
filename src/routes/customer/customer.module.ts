import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CustomerPromoCodeSchema, PromoCodeSchema, UserSchema } from "../../models/schemas";
import { GeneratorsHelper, RemoteHelper } from "../../common/helpers";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema },
    { name: "PromoCode", schema: PromoCodeSchema },
    { name: "CustomerPromoCode", schema: CustomerPromoCodeSchema }

  ]),
    HttpModule,
    JwtModule.register({})],
  controllers: [CustomerController],
  providers: [CustomerService, GeneratorsHelper, RemoteHelper]
})
export class CustomerModule {
}
