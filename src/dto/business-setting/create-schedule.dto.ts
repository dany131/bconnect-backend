import {
  ArrayMaxSize,
  ArrayMinSize, ArrayUnique,
  IsArray,
  IsNotEmpty,
  ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ScheduleDto } from "./schedule.dto";


export class CreateScheduleDto {

  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  @ArrayMaxSize(7)
  @ArrayMinSize(1)
  @ArrayUnique()
  @ApiProperty({ description: "Working schedule for the business" })
  schedule: ScheduleDto [];

}
