import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorResponseMessages, SuccessResponseMessages } from "../../common/messages";
import { BookingModel, ProfessionalModel, ServiceModel, UserModel, WorkingScheduleModel } from "../../models/schemas";
import { CreateBookingDto, RescheduleBookingDto } from "../../dto/booking";
import { DateHelper } from "../../common/helpers";
import Mongoose from "mongoose";
import { BookingStatusEnums, ScheduleTypeEnums } from "../../common/enums";


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
  async createBooking(businessId: number, customerId: string, bookingObjArray: CreateBookingDto) {
    const customer = await this.User.findById(customerId);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
    const { bookings } = bookingObjArray;
    let allBookings = [];
    if (bookings.length) {
      for (let i = 0; i < bookings.length; i++) {
        const { professionalId, service, startDateTime } = bookings[i];
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
        if (!serviceExists) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
        const endDateTime = this.dateHelper.bookingEndTimeCalculator(startDateTime, serviceExists.durationEnding);
        if (!this.dateHelper.isValidTotalDuration(weekDaySchedule.startTime, weekDaySchedule.endTime, endDateTime)) {
          throw new BadRequestException(ErrorResponseMessages.BOOKING_EXCEEDING_BUSINESS);
        }
        // Check if service is offered by that professional
        const serviceId: any = new Mongoose.Types.ObjectId(service);
        if (!professional.services.includes(serviceId)) throw new BadRequestException(ErrorResponseMessages.SERVICE_NOT_OFFERED);
        // Check if professional is available on that day
        const professionalWorkingSchedule = professional.schedule.find(o => o.day === weekDay && o.type === ScheduleTypeEnums.Work);
        if (!professionalWorkingSchedule) throw new BadRequestException(`${ErrorResponseMessages.PROFESSIONAL_NOT_AVAILABLE} ${weekDay}`);
        // Check if professional is available on that start end time (Work schedule for a professional will only be one but can be multiple breaks)
        const professionalBreakSchedule = professional.schedule.filter((obj) => {
          return obj.day === weekDay && obj.type === ScheduleTypeEnums.Break;
        });
        if (!this.dateHelper.isProfessionalAvailable(professionalWorkingSchedule, professionalBreakSchedule, startDateTime, endDateTime)) {
          throw new BadRequestException(`${ErrorResponseMessages.PROFESSIONAL_NOT_AVAILABLE} this booking time`);
        }
        // DB clash find query
        const matchingQuery =
          {
            businessId,
            professionalId,
            status: BookingStatusEnums.Confirmed,
            $or: [
              {
                $and: [{ "startDateTime": { $lte: startDateTime } },
                  { "endDateTime": { $gte: startDateTime } }]
              }, {
                $and: [{ "startDateTime": { $lte: endDateTime } },
                  { "endDateTime": { $gte: endDateTime } }]
              }, {
                $and: [{ "startDateTime": { $gte: startDateTime } },
                  { "endDateTime": { $lte: endDateTime } }]
              }
            ]
          };
        const bookingExists = await this.Booking.findOne(matchingQuery);
        if (bookingExists) throw new BadRequestException(ErrorResponseMessages.BOOKING_CLASH);
        const booking = new this.Booking({
          customerId,
          businessId,
          professionalId,
          service,
          startDateTime,
          endDateTime,
          status: BookingStatusEnums.Confirmed
        });
        await booking.save();
        allBookings.push(booking);
      }
    }
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { allBookings } };
  }

  // Reschedule booking
  async rescheduleBooking(bookingId: string, bookingObj: RescheduleBookingDto) {
    const booking = await this.Booking.findById(bookingId);
    if (!booking) throw new BadRequestException(ErrorResponseMessages.BOOKING_EXISTS);
    const { startDateTime } = bookingObj;
    const workingHours = await this.WorkingSchedule.findOne({ businessId: booking.businessId });
    if (!workingHours) throw new BadRequestException(ErrorResponseMessages.NO_WORKING_HOURS);
    const professional = await this.Professional.findById(booking.professionalId);
    if (!professional) throw new BadRequestException(ErrorResponseMessages.PROFESSIONAL_NOT_EXISTS);
    // Check if business works on that day
    const weekDay = this.dateHelper.dayFromDate(startDateTime);
    const weekDaySchedule = workingHours.schedule.find(o => o.day === weekDay);
    if (!weekDaySchedule) throw new BadRequestException(`${ErrorResponseMessages.NO_WORK_ON_DAY} ${weekDay}`);
    // Compare times -> start time should be in between working hours
    if (!this.dateHelper.isBookingTimeValid(weekDaySchedule.startTime, weekDaySchedule.endTime, startDateTime)) throw new BadRequestException(ErrorResponseMessages.INVALID_BOOKING_TIME);
    // Check if total duration of booking is in business working days
    const serviceExists = await this.Service.findById(booking.service);
    if (!serviceExists) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
    const endDateTime = this.dateHelper.bookingEndTimeCalculator(startDateTime, serviceExists.durationEnding);
    if (!this.dateHelper.isValidTotalDuration(weekDaySchedule.startTime, weekDaySchedule.endTime, endDateTime)) {
      throw new BadRequestException(ErrorResponseMessages.BOOKING_EXCEEDING_BUSINESS);
    }
    // Check if service is offered by that professional
    if (!professional.services.includes(booking.service)) throw new BadRequestException(ErrorResponseMessages.SERVICE_NOT_OFFERED);
    // Check if professional is available on that day
    const professionalWorkingSchedule = professional.schedule.find(o => o.day === weekDay && o.type === ScheduleTypeEnums.Work);
    if (!professionalWorkingSchedule) throw new BadRequestException(`${ErrorResponseMessages.PROFESSIONAL_NOT_AVAILABLE} ${weekDay}`);
    // Check if professional is available on that start end time (Work schedule for a professional will only be one but can be multiple breaks)
    const professionalBreakSchedule = professional.schedule.filter((obj) => {
      return obj.day === weekDay && obj.type === ScheduleTypeEnums.Break;
    });
    if (!this.dateHelper.isProfessionalAvailable(professionalWorkingSchedule, professionalBreakSchedule, startDateTime, endDateTime)) {
      throw new BadRequestException(`${ErrorResponseMessages.PROFESSIONAL_NOT_AVAILABLE} this booking time`);
    }
    // DB clash find query
    const matchingQuery = {
      businessId: booking.businessId,
      professionalId: booking.professionalId,
      status: BookingStatusEnums.Confirmed,
      $or: [
        {
          $and: [{ "startDateTime": { $lte: startDateTime } },
            { "endDateTime": { $gte: startDateTime } }]
        }, {
          $and: [{ "startDateTime": { $lte: endDateTime } },
            { "endDateTime": { $gte: endDateTime } }]
        }, {
          $and: [{ "startDateTime": { $gte: startDateTime } },
            { "endDateTime": { $lte: endDateTime } }]
        }
      ]
    };
    const bookingExists = await this.Booking.findOne(matchingQuery);
    if (bookingExists) throw new BadRequestException(ErrorResponseMessages.BOOKING_CLASH);
    booking.startDateTime = startDateTime;
    booking.endDateTime = endDateTime;
    await booking.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { booking } };
  }

  // Cancel booking
  async cancelBooking(bookingId: string) {
    const booking = await this.Booking.findById(bookingId);
    if (!booking) throw new BadRequestException(ErrorResponseMessages.BOOKING_EXISTS);
    booking.status = BookingStatusEnums.Canceled;
    await booking.save();
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { booking } };
  }

  // Get booking by id
  async getBooking(bookingId: string) {
    const bookingExists = await this.Booking.findById(bookingId);
    if (!bookingExists) throw new BadRequestException(ErrorResponseMessages.BOOKING_EXISTS);
    const booking: any = await this.Booking.aggregate([
      {
        $match: {
          _id: bookingExists._id
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "professional"
        }
      },
      {
        $unwind: "$professional"
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: "$service"
      },
      {
        $project: {
          "__v": 0,
          "customer.password": 0,
          "customer.phoneNumber": 0,
          "customer.businessId": 0,
          "customer.createdAt": 0,
          "customer.updatedAt": 0,
          "customer.__v": 0,
          "professionalId": 0,
          "customerId": 0,
          "professional.schedule": 0,
          "professional.createdAt": 0,
          "professional.updatedAt": 0,
          "professional.businessId": 0,
          "professional.__v": 0,
          "service.businessId": 0,
          "service.createdAt": 0,
          "service.updatedAt": 0,
          "service.__v": 0
        }
      }
    ]);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { booking } };
  }

  // Get all business bookings (Returns all confirmed and canceled)
  async getBusinessBookings(businessId: number, page: number, limit: number) {
    const matchingQuery = { businessId };
    // const data = await this.Booking.find(matchingQuery).skip((page - 1) * limit).limit(limit);
    const data: any = await this.Booking.aggregate([
      {
        $match: matchingQuery
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "professional"
        }
      },
      {
        $unwind: "$professional"
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: "$service"
      },
      {
        $project: {
          "__v": 0,
          "customer.password": 0,
          "customer.phoneNumber": 0,
          "customer.businessId": 0,
          "customer.createdAt": 0,
          "customer.updatedAt": 0,
          "customer.__v": 0,
          "professionalId": 0,
          "customerId": 0,
          "professional.schedule": 0,
          "professional.createdAt": 0,
          "professional.updatedAt": 0,
          "professional.businessId": 0,
          "professional.__v": 0,
          "service.businessId": 0,
          "service.createdAt": 0,
          "service.updatedAt": 0,
          "service.__v": 0
        }
      }
    ]).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Booking.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Get all business bookings by service (Only confirmed bookings)
  async getBusinessServiceBookings(businessId: number, serviceId: string, page: number, limit: number) {
    const service = await this.Service.findById(serviceId);
    if (!service) throw new BadRequestException(ErrorResponseMessages.NOT_SERVICE);
    const matchingQuery = { businessId, service: service._id, status: BookingStatusEnums.Confirmed };
    const data: any = await this.Booking.aggregate([
      {
        $match: matchingQuery
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "professional"
        }
      },
      {
        $unwind: "$professional"
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: "$service"
      },
      {
        $project: {
          "__v": 0,
          "customer.password": 0,
          "customer.phoneNumber": 0,
          "customer.businessId": 0,
          "customer.createdAt": 0,
          "customer.updatedAt": 0,
          "customer.__v": 0,
          "professionalId": 0,
          "customerId": 0,
          "professional.schedule": 0,
          "professional.createdAt": 0,
          "professional.updatedAt": 0,
          "professional.businessId": 0,
          "professional.__v": 0,
          "service.businessId": 0,
          "service.createdAt": 0,
          "service.updatedAt": 0,
          "service.__v": 0
        }
      }
    ]).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Booking.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Get Upcoming/ Previous bookings
  async getFilteredBookings(businessId: number, isPrevious: boolean, page: number, limit: number) {
    const utcDateNow = this.dateHelper.utcDateTimeNow();
    const matchingQuery: any = { businessId };
    (isPrevious) ? matchingQuery.endDateTime = { "$lt": utcDateNow } : matchingQuery.startDateTime = { "$gt": utcDateNow };
    const data: any = await this.Booking.aggregate([
      {
        $match: matchingQuery
      },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "professional"
        }
      },
      {
        $unwind: {
          path: "$professional",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          "__v": 0,
          "customer.password": 0,
          "customer.phoneNumber": 0,
          "customer.businessId": 0,
          "customer.createdAt": 0,
          "customer.updatedAt": 0,
          "customer.__v": 0,
          "professionalId": 0,
          "customerId": 0,
          "professional.schedule": 0,
          "professional.createdAt": 0,
          "professional.updatedAt": 0,
          "professional.businessId": 0,
          "professional.__v": 0,
          "service.businessId": 0,
          "service.createdAt": 0,
          "service.updatedAt": 0,
          "service.__v": 0
        }
      }
    ]).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Booking.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Booking statistics - for business
  async getBookingStats(businessId: number) {
    const matchingQuery: any = { businessId };
    const data = await this.Booking.aggregate([
      { $match: matchingQuery },
      { "$group": { _id: "$status", count: { $sum: 1 } } }
    ]);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data };
  }

  // Get Upcoming/ Previous bookings by customer ID
  async getFilteredBookingsByCustomer(customerId: string, isPrevious: boolean, page: number, limit: number) {
    const customer = await this.User.findById(customerId);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
    const matchingQuery: any = { customerId: customer._id };
    const utcDateNow = this.dateHelper.utcDateTimeNow();
    (isPrevious) ? matchingQuery.endDateTime = { "$lt": utcDateNow } : matchingQuery.startDateTime = { "$gt": utcDateNow };
    const data: any = await this.Booking.aggregate([
      {
        $match: matchingQuery
      },
      {
        $lookup: {
          from: "professionals",
          localField: "professionalId",
          foreignField: "_id",
          as: "professional"
        }
      },
      {
        $unwind: {
          path: "$professional",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          "__v": 0,
          "professionalId": 0,
          "customerId": 0,
          "professional.schedule": 0,
          "professional.createdAt": 0,
          "professional.updatedAt": 0,
          "professional.businessId": 0,
          "professional.__v": 0,
          "service.businessId": 0,
          "service.createdAt": 0,
          "service.updatedAt": 0,
          "service.__v": 0
        }
      }
    ]).skip((page - 1) * limit).limit(limit);
    const total: number = await this.Booking.count(matchingQuery);
    const lastPage = Math.ceil(total / limit);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  // Booking statistics - for customer
  async getCustomerBookingStats(customerId: string) {
    const customer = await this.User.findById(customerId);
    if (!customer) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
    const matchingQuery: any = { customerId: customer._id };
    const data = await this.Booking.aggregate([
      { $match: matchingQuery },
      { "$group": { _id: "$status", count: { $sum: 1 } } }
    ]);
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data };
  }

}
