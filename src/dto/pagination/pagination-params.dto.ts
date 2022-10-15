import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";


export class PaginationParamsDto {

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  page: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  limit: number;

}