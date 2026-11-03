import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function currentSemester(d = new Date()) {
  const year = d.getFullYear();
  const sem = d.getMonth() < 6 ? 1 : 2;
  return `${year}.${sem}`;
}

async function main() {
  const passwordHash = await bcrypt.hash('Senha@123', 10);

  const institution = await prisma.institution.upsert({
    where: { name: 'PUC Minas' },
    update: {},
    create: { name: 'PUC Minas' },
  });

  const dept = await prisma.department.upsert({
    where: {
      name_institutionId: {
        name: 'Engenharia de Software',
        institutionId: institution.id,
      },
    },
    update: {},
    create: {
      name: 'Engenharia de Software',
      institutionId: institution.id,
    },
  });

  const course = await prisma.course.upsert({
    where: {
      name_institutionId: {
        name: 'Engenharia de Software',
        institutionId: institution.id,
      },
    },
    update: {},
    create: {
      name: 'Engenharia de Software',
      institutionId: institution.id,
    },
  });

  await prisma.course.upsert({
    where: {
      name_institutionId: {
        name: 'Ciencia da Computacao',
        institutionId: institution.id,
      },
    },
    update: {},
    create: {
      name: 'Ciencia da Computacao',
      institutionId: institution.id,
    },
  });

  const class1 = await prisma.schoolClass.upsert({
    where: {
      name_institutionId: { name: '3o Ano A', institutionId: institution.id },
    },
    update: {},
    create: {
      name: '3o Ano A',
      gradeYear: '3o Ano',
      institutionId: institution.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'escola@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'escola@demo.meritcoin.local',
      passwordHash,
      role: Role.ESCOLA,
      school: {
        create: {
          displayName: 'Secretaria Escolar',
          institutionId: institution.id,
        },
      },
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'professor@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'professor@demo.meritcoin.local',
      passwordHash,
      role: Role.PROFESSOR,
      teacher: {
        create: {
          fullName: 'Profa. Ana Silva',
          cpf: '11122233344',
          balance: 0,
          institutionId: institution.id,
          departmentId: dept.id,
          classes: { create: [{ classId: class1.id }] },
        },
      },
    },
    include: { teacher: true },
  });

  const semester = currentSemester();
  if (teacherUser.teacher) {
    const credit = await prisma.teacherSemesterCredit.upsert({
      where: {
        teacherId_semester: {
          teacherId: teacherUser.teacher.id,
          semester,
        },
      },
      update: {},
      create: {
        teacherId: teacherUser.teacher.id,
        semester,
        amount: 1000,
      },
    });
    const existingTx = await prisma.walletTransaction.findFirst({
      where: {
        teacherId: teacherUser.teacher.id,
        type: 'SEMESTER_CREDIT',
        description: `Credito semestral ${semester}`,
      },
    });
    if (!existingTx) {
      await prisma.teacherProfile.update({
        where: { id: teacherUser.teacher.id },
        data: { balance: 1000 },
      });
      await prisma.walletTransaction.create({
        data: {
          type: 'SEMESTER_CREDIT',
          amount: 1000,
          balanceAfter: 1000,
          description: `Credito semestral ${semester}`,
          teacherId: teacherUser.teacher.id,
        },
      });
    }
    void credit;
  }

  await prisma.user.upsert({
    where: { email: 'aluno@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'aluno@demo.meritcoin.local',
      passwordHash,
      role: Role.ALUNO,
      student: {
        create: {
          fullName: 'Arthur Demo Aluno',
          cpf: '12345678901',
          rg: 'MG123456',
          street: 'Rua da Bahia',
          number: '1000',
          district: 'Centro',
          city: 'Belo Horizonte',
          state: 'MG',
          zipCode: '30160011',
          studentNumber: '20260001',
          gradeYear: '3o Ano',
          balance: 0,
          institutionId: institution.id,
          courseId: course.id,
          classId: class1.id,
        },
      },
    },
  });

  const company = await prisma.user.upsert({
    where: { email: 'empresa@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'empresa@demo.meritcoin.local',
      passwordHash,
      role: Role.EMPRESA,
      company: {
        create: {
          tradeName: 'Cafe Campus LTDA',
          cnpj: '12345678000199',
        },
      },
    },
    include: { company: true },
  });

  if (company.company) {
    const rewardCount = await prisma.reward.count({
      where: { companyId: company.company.id },
    });
    if (rewardCount === 0) {
      await prisma.reward.createMany({
        data: [
          {
            companyId: company.company.id,
            title: 'Cafe expresso',
            description: 'Um cafe expresso no campus',
            imageUrl: 'https://placehold.co/600x400/800080/FFFFFF?text=Cafe',
            costCoins: 50,
          },
          {
            companyId: company.company.id,
            title: 'Desconto 10% material',
            description: 'Desconto em materiais escolares',
            imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=Material',
            costCoins: 120,
          },
        ],
      });
    }
  }

  await prisma.user.upsert({
    where: { email: 'admin@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'admin@demo.meritcoin.local',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Seed enunciado + extras OK. Senha: Senha@123');
  console.log('aluno / professor / empresa / escola / admin @demo.meritcoin.local');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
