import { IsNotEmpty, IsNumber, Length, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";


export class CreateServiceDto {

  @Length(2, 70)
  @ApiProperty({ description: "Name of the service" })
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ description: "Numeric duration starting for the service" })
  durationStarting: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ description: "Numeric duration ending for the service" })
  durationEnding: number;

}