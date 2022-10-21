import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";


@Injectable()
export class DateHelper {

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

  public bookingEndTimeCalculator(bookingStartTime: string, serviceDuration: number, zone: string): string {
    return DateTime.fromISO(bookingStartTime, { zone }).plus({ minute: serviceDuration }).toISO();
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

  // Validate professional work schedule in business working hours
  public isValidWorkSchedule(professionalSchedule: any, businessSchedule: any) {
    let isValid = true;
    if (professionalSchedule.length) {
      for (let i = 0; i < professionalSchedule.length; i++) {
        const weekDaySchedule = businessSchedule.schedule.find(o => o.day === professionalSchedule[i].day);
        if (!weekDaySchedule) return false;
        const professionalStart = `${professionalSchedule[i].startTime}:00`;
        const professionalEnd = `${professionalSchedule[i].endTime}:00`;
        const businessStart = `${weekDaySchedule.startTime}:00`;
        const businessEnd = `${weekDaySchedule.endTime}:00`;

        const professionalStartInMillis = Number(professionalStart.split(":")[0]) * 3600000 + Number(professionalStart.split(":")[1]) * 60000 + Number(professionalStart.split(":")[2]) * 1000;
        const professionalEndInMillis = Number(professionalEnd.split(":")[0]) * 3600000 + Number(professionalEnd.split(":")[1]) * 60000 + Number(professionalEnd.split(":")[2]) * 1000;
        const businessStartInMillis = Number(businessStart.split(":")[0]) * 3600000 + Number(businessStart.split(":")[1]) * 60000 + Number(businessStart.split(":")[2]) * 1000;
        const businessEndInMillis = Number(businessEnd.split(":")[0]) * 3600000 + Number(businessEnd.split(":")[1]) * 60000 + Number(businessEnd.split(":")[2]) * 1000;
        if (!(professionalStartInMillis >= businessStartInMillis && professionalStartInMillis < businessEndInMillis
          && professionalEndInMillis > businessStartInMillis && professionalEndInMillis <= businessEndInMillis)) {
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }

  // local time to UTC converter
  public utcConverter(localISOTime: string): string {
    const dateTime = DateTime.fromISO(localISOTime, { zone: "utc" });
    return dateTime.toISO();
  }

}