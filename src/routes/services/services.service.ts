import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { ProfessionalModel, ServiceModel } from "../../models/schemas";
import { CreateServiceDto } from "../../dto/services";
import Mongoose from "mongoose";
import { nanoid } from "nanoid";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class ServicesService {

  constructor(@InjectModel("Service") private readonly Service: Model<ServiceModel>,
              @InjectModel("Professional") private readonly Professional: Model<ProfessionalModel>,
              private readonly configService: ConfigService) {
  }

  // Add services
  async createService(businessId: number, serviceObj: CreateServiceDto, file: any) {
    const path = this.configService.get<string>("MEDIA_PATH");
    const { name, durationStarting, durationEnding } = serviceObj;
    let media = "service-placeholder.png";
    if (file) {
      const mimeType = file.mimetype.split("/");
      const fileName = `${nanoid()}.` + mimeType[1];
      fs.writeFileSync(path + fileName, file.buffer, "utf8");
      media = fileName;
    }
    const service: any = new this.Service({ name, media, durationStarting, durationEnding, businessId });
    await service.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { service } };
  }

  // Update service
  async updateService(serviceId: string, serviceObj: CreateServiceDto, file: any) {
    const path = this.configService.get<string>("MEDIA_PATH");
    const service = await this.Service.findById(serviceId);
    if (!service) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
    const { name, durationStarting, durationEnding } = serviceObj;
    service.name = name;
    service.durationStarting = durationStarting;
    service.durationEnding = durationEnding;
    if (file) {
      const mimeType = file.mimetype.split("/");
      const fileName = `${nanoid()}.` + mimeType[1];
      fs.writeFileSync(path + fileName, file.buffer, "utf8");
      if (service.media !== "service-placeholder.png") fs.unlink(`${path}${service.media}`, (error) => {
      });
      service.media = fileName;
    }
    await service.save();
    return { message: SuccessResponseMessages.UPDATED, data: { service } };
  }

  // Delete services
  async deleteService(serviceId: string) {
    const service = await this.Service.findById(serviceId);
    if (!service) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
    await this.Service.deleteOne({ _id: serviceId });
    // Delete service if exists on professionals
    const mongoId: any = new Mongoose.Types.ObjectId(serviceId);
    const matchingQuery = { services: { $in: mongoId } };
    const professionals = await this.Professional.find(matchingQuery);
    if (professionals.length) {
      for (let i = 0; i < professionals.length; i++) {
        professionals[i].services.splice(professionals[i].services.indexOf(mongoId), 1);
        await professionals[i].save();
      }
    }
    return { message: SuccessResponseMessages.DELETED };
  }

  // Get business all services
  async getBusinessServices(businessId: number, page: number, limit: number) {
    const matchingQuery = { businessId };
    const data = await this.Service.find(matchingQuery).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Service.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Get services by id
  async getService(serviceId: string) {
    const service = await this.Service.findById(serviceId);
    if (!service) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { service } };
  }

}
