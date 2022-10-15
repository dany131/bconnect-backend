import { Module } from "@nestjs/common";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfessionalSchema, ServiceSchema } from "../../models/schemas";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Service", schema: ServiceSchema },
    { name: "Professional", schema: ProfessionalSchema }
  ])],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {
}
