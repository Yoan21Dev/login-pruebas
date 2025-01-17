export class SessionTypeEntity {
  id: number;
  name: string;

  constructor(partial: Partial<SessionTypeEntity>) {
    Object.assign(this, partial);
  }
}
