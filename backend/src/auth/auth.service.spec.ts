jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {
    signAsync = jest.fn();
  },
}));

import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const passwordHash = bcrypt.hashSync('Senha@123', 4);

  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    course: {
      findFirst: jest.fn(),
    },
  };

  const jwt = {
    signAsync: jest.fn().mockResolvedValue('token-demo'),
  };

  const service = new AuthService(prisma as never, jwt as never);

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.signAsync.mockResolvedValue('token-demo');
  });

  it('rejeita login com credenciais inválidas', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'x@y.com', password: 'Senha@123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('autentica usuário ativo com senha correta', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'aluno@demo.meritcoin.local',
      passwordHash,
      role: Role.ALUNO,
      active: true,
      student: { id: 's1' },
    });
    const res = await service.login({
      email: 'aluno@demo.meritcoin.local',
      password: 'Senha@123',
    });
    expect(res.accessToken).toBe('token-demo');
    expect(res.user).not.toHaveProperty('passwordHash');
  });

  it('impede cadastro de aluno com curso de outra instituição', async () => {
    prisma.course.findFirst.mockResolvedValue(null);
    await expect(
      service.registerStudent({
        fullName: 'Teste',
        email: 't@t.com',
        cpf: '12345678901',
        rg: '1',
        password: 'Senha@123',
        street: 'Rua',
        number: '1',
        district: 'Bairro',
        city: 'BH',
        state: 'MG',
        zipCode: '30100000',
        institutionId: '11111111-1111-1111-1111-111111111111',
        courseId: '22222222-2222-2222-2222-222222222222',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
