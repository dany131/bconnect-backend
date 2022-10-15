import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";


export class BusinessIdDto {

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  businessId: number;

}