import {
  ConflictException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        student: true,
        teacher: true,
        company: true,
      },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role as AppRole,
    });

    return {
      accessToken,
      user: this.sanitize(user),
    };
  }

  async registerStudent(dto: RegisterStudentDto) {
    const course = await this.prisma.course.findFirst({
      where: { id: dto.courseId, institutionId: dto.institutionId },
    });
    if (!course) {
      throw new ConflictException(
        'Curso inválido para a instituição informada',
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
        include: { student: { include: { institution: true, course: true } } },
      });
      const accessToken = await this.jwt.signAsync({
        sub: user.id,
        email: user.email,
        role: AppRole.ALUNO,
      });
      return { accessToken, user: this.sanitize(user) };
    } catch (error) {
      this.handleUnique(error, 'E-mail ou CPF já cadastrado');
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
        include: { company: true },
      });
      const accessToken = await this.jwt.signAsync({
        sub: user.id,
        email: user.email,
        role: AppRole.EMPRESA,
      });
      return { accessToken, user: this.sanitize(user) };
    } catch (error) {
      this.handleUnique(error, 'E-mail ou CNPJ já cadastrado');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: { include: { institution: true, course: true } },
        teacher: { include: { institution: true, department: true } },
        company: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return this.sanitize(user);
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
