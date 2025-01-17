import { Prisma } from '@prisma/client';

export const UserAdminFields: Prisma.user_adminSelect = {
  id: true,
  name: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,

  session: {
    select: {
      id: true,
      email: true,
      lastAccess: true,
      timesLoggedIn: true,
      status: { select: { id: true, name: true } },
    },
  },
};

export type UserAdmin = {
  id: string;
  name: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  session: {
    id: string;
    email: string;
    lastAccess: Date;
    timesLoggedIn: number;
    status: { id: number; name: string };
  };
};
