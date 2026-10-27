import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
        departments: { orderBy: { name: 'asc' } },
      },
    });
  }

  @Get(':id/courses')
  findCourses(@Param('id', ParseUUIDPipe) id: string) {
    return this.prisma.course.findMany({
      where: { institutionId: id },
      orderBy: { name: 'asc' },
    });
  }
}
