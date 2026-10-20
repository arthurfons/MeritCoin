import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('instituicoes')
export class InstituicaoController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.instituicao.findMany({
      orderBy: { nome: 'asc' },
      include: { cursos: { orderBy: { nome: 'asc' } } },
    });
  }

  @Get(':id/cursos')
  findCursos(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.curso.findMany({
      where: { instituicaoId: id },
      orderBy: { nome: 'asc' },
    });
  }
}
