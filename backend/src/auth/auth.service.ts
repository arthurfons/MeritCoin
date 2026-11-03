import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { Role as AppRole } from './roles.enum';

const userInclude = {
  student: {
    include: { institution: true, course: true, schoolClass: true },
  },
  teacher: {
    include: {
      institution: true,
      department: true,
      classes: { include: { schoolClass: true } },
    },
  },
  company: true,
  school: { include: { institution: true } },
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: userInclude,
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais invalidas');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais invalidas');

    return {
      accessToken: await this.sign(user.id, user.email, user.role as AppRole),
      user: this.sanitize(user),
    };
  }

  async registerStudent(dto: RegisterStudentDto) {
    const course = await this.prisma.course.findFirst({
      where: { id: dto.courseId, institutionId: dto.institutionId },
    });
    if (!course) {
      throw new NotFoundException(
        'Curso invalido para a instituicao informada',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          role: Role.ALUNO,
          student: {
            create: {
              fullName: dto.fullName,
              cpf: dto.cpf.replace(/\D/g, ''),
              rg: dto.rg,
              street: dto.street,
              number: dto.number,
              complement: dto.complement,
              district: dto.district,
              city: dto.city,
              state: dto.state.toUpperCase(),
              zipCode: dto.zipCode.replace(/\D/g, ''),
              institutionId: dto.institutionId,
              courseId: dto.courseId,
            },
          },
        },
        include: userInclude,
      });
      return {
        accessToken: await this.sign(user.id, user.email, AppRole.ALUNO),
        user: this.sanitize(user),
      };
    } catch (error) {
      this.handleUnique(error, 'E-mail ou CPF ja cadastrado');
    }
  }

  async registerCompany(dto: RegisterCompanyDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          role: Role.EMPRESA,
          company: {
            create: {
              tradeName: dto.tradeName,
              cnpj: dto.cnpj.replace(/\D/g, ''),
            },
          },
        },
        include: userInclude,
      });
      return {
        accessToken: await this.sign(user.id, user.email, AppRole.EMPRESA),
        user: this.sanitize(user),
      };
    } catch (error) {
      this.handleUnique(error, 'E-mail ou CNPJ ja cadastrado');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: userInclude,
    });
    if (!user) throw new UnauthorizedException();
    return this.sanitize(user);
  }

  private sign(sub: string, email: string, role: AppRole) {
    return this.jwt.signAsync({ sub, email, role });
  }

  private sanitize(user: {
    id: string;
    email: string;
    role: Role;
    active: boolean;
    passwordHash?: string;
    student?: unknown;
    teacher?: unknown;
    company?: unknown;
    school?: unknown;
  }) {
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  private handleUnique(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }
    throw error;
  }
}
