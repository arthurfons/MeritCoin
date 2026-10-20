import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const puc = await prisma.instituicao.upsert({
    where: { nome: 'PUC Minas' },
    update: {},
    create: { nome: 'PUC Minas' },
  });

  const ufmg = await prisma.instituicao.upsert({
    where: { nome: 'UFMG' },
    update: {},
    create: { nome: 'UFMG' },
  });

  const cursosPuc = [
    'Engenharia de Software',
    'Ciência da Computação',
    'Sistemas de Informação',
  ];
  for (const nome of cursosPuc) {
    await prisma.curso.upsert({
      where: { nome_instituicaoId: { nome, instituicaoId: puc.id } },
      update: {},
      create: { nome, instituicaoId: puc.id },
    });
  }

  const cursosUfmg = ['Engenharia de Computação', 'Ciência da Computação'];
  for (const nome of cursosUfmg) {
    await prisma.curso.upsert({
      where: { nome_instituicaoId: { nome, instituicaoId: ufmg.id } },
      update: {},
      create: { nome, instituicaoId: ufmg.id },
    });
  }

  const senhaHash = await bcrypt.hash('senha123', 10);

  await prisma.professor.upsert({
    where: { cpf: '11122233344' },
    update: {},
    create: {
      nome: 'Prof. Ana Silva',
      cpf: '11122233344',
      departamento: 'Engenharia de Software',
      login: 'ana.silva',
      senhaHash,
      saldoMoedas: 1000,
      instituicaoId: puc.id,
    },
  });

  console.log('Seed concluído: instituições, cursos e professor pré-cadastrados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
