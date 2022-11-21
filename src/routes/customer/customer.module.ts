import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema, CustomerPromoCodeSchema, PromoCodeSchema, UserSchema } from "../../models/schemas";
import { GeneratorsHelper, RegexHelper, RemoteHelper } from "../../common/helpers";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema },
    { name: "PromoCode", schema: PromoCodeSchema },
    { name: "CustomerPromoCode", schema: CustomerPromoCodeSchema },
    { name: "Booking", schema: BookingSchema }
  ]),
    HttpModule,
    JwtModule.register({})],
  controllers: [CustomerController],
  providers: [CustomerService, GeneratorsHelper, RemoteHelper, RegexHelper]
})
export class CustomerModule {
}
