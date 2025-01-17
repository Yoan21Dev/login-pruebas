export interface ISessionInfo {
  id?: number;
  type?: number;
  sede?: number;
  rol?: number;
  iat: number;
  exp: number;
  jti: string;
  atjwtid?: string;
}
