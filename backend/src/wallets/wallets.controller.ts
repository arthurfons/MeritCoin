import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { TransferCoinsDto } from './dto/transfer-coins.dto';
import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('semester-credit')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  semesterCredit(@CurrentUser() user: JwtPayload) {
    return this.walletsService.ensureSemesterCredit(user);
  }

  @Post('transfer')
  @Roles(Role.PROFESSOR)
  transfer(@Body() dto: TransferCoinsDto, @CurrentUser() user: JwtPayload) {
    return this.walletsService.transfer(dto, user);
  }

  @Get('statement')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  statement(@CurrentUser() user: JwtPayload) {
    return this.walletsService.myStatement(user);
  }
}
