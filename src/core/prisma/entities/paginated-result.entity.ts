export class PaginateResultMeta {
  totalItems: number;
  limit: number;
  page: number;
  totalPages: number;
  previousPageUrl: string;
  nextPageUrl: string;
  lastPageUrl: string;
  firstPageUrl: string;

  constructor(partial: Partial<PaginateResultMeta>) {
    Object.assign(this, partial);
  }
}

export class PaginateResult<T> {
  data: Array<T>;
  meta: PaginateResultMeta;

  constructor(partial: Partial<PaginateResult<T>>) {
    Object.assign(this, partial);
  }
}
