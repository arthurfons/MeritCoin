import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

const empresaPublicSelect = {
  id: true,
  nome: true,
  cnpj: true,
  email: true,
  login: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EmpresaParceiraSelect;

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmpresaDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    try {
      return await this.prisma.empresaParceira.create({
        data: {
          nome: dto.nome,
          cnpj: dto.cnpj.replace(/\D/g, ''),
          email: dto.email,
          login: dto.login,
          senhaHash,
        },
        select: empresaPublicSelect,
      });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  findAll() {
    return this.prisma.empresaParceira.findMany({
      select: empresaPublicSelect,
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const empresa = await this.prisma.empresaParceira.findUnique({
      where: { id },
      select: empresaPublicSelect,
    });
    if (!empresa) {
      throw new NotFoundException(`Empresa #${id} não encontrada`);
    }
    return empresa;
  }

  async update(id: number, dto: UpdateEmpresaDto) {
    await this.findOne(id);
    const data: Prisma.EmpresaParceiraUpdateInput = {
      ...(dto.nome !== undefined && { nome: dto.nome }),
      ...(dto.cnpj !== undefined && { cnpj: dto.cnpj.replace(/\D/g, '') }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.login !== undefined && { login: dto.login }),
    };
    if (dto.senha) {
      data.senhaHash = await bcrypt.hash(dto.senha, 10);
    }
    try {
      return await this.prisma.empresaParceira.update({
        where: { id },
        data,
        select: empresaPublicSelect,
      });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.empresaParceira.delete({ where: { id } });
    return { message: `Empresa #${id} removida` };
  }

  private handleUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe empresa com o mesmo CNPJ, e-mail ou login',
      );
    }
    throw error;
  }
}
