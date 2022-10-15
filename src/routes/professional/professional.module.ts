import { Module } from "@nestjs/common";
import { ProfessionalController } from "./professional.controller";
import { ProfessionalService } from "./professional.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfessionalSchema, ServiceSchema } from "../../models/schemas";
import { ClashHelper } from "../../common/helpers";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Professional", schema: ProfessionalSchema },
    { name: "Service", schema: ServiceSchema }
  ])],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ClashHelper]
})
export class ProfessionalModule {
}
