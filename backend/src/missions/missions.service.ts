import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MissionCompletionStatus,
  MissionScope,
  Prisma,
  WalletTxType,
} from '@prisma/client';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ReviewCompletionDto } from './dto/review-completion.dto';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMissionDto, actor: JwtPayload) {
    if (
      actor.role !== Role.ESCOLA &&
      actor.role !== Role.PROFESSOR &&
      actor.role !== Role.ADMIN
    ) {
      throw new ForbiddenException();
    }

    if (dto.scope === MissionScope.SCHOOL) {
      if (actor.role !== Role.ESCOLA && actor.role !== Role.ADMIN) {
        throw new ForbiddenException(
          'Somente a escola cria missões para todos os alunos',
        );
      }
    }

    if (dto.scope === MissionScope.CLASS && !dto.classId) {
      throw new BadRequestException('Missão de turma exige classId');
    }

    const ctx = await this.actorContext(actor);
    if (!ctx.institutionId) throw new ForbiddenException();

    let teacherId: string | undefined;
    if (actor.role === Role.PROFESSOR) {
      teacherId = ctx.teacherId;
      if (dto.classId && !ctx.classIds.includes(dto.classId)) {
        throw new ForbiddenException('Turma não vinculada a este professor');
      }
    }

    if (dto.classId) {
      const cls = await this.prisma.schoolClass.findFirst({
        where: { id: dto.classId, institutionId: ctx.institutionId },
      });
      if (!cls) throw new NotFoundException('Turma não encontrada');
    }

    return this.prisma.mission.create({
      data: {
        title: dto.title,
        description: dto.description,
        rewardCoins: dto.rewardCoins,
        scope: dto.scope,
        institutionId: ctx.institutionId,
        classId: dto.scope === MissionScope.CLASS ? dto.classId : null,
        teacherId: teacherId ?? null,
        createdById: actor.sub,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
        repeatable: dto.repeatable ?? false,
        maxPerWeek: dto.maxPerWeek,
      },
      include: {
        schoolClass: true,
        teacher: { select: { id: true, fullName: true } },
      },
    });
  }

  async listForActor(actor: JwtPayload) {
    const ctx = await this.actorContext(actor);

    if (actor.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: actor.sub },
      });
      if (!student) throw new ForbiddenException();
      return this.prisma.mission.findMany({
        where: {
          active: true,
          institutionId: student.institutionId,
          OR: [
            { scope: MissionScope.SCHOOL },
            { scope: MissionScope.CLASS, classId: student.classId ?? undefined },
          ],
        },
        include: {
          schoolClass: true,
          completions: {
            where: { studentId: student.id },
            orderBy: { submittedAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!ctx.institutionId && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    return this.prisma.mission.findMany({
      where:
        actor.role === Role.ADMIN
          ? { active: true }
          : {
              active: true,
              institutionId: ctx.institutionId!,
              ...(actor.role === Role.PROFESSOR
                ? {
                    OR: [
                      { teacherId: ctx.teacherId },
                      { scope: MissionScope.SCHOOL },
                      { classId: { in: ctx.classIds } },
                    ],
                  }
                : {}),
            },
      include: {
        schoolClass: true,
        teacher: { select: { id: true, fullName: true } },
        _count: { select: { completions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitCompletion(missionId: string, actor: JwtPayload) {
    if (actor.role !== Role.ALUNO) throw new ForbiddenException();
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId: actor.sub },
    });
    if (!student) throw new ForbiddenException();

    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission || !mission.active) {
      throw new NotFoundException('Missão não encontrada');
    }
    if (mission.institutionId !== student.institutionId) {
      throw new ForbiddenException();
    }
    if (
      mission.scope === MissionScope.CLASS &&
      mission.classId !== student.classId
    ) {
      throw new ForbiddenException('Missão de outra turma');
    }
    if (mission.dueAt && mission.dueAt < new Date()) {
      throw new BadRequestException('Prazo da missão encerrado');
    }

    if (mission.repeatable && mission.maxPerWeek) {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const count = await this.prisma.missionCompletion.count({
        where: {
          missionId,
          studentId: student.id,
          status: {
            in: [
              MissionCompletionStatus.PENDING,
              MissionCompletionStatus.APPROVED,
            ],
          },
          submittedAt: { gte: weekAgo },
        },
      });
      if (count >= mission.maxPerWeek) {
        throw new BadRequestException('Limite semanal desta missão atingido');
      }
    } else {
      const existing = await this.prisma.missionCompletion.findFirst({
        where: {
          missionId,
          studentId: student.id,
          status: {
            in: [
              MissionCompletionStatus.PENDING,
              MissionCompletionStatus.APPROVED,
            ],
          },
        },
      });
      if (existing) {
        throw new BadRequestException(
          'Você já enviou ou concluiu esta missão',
        );
      }
    }

    return this.prisma.missionCompletion.create({
      data: {
        missionId,
        studentId: student.id,
        status: MissionCompletionStatus.PENDING,
      },
      include: { mission: true },
    });
  }

  async listPending(actor: JwtPayload) {
    if (
      actor.role !== Role.ESCOLA &&
      actor.role !== Role.PROFESSOR &&
      actor.role !== Role.ADMIN
    ) {
      throw new ForbiddenException();
    }
    const ctx = await this.actorContext(actor);

    return this.prisma.missionCompletion.findMany({
      where: {
        status: MissionCompletionStatus.PENDING,
        mission:
          actor.role === Role.ADMIN
            ? undefined
            : {
                institutionId: ctx.institutionId ?? undefined,
                ...(actor.role === Role.PROFESSOR
                  ? {
                      OR: [
                        { teacherId: ctx.teacherId },
                        { classId: { in: ctx.classIds } },
                        { scope: MissionScope.SCHOOL },
                      ],
                    }
                  : {}),
              },
      },
      include: {
        mission: true,
        student: { include: { schoolClass: true, user: { select: { email: true } } } },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async review(
    completionId: string,
    dto: ReviewCompletionDto,
    actor: JwtPayload,
  ) {
    if (
      actor.role !== Role.ESCOLA &&
      actor.role !== Role.PROFESSOR &&
      actor.role !== Role.ADMIN
    ) {
      throw new ForbiddenException();
    }
    if (
      dto.status !== MissionCompletionStatus.APPROVED &&
      dto.status !== MissionCompletionStatus.REJECTED
    ) {
      throw new BadRequestException('Status inválido');
    }

    const completion = await this.prisma.missionCompletion.findUnique({
      where: { id: completionId },
      include: { mission: true, student: true },
    });
    if (!completion) throw new NotFoundException('Envio não encontrado');
    if (completion.status !== MissionCompletionStatus.PENDING) {
      throw new BadRequestException('Este envio já foi revisado');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.missionCompletion.update({
        where: { id: completionId },
        data: {
          status: dto.status,
          note: dto.note,
          reviewedById: actor.sub,
          reviewedAt: new Date(),
        },
        include: { mission: true, student: true },
      });

      if (dto.status === MissionCompletionStatus.APPROVED) {
        const s = await tx.studentProfile.update({
          where: { id: completion.studentId },
          data: {
            balance: { increment: completion.mission.rewardCoins },
          },
        });
        await tx.walletTransaction.create({
          data: {
            type: WalletTxType.MISSION_REWARD,
            amount: completion.mission.rewardCoins,
            balanceAfter: s.balance,
            description: `Missao: ${completion.mission.title}`,
            studentId: completion.studentId,
          },
        });
      }

      return updated;
    });
  }

  private async actorContext(actor: JwtPayload) {
    if (actor.role === Role.ESCOLA) {
      const school = await this.prisma.schoolProfile.findUnique({
        where: { userId: actor.sub },
      });
      return {
        institutionId: school?.institutionId,
        teacherId: undefined as string | undefined,
        classIds: [] as string[],
      };
    }
    if (actor.role === Role.PROFESSOR) {
      const teacher = await this.prisma.teacherProfile.findUnique({
        where: { userId: actor.sub },
        include: { classes: true },
      });
      return {
        institutionId: teacher?.institutionId,
        teacherId: teacher?.id,
        classIds: teacher?.classes.map((c) => c.classId) ?? [],
      };
    }
    if (actor.role === Role.ADMIN) {
      const inst = await this.prisma.institution.findFirst({
        where: { active: true },
      });
      return {
        institutionId: inst?.id,
        teacherId: undefined as string | undefined,
        classIds: [] as string[],
      };
    }
    return {
      institutionId: undefined as string | undefined,
      teacherId: undefined as string | undefined,
      classIds: [] as string[],
    };
  }
}
