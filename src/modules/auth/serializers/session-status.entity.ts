export class SessionStatusEntity {
  id: number;
  name: string;

  constructor(partial: Partial<SessionStatusEntity>) {
    Object.assign(this, partial);
  }
}
