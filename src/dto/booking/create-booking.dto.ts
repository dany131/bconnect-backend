import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty, ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BookingDto } from "./booking.dto";


export class CreateBookingDto {

  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => BookingDto)
  @ArrayMinSize(1)
  @ApiProperty({ description: "Booking array" })
  bookings: BookingDto[];

}

