import {
  IsBoolean
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";


export class FilterBookingsDto {

  @Transform(({ value }) => value === "true")
  @IsBoolean()
  @ApiProperty({ description: "true/false if event for previous/upcoming bookings" })
  isPrevious: boolean;

}
