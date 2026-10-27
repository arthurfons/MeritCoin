import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { UpdateCompanyDto } from './dto/update-company.dto';

const companyInclude = {
  user: { select: { id: true, email: true, role: true, active: true } },
} as const;

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(actor: JwtPayload) {
    if (actor.role !== Role.ADMIN) throw new ForbiddenException();
    return this.prisma.companyProfile.findMany({
      include: companyInclude,
      orderBy: { tradeName: 'asc' },
    });
  }

  async findOne(id: string, actor: JwtPayload) {
    const company = await this.prisma.companyProfile.findUnique({
      where: { id },
      include: companyInclude,
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (
      actor.role !== Role.ADMIN &&
      !(actor.role === Role.EMPRESA && actor.sub === company.userId)
    ) {
      throw new ForbiddenException();
    }
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto, actor: JwtPayload) {
    const company = await this.prisma.companyProfile.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (actor.role !== Role.ADMIN && company.userId !== actor.sub) {
      throw new ForbiddenException();
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    return this.prisma.companyProfile.update({
      where: { id },
      data: {
        tradeName: dto.tradeName,
        ...(passwordHash
          ? { user: { update: { passwordHash } } }
          : {}),
      },
      include: companyInclude,
    });
  }

  async deactivate(id: string, actor: JwtPayload) {
    const company = await this.prisma.companyProfile.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    if (actor.role !== Role.ADMIN && company.userId !== actor.sub) {
      throw new ForbiddenException();
    }
    await this.prisma.user.update({
      where: { id: company.userId },
      data: { active: false },
    });
    return { message: 'Conta de empresa desativada' };
  }
}
