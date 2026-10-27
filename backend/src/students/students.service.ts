import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { UpdateStudentDto } from './dto/update-student.dto';

const studentInclude = {
  institution: true,
  course: true,
  user: { select: { id: true, email: true, role: true, active: true } },
} as const;

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(actor: JwtPayload) {
    if (actor.role === Role.ADMIN || actor.role === Role.PROFESSOR) {
      return this.prisma.studentProfile.findMany({
        where:
          actor.role === Role.PROFESSOR
            ? {
                institution: {
                  teachers: { some: { userId: actor.sub } },
                },
              }
            : undefined,
        include: studentInclude,
        orderBy: { fullName: 'asc' },
      });
    }
    throw new ForbiddenException();
  }

  async findOne(id: string, actor: JwtPayload) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: studentInclude,
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    this.assertCanRead(student.userId, actor);
    return student;
  }

  async update(id: string, dto: UpdateStudentDto, actor: JwtPayload) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    if (actor.role !== Role.ADMIN && student.userId !== actor.sub) {
      throw new ForbiddenException();
    }

    if (dto.institutionId || dto.courseId) {
      const institutionId = dto.institutionId ?? student.institutionId;
      const courseId = dto.courseId ?? student.courseId;
      const course = await this.prisma.course.findFirst({
        where: { id: courseId, institutionId },
      });
      if (!course) {
        throw new NotFoundException('Curso inválido para a instituição');
      }
    }

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
        ...(dto.institutionId
          ? { institution: { connect: { id: dto.institutionId } } }
          : {}),
        ...(dto.courseId ? { course: { connect: { id: dto.courseId } } } : {}),
        ...(passwordHash ? { user: { update: { passwordHash } } } : {}),
      },
      include: studentInclude,
    });
  }

  async deactivate(id: string, actor: JwtPayload) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    if (actor.role !== Role.ADMIN && student.userId !== actor.sub) {
      throw new ForbiddenException();
    }
    await this.prisma.user.update({
      where: { id: student.userId },
      data: { active: false },
    });
    return { message: 'Conta de aluno desativada' };
  }

  private assertCanRead(ownerUserId: string, actor: JwtPayload) {
    if (actor.role === Role.ADMIN || actor.role === Role.PROFESSOR) return;
    if (actor.role === Role.ALUNO && actor.sub === ownerUserId) return;
    throw new ForbiddenException();
  }
}
