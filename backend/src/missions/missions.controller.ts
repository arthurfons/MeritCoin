import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CreateMissionDto } from './dto/create-mission.dto';
import { ReviewCompletionDto } from './dto/review-completion.dto';
import { MissionsService } from './missions.service';

@ApiTags('missions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @Roles(Role.ESCOLA, Role.PROFESSOR, Role.ADMIN)
  create(@Body() dto: CreateMissionDto, @CurrentUser() user: JwtPayload) {
    return this.missionsService.create(dto, user);
  }

  @Get()
  @Roles(Role.ESCOLA, Role.PROFESSOR, Role.ALUNO, Role.ADMIN)
  list(@CurrentUser() user: JwtPayload) {
    return this.missionsService.listForActor(user);
  }

  @Get('completions/pending')
  @Roles(Role.ESCOLA, Role.PROFESSOR, Role.ADMIN)
  pending(@CurrentUser() user: JwtPayload) {
    return this.missionsService.listPending(user);
  }

  @Post(':id/complete')
  @Roles(Role.ALUNO)
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.missionsService.submitCompletion(id, user);
  }

  @Patch('completions/:id/review')
  @Roles(Role.ESCOLA, Role.PROFESSOR, Role.ADMIN)
  review(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReviewCompletionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.missionsService.review(id, dto, user);
  }
}
