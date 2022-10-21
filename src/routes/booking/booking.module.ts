import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  BookingSchema,
  ProfessionalSchema,
  ServiceSchema,
  UserSchema,
  WorkingScheduleSchema
} from "../../models/schemas";
import { DateHelper, RemoteHelper } from "../../common/helpers";
import { HttpModule } from "@nestjs/axios";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema },
    { name: "Booking", schema: BookingSchema },
    { name: "Professional", schema: ProfessionalSchema },
    { name: "Service", schema: ServiceSchema },
    { name: "WorkingSchedule", schema: WorkingScheduleSchema }
  ]), HttpModule],
  controllers: [BookingController],
  providers: [BookingService, DateHelper, RemoteHelper]
})
export class BookingModule {
}
