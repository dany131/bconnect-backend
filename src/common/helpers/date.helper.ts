import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";


@Injectable()
export class DateHelper {

  // public utcConverter(dateInISO: string, zone: string): string {
  //   try {
  //     const dateTime = dateInISO.split("T");
  //     const date = dateTime[0].split("-");
  //     const time = dateTime [1].split(":");
  //     const dt = DateTime.fromObject({
  //       year: parseInt(date[0]),
  //       month: parseInt(date[1]),
  //       day: parseInt(date[2]),
  //       hour: parseInt(time[0]),
  //       minute: parseInt(time[1])
  //     }, { zone });
  //     return (dt.toUTC().toISO());
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
  //
  // // UTC date today
  // public utcDateToday() {
  //   const date = DateTime.now().toFormat("yyyy-MM-dd");
  //   let dateTime: any = date.split("-");
  //   dateTime = dateTime.map(Number);
  //   const startDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 0, 0).toISO();
  //   const endDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 23, 59).toISO();
  //   return { startDate, endDate };
  // }
  //
  // // For next month
  // public nextMonth() {
  //   let nextMonthStart: any = DateTime.now().endOf("month").plus({ day: 1 });
  //   let nextMonthEnd: any = nextMonthStart.endOf("month");
  //   nextMonthStart = nextMonthStart.toFormat("yyyy-MM-dd");
  //   nextMonthEnd = nextMonthEnd.toFormat("yyyy-MM-dd");
  //
  //   let startDateTime: any = nextMonthStart.split("-");
  //   let endDateTime: any = nextMonthEnd.split("-");
  //
  //   startDateTime = startDateTime.map(Number);
  //   endDateTime = endDateTime.map(Number);
  //
  //   const startDate = DateTime.utc(startDateTime[0], startDateTime[1], startDateTime[2], 0, 0).toISO();
  //   const endDate = DateTime.utc(endDateTime[0], endDateTime[1], endDateTime[2], 23, 59).toISO();
  //   return { startDate, endDate };
  // }
  //
  // // For this week/month
  // public startEndDate(unit: any): object {
  //   const unitStartDate = DateTime.now().startOf(unit).minus({ day: 1 }).toFormat("yyyy-MM-dd");
  //   const unitEndDate = DateTime.now().endOf(unit).toFormat("yyyy-MM-dd");
  //
  //   let startDateTime: any = unitStartDate.split("-");
  //   let endDateTime: any = unitEndDate.split("-");
  //
  //   startDateTime = startDateTime.map(Number);
  //   endDateTime = endDateTime.map(Number);
  //
  //   const startDate = DateTime.utc(startDateTime[0], startDateTime[1], startDateTime[2], 0, 0).toISO();
  //   const endDate = DateTime.utc(endDateTime[0], endDateTime[1], endDateTime[2], 23, 59).toISO();
  //   return { startDate, endDate };
  // }
  //
  // // For custom date
  // public dateToUtc(date: string): object {
  //   let dateTime: any = date.split("-");
  //   dateTime = dateTime.map(Number);
  //   const startDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 0, 0).toISO();
  //   const endDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 23, 59).toISO();
  //   return { startDate, endDate };
  // }
  //
  // // Military time form UTC datetime
  // public militaryTimeFromUTC(dateTime: string): string {
  //   const time = dateTime.split("T")[1];
  //   const onlyTime = time.split("+")[0];
  //   const hoursAndMinutes = onlyTime.split(":");
  //   return `${hoursAndMinutes[0]}:${hoursAndMinutes[1]}`;
  // }

  // Day from UTC datetime
  public dayFromDate(dateTime: string): string {
    const onlyDate = dateTime.split("T")[0];
    const dateArray = onlyDate.split("-");
    const intArray = dateArray.map(e => Number(e));
    return DateTime.local(intArray[0], intArray[1], intArray[2]).weekdayLong;
  }

  // Is booking time is between, schedule start and end time in military format, and booking time UTC date time
  public isBookingTimeValid(scheduleStart: string, scheduleEnd: string, bookingTime: string): boolean {
    scheduleStart = `${scheduleStart}:00`;
    scheduleEnd = `${scheduleEnd}:00`;
    const time = bookingTime.split("T")[1];
    const onlyTime = time.split(".")[0];

    const startInMillis = Number(scheduleStart.split(":")[0]) * 3600000 + Number(scheduleStart.split(":")[1]) * 60000 + Number(scheduleStart.split(":")[2]) * 1000;
    const endInMillis = Number(scheduleEnd.split(":")[0]) * 3600000 + Number(scheduleEnd.split(":")[1]) * 60000 + Number(scheduleEnd.split(":")[2]) * 1000;
    const bookingStartInMillis = Number(onlyTime.split(":")[0]) * 3600000 + Number(onlyTime.split(":")[1]) * 60000 + Number(onlyTime.split(":")[2]) * 1000;
    return (bookingStartInMillis >= startInMillis && bookingStartInMillis <= endInMillis);
  }

  public bookingEndTimeCalculator(bookingStartTime: string, serviceDuration: number): string {
    return DateTime.fromISO(bookingStartTime).plus({ minute: serviceDuration }).toUTC().toISO();
  }

  // Is total duration in business hours
  public isValidTotalDuration(businessScheduleStart: string, businessScheduleEnd: string,
                              bookingEndTime: string): boolean {
    businessScheduleStart = `${businessScheduleStart}:00`;    // for eg - 08:50:00
    businessScheduleEnd = `${businessScheduleEnd}:00`;        // for eg - 08:50:00
    const time = bookingEndTime.split("T")[1];
    const onlyTime = time.split(".")[0];            // for eg - 08:50:00

    const startInMillis = Number(businessScheduleStart.split(":")[0]) * 3600000 + Number(businessScheduleStart.split(":")[1]) * 60000 + Number(businessScheduleStart.split(":")[2]) * 1000;
    const endInMillis = Number(businessScheduleEnd.split(":")[0]) * 3600000 + Number(businessScheduleEnd.split(":")[1]) * 60000 + Number(businessScheduleEnd.split(":")[2]) * 1000;
    const bookingTotalInMillis = Number(onlyTime.split(":")[0]) * 3600000 + Number(onlyTime.split(":")[1]) * 60000 + Number(onlyTime.split(":")[2]) * 1000;
    return (bookingTotalInMillis >= startInMillis && bookingTotalInMillis <= endInMillis);
  }

  // Is professional available
  public isProfessionalAvailable(professionalWorkSchedule: any, professionalBreakSchedule: any,
                                 bookingStart: string, bookingEnd: string): boolean {
    const professionalWorkStart = `${professionalWorkSchedule.startTime}:00`;
    const professionalWorkEnd = `${professionalWorkSchedule.endTime}:00`;

    const startTime = bookingStart.split("T")[1];
    const onlyStartTime = startTime.split(".")[0];            // for eg - 08:50:00
    const endTime = bookingEnd.split("T")[1];
    const onlyEndTime = endTime.split(".")[0];            // for eg - 08:50:00
    // ps <------ bs -- be --------> pe

    const professionalStartInMillis = Number(professionalWorkStart.split(":")[0]) * 3600000 + Number(professionalWorkStart.split(":")[1]) * 60000 + Number(professionalWorkStart.split(":")[2]) * 1000;
    const professionalEndInMillis = Number(professionalWorkEnd.split(":")[0]) * 3600000 + Number(professionalWorkEnd.split(":")[1]) * 60000 + Number(professionalWorkEnd.split(":")[2]) * 1000;
    const bookingStartInMillis = Number(onlyStartTime.split(":")[0]) * 3600000 + Number(onlyStartTime.split(":")[1]) * 60000 + Number(onlyStartTime.split(":")[2]) * 1000;
    const bookingEndInMillis = Number(onlyEndTime.split(":")[0]) * 3600000 + Number(onlyEndTime.split(":")[1]) * 60000 + Number(onlyEndTime.split(":")[2]) * 1000;

    if (!(professionalStartInMillis <= bookingStartInMillis && professionalStartInMillis < bookingEndInMillis &&
      professionalEndInMillis >= bookingEndInMillis && professionalEndInMillis > bookingStartInMillis)) return false;
    // For break clashes
    let isAvailable = true;
    if (professionalBreakSchedule.length) {
      for (let i = 0; i < professionalBreakSchedule.length; i++) {
        const professionalBreakStart = `${professionalBreakSchedule[i].startTime}:00`;
        const professionalBreakEnd = `${professionalBreakSchedule[i].endTime}:00`;
        const profBreakStartInMillis = Number(professionalBreakStart.split(":")[0]) * 3600000 + Number(professionalBreakStart.split(":")[1]) * 60000 + Number(professionalBreakStart.split(":")[2]) * 1000;
        const profBreakEndInMillis = Number(professionalBreakEnd.split(":")[0]) * 3600000 + Number(professionalBreakEnd.split(":")[1]) * 60000 + Number(professionalBreakEnd.split(":")[2]) * 1000;
        if (!(bookingStartInMillis < profBreakStartInMillis && bookingStartInMillis < profBreakEndInMillis &&
          bookingEndInMillis <= profBreakStartInMillis && bookingEndInMillis < profBreakEndInMillis)) {
          if (!(bookingStartInMillis > profBreakStartInMillis && bookingStartInMillis >= profBreakEndInMillis &&
            bookingEndInMillis > profBreakStartInMillis && bookingEndInMillis > profBreakEndInMillis)) {
            isAvailable = false;
            break;
          }
        }
      }
    }
    return isAvailable;
  }

  // UTC date time now
  public utcDateTimeNow() {
    return DateTime.now().toUTC().toISO();
  }
}