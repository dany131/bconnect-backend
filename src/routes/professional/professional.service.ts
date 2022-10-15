import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ProfessionalModel, ServiceModel } from "../../models/schemas";
import { CreateProfessionalDto } from "../../dto/professional";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { ClashHelper } from "../../common/helpers";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";
import * as fs from "fs";


@Injectable()
export class ProfessionalService {

  constructor(@InjectModel("Professional") private readonly Professional: Model<ProfessionalModel>,
              @InjectModel("Service") private readonly Service: Model<ServiceModel>,
              private readonly configService: ConfigService,
              private readonly clashHelper: ClashHelper) {
  }

  // Add professional
  async createProfessional(businessId: number, professionalObj: CreateProfessionalDto, file: any) {
    const path = this.configService.get<string>("MEDIA_PATH");
    const { name, services, schedule } = professionalObj;
    if (schedule.length) if (this.clashHelper.containsWorkClash(schedule)) throw new BadRequestException(ErrorResponseMessages.WORK_SCHEDULE);
    let media = "placeholder.png";
    if (file) {
      const mimeType = file.mimetype.split("/");
      const fileName = `${nanoid()}.` + mimeType[1];
      fs.writeFileSync(path + fileName, file.buffer, "utf8");
      media = fileName;
    }
    const professional = new this.Professional({ businessId, name, media, services, schedule });
    await professional.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { professional } };
  }

  // Update professional
  async updateProfessional(professionalId: string, professionalObj: CreateProfessionalDto, file: any) {
    const path = this.configService.get<string>("MEDIA_PATH");
    const professional = await this.Professional.findById(professionalId);
    if (!professional) throw new BadRequestException(ErrorResponseMessages.NOT_PROFESSIONAL);
    const { name, services, schedule } = professionalObj;
    if (schedule.length) if (this.clashHelper.containsWorkClash(schedule)) throw new BadRequestException(ErrorResponseMessages.WORK_SCHEDULE);
    let mongoIds: any = [];
    if (typeof (services) !== "string" && services.length) {
      services.forEach((service) => {
        mongoIds.push(new mongoose.Types.ObjectId(service));
      });
    } else {
      mongoIds.push(new mongoose.Types.ObjectId(services.toString()));
    }
    if (file) {
      const mimeType = file.mimetype.split("/");
      const fileName = `${nanoid()}.` + mimeType[1];
      fs.writeFileSync(path + fileName, file.buffer, "utf8");
      if (professional.media !== "placeholder.png") fs.unlink(`${path}${professional.media}`, (error) => {
      });
      professional.media = fileName;
    }
    professional.name = name;
    professional.services = mongoIds;
    professional.schedule = schedule;
    await professional.save();
    return { message: SuccessResponseMessages.UPDATED, data: { professional } };
  }

  // Delete professional
  async deleteProfessional(professionalId: string) {
    const professional = await this.Professional.findById(professionalId);
    if (!professional) throw new BadRequestException(ErrorResponseMessages.NOT_PROFESSIONAL);
    await this.Professional.deleteOne({ _id: professionalId });
    return { message: SuccessResponseMessages.DELETED };
  }

  // Get professional by id
  async getProfessional(professionalId: string) {
    const professional = await this.Professional.findById(professionalId);
    if (!professional) throw new BadRequestException(ErrorResponseMessages.NOT_PROFESSIONAL);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { professional } };
  }

  // Get business all professionals
  async getBusinessProfessionals(businessId: number, page: number, limit: number) {
    const matchingQuery = { businessId };
    const data = await this.Professional.find(matchingQuery).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Professional.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Get professionals by service
  async getServiceProfessionals(businessId: number, serviceId: string, page: number, limit: number) {
    const mongoId = new mongoose.Types.ObjectId(serviceId);
    const matchingQuery = { businessId, services: { $in: mongoId } };
    const data = await this.Professional.find(matchingQuery).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Professional.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

}
