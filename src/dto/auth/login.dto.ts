import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../common/enums";


export class LoginDto {

  @IsEmail()
  @ApiProperty({ description: "Email of the user" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Minimum 8 characters password of the user" })
  password: string;

  @IsEnum(Role, { message: "Invalid role" })
  @ApiProperty({ description: "Must be Customer or Business" })
  role: string;

}