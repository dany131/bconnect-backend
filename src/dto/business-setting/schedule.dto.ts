import { IsEnum, IsMilitaryTime, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { WeekdaysEnums } from "../../common/enums";


export class ScheduleDto {

  @IsNotEmpty()
  @IsEnum(WeekdaysEnums)
  @ApiProperty({ description: "Day of the schedule" })
  day: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  @ApiProperty({ description: "Start time of the schedule in HH:MM format" })
  startTime: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  @ApiProperty({ description: "End time of the schedule in HH:MM format" })
  endTime: string;

}


