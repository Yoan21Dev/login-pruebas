import { Prisma } from '@prisma/client';

import { Rol, RolFields } from '@rol/types/rol.types';

export const UserFields: Prisma.userSelect = {
  id: true,
  name: true,
  lastName: true,
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
  session: {
    select: {
      id: true,
      timesLoggedIn: true,
      lastAccess: true,
      email: true,
      accountConfirmed: true,
      password: true,
      type: { select: { id: true, name: true } },
      rol: { select: RolFields },
      status: { select: { id: true, name: true } },
    },
  },
};
export type User = {
  id: string;
  name: string;
  lastName: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date;

  session: {
    id: string;
    timesLoggedIn: number;
    lastAccess: Date;
    email: string;
    password: string;
    accountConfirmed: boolean;
    type: { id: number; name: string };
    rol: Rol;
    status: { id: number; name: string };
  };
};
