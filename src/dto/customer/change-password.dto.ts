import { Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class ChangePasswordDto {

  @Length(8, 30)
  @ApiProperty({ description: "Minimum 8 characters password of the user" })
  password: string;

}