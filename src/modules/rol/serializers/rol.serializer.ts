import { RolEntity } from '@rol/serializers/entities/rol.entity';
import { Rol } from '@rol/types/rol.types';

export function serializeOne(rol: Rol) {
  return new RolEntity(rol);
}

export function serializeMany(roles: Array<Rol>) {
  return roles.map((rol) => serializeOne(rol));
}
