import {
  IsDateString,
  IsMongoId, IsNotEmpty
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class BookingDto {

  @IsMongoId()
  @ApiProperty({ description: "Professional id for the booking" })
  professionalId: string;

  @IsMongoId()
  @ApiProperty({ description: "Service id for the booking" })
  service: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: "Booking start date time in UTC ISO format for the booking" })
  startDateTime: string;

}