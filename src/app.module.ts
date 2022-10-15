import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common/guards";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./routes/auth/auth.module";
import { ServicesModule } from "./routes/services/services.module";
import { ProfessionalModule } from "./routes/professional/professional.module";
import { BusinessSettingModule } from "./routes/business-setting/business-setting.module";
import { CustomerModule } from "./routes/customer/customer.module";


@Module({
  imports: [ // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration]
    }),
    // DB connection
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("MONGO_URI")
      }),
      inject: [ConfigService]
    }),
    // Request rate limiting - 50 requests per IP in 1 minute (60 seconds)
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50
    }),
    // Routes
    AuthModule,
    ServicesModule,
    ProfessionalModule,
    BusinessSettingModule,
    CustomerModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AtGuard }
  ]
})
export class AppModule {
}
