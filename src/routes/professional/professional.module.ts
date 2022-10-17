import { Module } from "@nestjs/common";
import { ProfessionalController } from "./professional.controller";
import { ProfessionalService } from "./professional.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfessionalSchema, ServiceSchema, WorkingScheduleSchema } from "../../models/schemas";
import { ClashHelper, DateHelper } from "../../common/helpers";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Professional", schema: ProfessionalSchema },
    { name: "Service", schema: ServiceSchema },
    { name: "WorkingSchedule", schema: WorkingScheduleSchema }

  ])],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ClashHelper, DateHelper]
})
export class ProfessionalModule {
}
