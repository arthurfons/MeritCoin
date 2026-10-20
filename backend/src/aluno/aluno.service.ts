import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

const alunoPublicSelect = {
  id: true,
  nome: true,
  email: true,
  cpf: true,
  rg: true,
  login: true,
  saldoMoedas: true,
  logradouro: true,
  numero: true,
  complemento: true,
  bairro: true,
  cidade: true,
  estado: true,
  cep: true,
  instituicaoId: true,
  cursoId: true,
  createdAt: true,
  updatedAt: true,
  instituicao: { select: { id: true, nome: true } },
  curso: { select: { id: true, nome: true } },
} satisfies Prisma.AlunoSelect;

@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAlunoDto) {
    await this.ensureRelations(dto.instituicaoId, dto.cursoId);
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    try {
      return await this.prisma.aluno.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          cpf: dto.cpf.replace(/\D/g, ''),
          rg: dto.rg,
          login: dto.login,
          senhaHash,
          logradouro: dto.logradouro,
          numero: dto.numero,
          complemento: dto.complemento,
          bairro: dto.bairro,
          cidade: dto.cidade,
          estado: dto.estado.toUpperCase(),
          cep: dto.cep.replace(/\D/g, ''),
          instituicaoId: dto.instituicaoId,
          cursoId: dto.cursoId,
        },
        select: alunoPublicSelect,
      });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  findAll() {
    return this.prisma.aluno.findMany({
      select: alunoPublicSelect,
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      select: alunoPublicSelect,
    });
    if (!aluno) throw new NotFoundException(`Aluno #${id} não encontrado`);
    return aluno;
  }

  async update(id: number, dto: UpdateAlunoDto) {
    await this.findOne(id);
    if (dto.instituicaoId && dto.cursoId) {
      await this.ensureRelations(dto.instituicaoId, dto.cursoId);
    } else if (dto.instituicaoId || dto.cursoId) {
      const atual = await this.prisma.aluno.findUniqueOrThrow({ where: { id } });
      await this.ensureRelations(
        dto.instituicaoId ?? atual.instituicaoId,
        dto.cursoId ?? atual.cursoId,
      );
    }

    const data: Prisma.AlunoUpdateInput = {
      ...(dto.nome !== undefined && { nome: dto.nome }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.cpf !== undefined && { cpf: dto.cpf.replace(/\D/g, '') }),
      ...(dto.rg !== undefined && { rg: dto.rg }),
      ...(dto.login !== undefined && { login: dto.login }),
      ...(dto.logradouro !== undefined && { logradouro: dto.logradouro }),
      ...(dto.numero !== undefined && { numero: dto.numero }),
      ...(dto.complemento !== undefined && { complemento: dto.complemento }),
      ...(dto.bairro !== undefined && { bairro: dto.bairro }),
      ...(dto.cidade !== undefined && { cidade: dto.cidade }),
      ...(dto.estado !== undefined && { estado: dto.estado.toUpperCase() }),
      ...(dto.cep !== undefined && { cep: dto.cep.replace(/\D/g, '') }),
      ...(dto.instituicaoId !== undefined && {
        instituicao: { connect: { id: dto.instituicaoId } },
      }),
      ...(dto.cursoId !== undefined && {
        curso: { connect: { id: dto.cursoId } },
      }),
    };

    if (dto.senha) {
      data.senhaHash = await bcrypt.hash(dto.senha, 10);
    }

    try {
      return await this.prisma.aluno.update({
        where: { id },
        data,
        select: alunoPublicSelect,
      });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.aluno.delete({ where: { id } });
    return { message: `Aluno #${id} removido` };
  }

  private async ensureRelations(instituicaoId: number, cursoId: number) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: cursoId, instituicaoId },
    });
    if (!curso) {
      throw new NotFoundException(
        'Curso não encontrado ou não pertence à instituição informada',
      );
    }
  }

  private handleUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe aluno com o mesmo e-mail, CPF ou login',
      );
    }
    throw error;
  }
}
