import {
  IsDateString,
  IsNotEmpty
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class RescheduleBookingDto {

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: "Booking start date time in UTC ISO format for the booking" })
  startDateTime: string;

}

