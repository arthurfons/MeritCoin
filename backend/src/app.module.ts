import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { EmailModule } from './email/email.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { MissionsModule } from './missions/missions.module';
import { PrismaModule } from './prisma/prisma.module';
import { RewardsModule } from './rewards/rewards.module';
import { StudentsModule } from './students/students.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    EmailModule,
    AuthModule,
    StudentsModule,
    CompaniesModule,
    InstitutionsModule,
    MissionsModule,
    WalletsModule,
    RewardsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
