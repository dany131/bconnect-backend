import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PromoCodeModel, WorkingScheduleModel } from "../../models/schemas";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { CreatePromoCodeDto, CreateScheduleDto } from "../../dto/business-setting";
import { DateHelper } from "../../common/helpers";


@Injectable()
export class BusinessSettingService {

  constructor(@InjectModel("PromoCode") private readonly PromoCode: Model<PromoCodeModel>,
              @InjectModel("WorkingSchedule") private readonly WorkingSchedule: Model<WorkingScheduleModel>,
              private readonly dateHelper: DateHelper) {
  }

  // Add promo-code
  async createPromoCode(businessId: number, promoCodeObj: CreatePromoCodeDto) {
    const { name, description, startDateTime, endDateTime, discount } = promoCodeObj;
    const promoCode = new this.PromoCode({ businessId, name, description, startDateTime, endDateTime, discount });
    await promoCode.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { promoCode } };
  }

  // Update promo-code
  async updatePromoCode(promoCodeId: string, promoCodeObj: CreatePromoCodeDto) {
    const promoCode = await this.PromoCode.findById(promoCodeId);
    if (!promoCode) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    const { name, description, startDateTime, endDateTime, discount } = promoCodeObj;
    promoCode.name = name;
    promoCode.description = description;
    promoCode.startDateTime = startDateTime;
    promoCode.endDateTime = endDateTime;
    promoCode.discount = discount;
    await promoCode.save();
    return { message: SuccessResponseMessages.UPDATED, data: { promoCode } };
  }

  // Delete promo-code
  async deletePromoCode(promoCodeId: string) {
    const promoCode = await this.PromoCode.findById(promoCodeId);
    if (!promoCode) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    await this.PromoCode.deleteOne({ _id: promoCodeId });
    return { message: SuccessResponseMessages.DELETED };
  }

  // Get promo-code by id
  async getPromoCode(promoCodeId: string) {
    const promoCode = await this.PromoCode.findById(promoCodeId);
    if (!promoCode) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { promoCode } };
  }

  // Get business promo-codes
  async getBusinessPromoCodes(businessId: number, page: number, limit: number) {
    const matchingQuery = { businessId };
    const data = await this.PromoCode.find(matchingQuery).skip((page - 1) * limit).limit(limit);
    const total: number = await this.PromoCode.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Add working schedule
  async createWorkingSchedule(businessId: number, workingScheduleObj: CreateScheduleDto) {
    const workingScheduleExists = await this.WorkingSchedule.findOne({ businessId });
    if (workingScheduleExists) throw new BadRequestException(ErrorResponseMessages.ALREADY_EXISTS);
    const { schedule } = workingScheduleObj;
    const workingSchedule = new this.WorkingSchedule({ businessId, schedule });
    await workingSchedule.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { workingSchedule } };
  }

  // Update working schedule
  async updateWorkingSchedule(scheduleId: string, workingScheduleObj: CreateScheduleDto) {
    const workingSchedule = await this.WorkingSchedule.findById(scheduleId);
    if (!workingSchedule) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    const { schedule } = workingScheduleObj;
    workingSchedule.schedule = schedule;
    await workingSchedule.save();
    return { message: SuccessResponseMessages.UPDATED, data: { workingSchedule } };
  }

  // Get working schedule by id
  async getWorkingSchedule(scheduleId: string) {
    const workingSchedule = await this.WorkingSchedule.findById(scheduleId);
    if (!workingSchedule) throw new BadRequestException(ErrorResponseMessages.NOT_EXISTS);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { workingSchedule } };
  }

  // Get business working schedule
  async getBusinessWorkingSchedule(businessId: number) {
    const matchingQuery = { businessId };
    const workingSchedule = await this.WorkingSchedule.find(matchingQuery);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { workingSchedule } };
  }

  // Test
  // async test() {
  //   // const res = this.dateHelper.isValidTotalDuration("08:30", "16:00", "2022-10-14T14:05:59.257+00:00", "120");
  //   // console.log(res);
  //   // return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  // }

}
