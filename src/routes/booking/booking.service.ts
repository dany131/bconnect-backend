import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { BookingModel, ProfessionalModel, ServiceModel, UserModel, WorkingScheduleModel } from "../../models/schemas";
import { CreateBookingDto } from "../../dto/booking";
import { DateHelper } from "../../common/helpers";
import Mongoose from "mongoose";
import { ScheduleTypeEnums } from "../../common/enums";


@Injectable()
export class BookingService {

  constructor(@InjectModel("Booking") private readonly Booking: Model<BookingModel>,
              @InjectModel("User") private readonly User: Model<UserModel>,
              @InjectModel("WorkingSchedule") private readonly WorkingSchedule: Model<WorkingScheduleModel>,
              @InjectModel("Professional") private readonly Professional: Model<ProfessionalModel>,
              @InjectModel("Service") private readonly Service: Model<ServiceModel>,
              private readonly dateHelper: DateHelper) {
  }

  // Create booking
  async createBooking(businessId: number, customerId: string, bookingObj: CreateBookingDto) {
    const { professionalId, service, startDateTime } = bookingObj;
    const customer = await this.User.findById(customerId);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
    const workingHours = await this.WorkingSchedule.findOne({ businessId });
    if (!workingHours) throw new BadRequestException(ErrorResponseMessages.NO_WORKING_HOURS);
    const professional = await this.Professional.findById(professionalId);
    if (!professional) throw new BadRequestException(ErrorResponseMessages.PROFESSIONAL_NOT_EXISTS);
    // Check if business works on that day
    const weekDay = this.dateHelper.dayFromDate(startDateTime);
    const weekDaySchedule = workingHours.schedule.find(o => o.day === weekDay);
    if (!weekDaySchedule) throw new BadRequestException(`${ErrorResponseMessages.NO_WORK_ON_DAY} ${weekDay}`);
    // Compare times -> start time should be in between working hours
    if (!this.dateHelper.isBookingTimeValid(weekDaySchedule.startTime, weekDaySchedule.endTime, startDateTime)) throw new BadRequestException(ErrorResponseMessages.INVALID_BOOKING_TIME);
    // Check if total duration of booking is in business working days
    const serviceExists = await this.Service.findById(service);
    if (serviceExists) if (!this.dateHelper.isValidTotalDuration(weekDaySchedule.startTime, weekDaySchedule.endTime, startDateTime, serviceExists.durationEnding)) {
      throw new BadRequestException(ErrorResponseMessages.BOOKING_EXCEEDING_BUSINESS);
    }
    // Check if service is offered by that professional
    const serviceId: any = new Mongoose.Types.ObjectId(service);
    if (!professional.services.includes(serviceId)) throw new BadRequestException(ErrorResponseMessages.SERVICE_NOT_OFFERED);
    // Check if professional is available on that day
    const professionalWorkingSchedule = professional.schedule.find(o => o.day === weekDay && o.type === ScheduleTypeEnums.Work);
    if (!professionalWorkingSchedule) throw new BadRequestException(`${ErrorResponseMessages.PROFESSIONAL_NOT_AVAILABLE} ${weekDay}`);
    // Check if professional is available on that start end time (Work schedule for a will only be one but can be multiple breaks)
    const professionalBreakSchedule = professional.schedule.filter((obj) => {
      return obj.day === weekDay && obj.type === ScheduleTypeEnums.Break;
    });
    // workingHours.schedule;
    // const booking = new this.Booking({ businessId, name, description, startDateTime, endDateTime, discount });
    // await promoCode.save();
    // return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { promoCode } };
  }

  // Reschedule booking

  // Cancel booking

  // Get all business bookings

  // Get bookings by id

  // Get upcoming/ Previous bookings

}
