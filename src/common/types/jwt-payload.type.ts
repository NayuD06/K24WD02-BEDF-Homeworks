import { Role } from '../enums/role.enum';

export type JwtPayload = {
  sub: string;
  username: string;
  roles: Role[];
};
