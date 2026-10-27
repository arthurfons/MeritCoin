import { Role } from './roles.enum';

export class JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
