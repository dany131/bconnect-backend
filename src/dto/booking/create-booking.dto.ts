import {
  IsDateString,
  IsMongoId,
  IsNotEmpty
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateBookingDto {

  @IsMongoId()
  @ApiProperty({ description: "Professional id for the booking" })
  professionalId: string;

  // @IsArray()
  // @IsMongoId({ each: true })
  // @ArrayMinSize(1)
  @IsMongoId()
  @ApiProperty({ description: "Services id for the booking" })
  service: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: "Booking start date time in UTC ISO format for the booking" })
  startDateTime: string;

  // @IsNotEmpty()
  // @IsDateString()
  // @ApiProperty({ description: "Booking end date time in UTC ISO format foe the booking" })
  // endDateTime: string;

}

