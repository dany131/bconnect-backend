import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";


@Injectable()
export class DateHelper {

  public utcConverter(dateInISO: string, zone: string): string {
    try {
      const dateTime = dateInISO.split("T");
      const date = dateTime[0].split("-");
      const time = dateTime [1].split(":");
      const dt = DateTime.fromObject({
        year: parseInt(date[0]),
        month: parseInt(date[1]),
        day: parseInt(date[2]),
        hour: parseInt(time[0]),
        minute: parseInt(time[1])
      }, { zone });
      return (dt.toUTC().toISO());
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // UTC date today
  public utcDateToday() {
    const date = DateTime.now().toFormat("yyyy-MM-dd");
    let dateTime: any = date.split("-");
    dateTime = dateTime.map(Number);
    const startDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 0, 0).toISO();
    const endDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 23, 59).toISO();
    return { startDate, endDate };
  }

  // For next month
  public nextMonth() {
    let nextMonthStart: any = DateTime.now().endOf("month").plus({ day: 1 });
    let nextMonthEnd: any = nextMonthStart.endOf("month");
    nextMonthStart = nextMonthStart.toFormat("yyyy-MM-dd");
    nextMonthEnd = nextMonthEnd.toFormat("yyyy-MM-dd");

    let startDateTime: any = nextMonthStart.split("-");
    let endDateTime: any = nextMonthEnd.split("-");

    startDateTime = startDateTime.map(Number);
    endDateTime = endDateTime.map(Number);

    const startDate = DateTime.utc(startDateTime[0], startDateTime[1], startDateTime[2], 0, 0).toISO();
    const endDate = DateTime.utc(endDateTime[0], endDateTime[1], endDateTime[2], 23, 59).toISO();
    return { startDate, endDate };
  }

  // For this week/month
  public startEndDate(unit: any): object {
    const unitStartDate = DateTime.now().startOf(unit).minus({ day: 1 }).toFormat("yyyy-MM-dd");
    const unitEndDate = DateTime.now().endOf(unit).toFormat("yyyy-MM-dd");

    let startDateTime: any = unitStartDate.split("-");
    let endDateTime: any = unitEndDate.split("-");

    startDateTime = startDateTime.map(Number);
    endDateTime = endDateTime.map(Number);

    const startDate = DateTime.utc(startDateTime[0], startDateTime[1], startDateTime[2], 0, 0).toISO();
    const endDate = DateTime.utc(endDateTime[0], endDateTime[1], endDateTime[2], 23, 59).toISO();
    return { startDate, endDate };
  }

  // For custom date
  public dateToUtc(date: string): object {
    let dateTime: any = date.split("-");
    dateTime = dateTime.map(Number);
    const startDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 0, 0).toISO();
    const endDate = DateTime.utc(dateTime[0], dateTime[1], dateTime[2], 23, 59).toISO();
    return { startDate, endDate };
  }

}