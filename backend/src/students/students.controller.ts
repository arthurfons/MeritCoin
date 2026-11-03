import {
  Body,
  Controller,
  Delete,
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
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ESCOLA, Role.ADMIN)
  create(@Body() dto: CreateStudentDto, @CurrentUser() user: JwtPayload) {
    return this.studentsService.create(dto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ESCOLA, Role.PROFESSOR)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.studentsService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ESCOLA, Role.PROFESSOR, Role.ALUNO)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.studentsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ESCOLA, Role.ALUNO)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.studentsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.ESCOLA)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.studentsService.deactivate(id, user);
  }
}
