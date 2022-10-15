import {
  IsEnum,
  IsMilitaryTime
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ScheduleTypeEnums, WeekdaysEnums } from "../../common/enums";


export class ScheduleDto {

  @IsEnum(WeekdaysEnums)
  @ApiProperty({ description: "Working of the professional" })
  day: string;

  @IsEnum(ScheduleTypeEnums)
  @ApiProperty({ description: "Type of schedule Work or Break" })
  type: string;

  @IsMilitaryTime()
  @ApiProperty({ description: "Start time of the schedule" })
  startTime: string;

  @IsMilitaryTime()
  @ApiProperty({ description: "End time of the schedule" })
  endTime: string;

}
