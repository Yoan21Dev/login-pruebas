export class RolEntity {
  id: number;
  name: string;
  description?: string;

  constructor(partial: Partial<RolEntity>) {
    Object.assign(this, partial);
  }
}
