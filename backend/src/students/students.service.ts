import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, Role } from '@prisma/client';
import { JwtPayload } from '../auth/jwt-payload';
import { Role as AppRole } from '../auth/roles.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

const studentInclude = {
  institution: true,
  course: true,
  schoolClass: true,
  user: { select: { id: true, email: true, role: true, active: true } },
} as const;

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async institutionIdFor(actor: JwtPayload) {
    if (actor.role === AppRole.ESCOLA) {
      return (
        await this.prisma.schoolProfile.findUnique({
          where: { userId: actor.sub },
        })
      )?.institutionId;
    }
    if (actor.role === AppRole.PROFESSOR) {
      return (
        await this.prisma.teacherProfile.findUnique({
          where: { userId: actor.sub },
        })
      )?.institutionId;
    }
    return null;
  }

  async create(dto: CreateStudentDto, actor: JwtPayload) {
    if (actor.role !== AppRole.ESCOLA && actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Somente a escola/admin cadastra por este endpoint');
    }

    let institutionId: string;
    if (actor.role === AppRole.ADMIN) {
      const first = await this.prisma.institution.findFirst({
        where: { active: true },
      });
      if (!first) throw new NotFoundException('Nenhuma instituicao');
      institutionId = first.id;
    } else {
      const id = await this.institutionIdFor(actor);
      if (!id) throw new ForbiddenException();
      institutionId = id;
    }

    const course = await this.prisma.course.findFirst({
      where: { id: dto.courseId, institutionId },
    });
    if (!course) throw new NotFoundException('Curso invalido');

    if (dto.classId) {
      const cls = await this.prisma.schoolClass.findFirst({
        where: { id: dto.classId, institutionId },
      });
      if (!cls) throw new NotFoundException('Turma invalida');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const created = await this.prisma.user.create({
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
              studentNumber: dto.studentNumber,
              gradeYear: dto.gradeYear,
              institutionId,
              courseId: dto.courseId,
              classId: dto.classId,
            },
          },
        },
        include: { student: { include: studentInclude } },
      });
      const { passwordHash: _, ...safe } = created;
      return safe;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail, CPF ou matricula ja cadastrados');
      }
      throw error;
    }
  }

  async findAll(actor: JwtPayload) {
    if (
      ![AppRole.ADMIN, AppRole.ESCOLA, AppRole.PROFESSOR].includes(actor.role)
    ) {
      throw new ForbiddenException();
    }
    if (actor.role === AppRole.ADMIN) {
      return this.prisma.studentProfile.findMany({
        include: studentInclude,
        orderBy: { fullName: 'asc' },
      });
    }
    const institutionId = await this.institutionIdFor(actor);
    if (!institutionId) throw new ForbiddenException();
    return this.prisma.studentProfile.findMany({
      where: { institutionId },
      include: studentInclude,
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(id: string, actor: JwtPayload) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: studentInclude,
    });
    if (!student) throw new NotFoundException('Aluno nao encontrado');
    if (actor.role === AppRole.ALUNO && student.userId !== actor.sub) {
      throw new ForbiddenException();
    }
    return student;
  }

  async update(id: string, dto: UpdateStudentDto, actor: JwtPayload) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });
    if (!student) throw new NotFoundException('Aluno nao encontrado');
    const canEdit =
      actor.role === AppRole.ADMIN ||
      actor.role === AppRole.ESCOLA ||
      (actor.role === AppRole.ALUNO && student.userId === actor.sub);
    if (!canEdit) throw new ForbiddenException();

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    return this.prisma.studentProfile.update({
      where: { id },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.rg !== undefined && { rg: dto.rg }),
        ...(dto.street !== undefined && { street: dto.street }),
        ...(dto.number !== undefined && { number: dto.number }),
        ...(dto.complement !== undefined && { complement: dto.complement }),
        ...(dto.district !== undefined && { district: dto.district }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.state !== undefined && { state: dto.state.toUpperCase() }),
        ...(dto.zipCode !== undefined && {
          zipCode: dto.zipCode.replace(/\D/g, ''),
        }),
        ...(dto.studentNumber !== undefined && {
          studentNumber: dto.studentNumber,
        }),
        ...(dto.gradeYear !== undefined && { gradeYear: dto.gradeYear }),
        ...(dto.courseId
          ? { course: { connect: { id: dto.courseId } } }
          : {}),
        ...(dto.classId !== undefined && {
          schoolClass: dto.classId
            ? { connect: { id: dto.classId } }
            : { disconnect: true },
        }),
        ...(passwordHash ? { user: { update: { passwordHash } } } : {}),
      },
      include: studentInclude,
    });
  }

  async deactivate(id: string, actor: JwtPayload) {
    if (actor.role !== AppRole.ESCOLA && actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException();
    }
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });
    if (!student) throw new NotFoundException('Aluno nao encontrado');
    await this.prisma.user.update({
      where: { id: student.userId },
      data: { active: false },
    });
    return { message: 'Aluno desativado' };
  }
}
