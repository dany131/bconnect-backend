import { Injectable } from "@nestjs/common";


@Injectable()
export class ClashHelper {

  // If a professional has two work objects in a day (If yes then there will be a clash)
  public containsWorkClash(schedule: any): boolean {
    let clashFound = false;
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        if (schedule[i].day === schedule[j].day) {
          if (schedule[i].type === "Work" && schedule[j].type === "Work") {
            clashFound = true;
            break;
          }
        }
      }
    }
    return clashFound;
  }

}