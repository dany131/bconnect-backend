import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class SignupDto {

  @Length(2, 70)
  @ApiProperty({ description: "user name of the user" })
  userName: string;

  @IsEmail()
  @ApiProperty({ description: "Email of the user" })
  email: string;

  @Length(8, 30)
  @ApiProperty({ description: "Minimum 8 characters password of the user" })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Phone number of the user" })
  phoneNumber: string;

}