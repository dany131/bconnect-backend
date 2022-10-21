import {
  IsDateString,
  IsNotEmpty, Length
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class RescheduleBookingDto {

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: "Booking start date time in UTC ISO format for the booking" })
  startDateTime: string;

  @Length(5, 100)
  @ApiProperty({ description: "Must be a valid time zone for the booking" })
  timezone: string;

}

