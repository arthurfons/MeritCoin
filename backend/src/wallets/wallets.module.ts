import { Module } from '@nestjs/common';
import { SemesterCreditService } from './semester-credit.service';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, SemesterCreditService],
  exports: [WalletsService, SemesterCreditService],
})
export class WalletsModule {}
