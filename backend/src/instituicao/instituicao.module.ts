import { Module } from '@nestjs/common';
import { InstituicaoController } from './instituicao.controller';

@Module({
  controllers: [InstituicaoController],
})
export class InstituicaoModule {}
