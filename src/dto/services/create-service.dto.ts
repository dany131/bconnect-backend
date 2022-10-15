import { IsNotEmpty, IsNumber, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateServiceDto {

  @Length(2, 70)
  @ApiProperty({ description: "Name of the service" })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "Numeric duration starting for the service" })
  durationStarting: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "Numeric duration ending for the service" })
  durationEnding: number;

}