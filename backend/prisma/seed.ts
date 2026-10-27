import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Senha@123', 10);

  const institution = await prisma.institution.upsert({
    where: { name: 'PUC Minas' },
    update: {},
    create: { name: 'PUC Minas' },
  });

  const ufmg = await prisma.institution.upsert({
    where: { name: 'UFMG' },
    update: {},
    create: { name: 'UFMG' },
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

  const coursesPuc = [
    'Engenharia de Software',
    'Ciência da Computação',
    'Sistemas de Informação',
  ];
  for (const name of coursesPuc) {
    await prisma.course.upsert({
      where: { name_institutionId: { name, institutionId: institution.id } },
      update: {},
      create: { name, institutionId: institution.id },
    });
  }

  for (const name of ['Engenharia de Computação', 'Ciência da Computação']) {
    await prisma.course.upsert({
      where: { name_institutionId: { name, institutionId: ufmg.id } },
      update: {},
      create: { name, institutionId: ufmg.id },
    });
  }

  const course = await prisma.course.findFirstOrThrow({
    where: {
      name: 'Engenharia de Software',
      institutionId: institution.id,
    },
  });

  // Professor pré-cadastrado (não via cadastro público)
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
          balance: 1000,
          institutionId: institution.id,
          departmentId: dept.id,
        },
      },
    },
  });

  // Aluno de demonstração
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
          balance: 0,
          institutionId: institution.id,
          courseId: course.id,
        },
      },
    },
  });

  // Empresa de demonstração
  await prisma.user.upsert({
    where: { email: 'empresa@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'empresa@demo.meritcoin.local',
      passwordHash,
      role: Role.EMPRESA,
      company: {
        create: {
          tradeName: 'Café Campus LTDA',
          cnpj: '12345678000199',
        },
      },
    },
  });

  // Admin (pré-cadastro institucional)
  await prisma.user.upsert({
    where: { email: 'admin@demo.meritcoin.local' },
    update: {},
    create: {
      email: 'admin@demo.meritcoin.local',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Seed Sprint 2 concluído.');
  console.log('Credenciais demo (senha: Senha@123):');
  console.log('- aluno@demo.meritcoin.local');
  console.log('- professor@demo.meritcoin.local');
  console.log('- empresa@demo.meritcoin.local');
  console.log('- admin@demo.meritcoin.local');
  console.log('Professor user id:', teacherUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
