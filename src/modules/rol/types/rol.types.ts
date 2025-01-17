import { Prisma } from '@prisma/client';

export const RolFields: Prisma.session_rolSelect = {
  id: true,
  name: true,
  description: true,
};

export type Rol = {
  id: number;
  name: string;
  description?: string;
};
