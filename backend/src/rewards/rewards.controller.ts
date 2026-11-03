import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardsService } from './rewards.service';

@ApiTags('rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('rewards/catalog')
  @Roles(Role.ALUNO, Role.EMPRESA, Role.ADMIN)
  catalog() {
    return this.rewardsService.listCatalog();
  }

  @Get('rewards/mine')
  @Roles(Role.EMPRESA)
  mine(@CurrentUser() user: JwtPayload) {
    return this.rewardsService.listMine(user);
  }

  @Post('rewards')
  @Roles(Role.EMPRESA)
  create(@Body() dto: CreateRewardDto, @CurrentUser() user: JwtPayload) {
    return this.rewardsService.create(dto, user);
  }

  @Delete('rewards/:id')
  @Roles(Role.EMPRESA)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rewardsService.deactivate(id, user);
  }

  @Post('rewards/:id/redeem')
  @Roles(Role.ALUNO)
  redeem(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rewardsService.redeem(id, user);
  }

  @Get('redemptions')
  @Roles(Role.ALUNO, Role.EMPRESA)
  redemptions(@CurrentUser() user: JwtPayload) {
    return this.rewardsService.listMyRedemptions(user);
  }

  @Post('redemptions/confirm')
  @Roles(Role.EMPRESA)
  confirm(
    @Body() body: { couponCode: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rewardsService.confirmCoupon(body.couponCode, user);
  }
}
