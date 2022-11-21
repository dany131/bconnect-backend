import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class SearchCustomerDto {

  @Length(0, 100)
  @IsString()
  @ApiProperty({ description: "Custom search query for customer" })
  searchQuery: string;

}
