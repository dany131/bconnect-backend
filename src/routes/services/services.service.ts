import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { ProfessionalModel, ServiceModel } from "../../models/schemas";
import { CreateServiceDto } from "../../dto/services";
import Mongoose from "mongoose";


@Injectable()
export class ServicesService {

  constructor(@InjectModel("Service") private readonly Service: Model<ServiceModel>,
              @InjectModel("Professional") private readonly Professional: Model<ProfessionalModel>) {
  }

  // Add services
  async createService(businessId: number, serviceObj: CreateServiceDto) {
    const { name, durationStarting, durationEnding } = serviceObj;
    const service: any = new this.Service({ name, durationStarting, durationEnding, businessId });
    await service.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { service } };
  }

  // Update service
  async updateService(serviceId: string, serviceObj: CreateServiceDto) {
    const service = await this.Service.findById(serviceId);
    if (!service) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
    const { name, durationStarting, durationEnding } = serviceObj;
    service.name = name;
    service.durationStarting = durationStarting;
    service.durationEnding = durationEnding;
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
