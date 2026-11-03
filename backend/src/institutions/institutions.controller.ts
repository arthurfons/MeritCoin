import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/roles.enum';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('institutions')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.institution.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        courses: { orderBy: { name: 'asc' } },
        classes: { orderBy: { name: 'asc' } },
        departments: { orderBy: { name: 'asc' } },
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCOLA, Role.PROFESSOR, Role.ADMIN)
  @Get(':id/classes')
  findClasses(@Param('id', ParseUUIDPipe) id: string) {
    return this.prisma.schoolClass.findMany({
      where: { institutionId: id },
      orderBy: { name: 'asc' },
    });
  }
}
