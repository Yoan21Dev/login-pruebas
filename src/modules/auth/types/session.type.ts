import { Prisma } from '@prisma/client';

export const SessionFields: Prisma.sessionSelect = {
  id: true,
  timesLoggedIn: true,
  lastAccess: true,
  email: true,
  password: true,
  type: { select: { id: true, name: true } },
  rol: { select: { id: true, name: true } },
  status: { select: { id: true, name: true } },
};

export type Session = {
  id: string;
  timesLoggedIn: number;
  lastAccess: Date;
  email: string;
  password: string;
  type: { id: number; name: string };
  rol: { id: number; name: string };
  status: { id: number; name: string };
};
