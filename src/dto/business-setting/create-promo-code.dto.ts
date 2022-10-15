import { IsDateString, IsNotEmpty, IsNumberString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreatePromoCodeDto {

  @Length(2, 70)
  @ApiProperty({ description: "Name of the promo-code" })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Description of the promo-code" })
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: "Start date and time of the promo-code" })
  startDateTime: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: "End date and time of the promo-code" })
  endDateTime: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ description: "Discount of the promo-code" })
  discount: string;

}