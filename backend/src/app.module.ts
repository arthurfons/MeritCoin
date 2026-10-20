import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AlunoModule } from './aluno/aluno.module';
import { EmpresaModule } from './empresa/empresa.module';
import { InstituicaoModule } from './instituicao/instituicao.module';

@Module({
  imports: [PrismaModule, AlunoModule, EmpresaModule, InstituicaoModule],
})
export class AppModule {}
