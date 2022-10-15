import { Module } from "@nestjs/common";
import { BusinessSettingController } from "./business-setting.controller";
import { BusinessSettingService } from "./business-setting.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PromoCodeSchema, WorkingScheduleSchema } from "../../models/schemas";
import { DateHelper } from "../../common/helpers";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "PromoCode", schema: PromoCodeSchema },
    { name: "WorkingSchedule", schema: WorkingScheduleSchema }
  ])],
  controllers: [BusinessSettingController],
  providers: [BusinessSettingService, DateHelper]
})
export class BusinessSettingModule {
}
