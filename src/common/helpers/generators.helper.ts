import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";


@Injectable()
export class GeneratorsHelper {
  constructor(private configService: ConfigService, private jwtService: JwtService) {
  }

  // Hash data
  public hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  // Compare data
  public async compareData(data: string, compareWith: string): Promise<string> {
    return await bcrypt.compare(data, compareWith);
  }

  // Code Generator
  public randomString(length: number): string {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  // JWT Token Generator
  async getTokens(userId: string, createdAt: string) {
    const atSecret = this.configService.get<string>("AT_STRATEGY");
    const [at] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, createdAt },
        { secret: atSecret, expiresIn: "4h" })
    ]);
    return {
      access_token: at
    };
  }

  // JWT Decoder
  async jwtDecoder(headers: any) {
    const token = headers.authorization.split(" ");
    const decodedJwtAccessToken = this.jwtService.decode(token[1]);
    return decodedJwtAccessToken.sub;
  }

}

