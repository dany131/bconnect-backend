import { Injectable } from "@nestjs/common";


@Injectable()
export class ValidationsHelper {
  constructor() {
  }

  // Checks if start date and end date are valid, Works on ISO date format as well
  public validDate(startDate, endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const dateNow = new Date();
    return !(sDate < dateNow || eDate < dateNow || sDate > eDate || sDate.getTime() === eDate.getTime());
  }

}










