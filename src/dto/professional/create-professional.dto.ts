import {
  ArrayMinSize, ArrayUnique,
  IsArray,
  IsMongoId, IsNotEmpty,
  Length, ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ScheduleDto } from "./schedule.dto";
import { Type } from "class-transformer";


export class CreateProfessionalDto {

  @Length(2, 70)
  @ApiProperty({ description: "Name of the professional" })
  name: string;

  // @IsArray()
  @IsMongoId({ each: true })
  // @ArrayMinSize(1)
  @ApiProperty({ description: "Services for the professional" })
  services: string [];

  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  @ArrayMinSize(1)
  @ApiProperty({ description: "Schedules for the professional" })
  schedule: ScheduleDto[];

}
