import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CustomerPromoCodeSchema, PromoCodeSchema, UserSchema } from "../../models/schemas";
import { GeneratorsHelper } from "../../common/helpers";
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema },
    { name: "PromoCode", schema: PromoCodeSchema },
    { name: "CustomerPromoCode", schema: CustomerPromoCodeSchema }

  ]),
    JwtModule.register({})],
  controllers: [CustomerController],
  providers: [CustomerService, GeneratorsHelper]
})
export class CustomerModule {
}
