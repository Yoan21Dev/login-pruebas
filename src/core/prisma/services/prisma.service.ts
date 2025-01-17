import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPromise } from '@prisma/client/runtime/library';

import { QueryParams } from '@core/types/query-params.type';
import {
  PaginateResult,
  PaginateResultMeta,
} from '@core/prisma/entities/paginated-result.entity';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // @ts-ignore
    // this.$on('query', async (e) => {

    //   @ts-ignore
    //   console.log(`${e.query} ${e.params}`);
    // });
  }

  public buildUrl(
    resourceId: number | bigint | string,
    resourceUrl: string
  ): string {
    const configService = new ConfigService();
    const baseUrl: string = configService.get<string>('BASE_URL');

    return `${baseUrl}/${resourceUrl}/${resourceId}`;
  }

  public async paginatedSearch<T, K, U>(
    model: {
      count: (args: any) => PrismaPromise<number>;
      findMany: (args: any) => PrismaPromise<T[]>;
    },
    args: { where?: any } & K,
    resourceUrl: string,
    queryParams: QueryParams,
    serializingFunction?: (
      data: Array<T>,
      configService: ConfigService
    ) => Array<U>
  ): Promise<PaginateResult<T | U>> {
    const configService = new ConfigService();
    const limit = +queryParams?.limit || 10;
    const skip = +queryParams.page > 0 ? limit * (+queryParams.page - 1) : 0;
    const [totalItems, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: limit,
        skip,
      }),
    ]);
    let serializedData = null;

    if (serializingFunction) {
      serializedData = serializingFunction(data, configService);
    }

    const baseUrl: string = `${configService.get<string>(
      'BASE_URL'
    )}/${resourceUrl}?`;
    const lastPageNumber: number = Math.ceil(totalItems / limit);
    const nextPageNumber: number =
      +queryParams.page < lastPageNumber ? +queryParams.page + 1 : null;
    const previosPageNumber: number =
      +queryParams.page > 1 ? +queryParams.page - 1 : null;
    const queryParamsLink = this.constructQueryParamsLink(queryParams);
    const lastPageUrl: string = `${baseUrl}limit=${limit}&page=${lastPageNumber}${queryParamsLink}`;
    const nextPageUrl: string =
      (nextPageNumber &&
        `${baseUrl}limit=${limit}&page=${nextPageNumber}${queryParamsLink}`) ||
      null;
    const previousPageUrl: string =
      (previosPageNumber &&
        `${baseUrl}limit=${limit}&page=${previosPageNumber}${queryParamsLink}`) ||
      null;
    const firstPageUrl: string = `${baseUrl}limit=${limit}&page=${1}${queryParamsLink}`;
    const totalPages: number = Math.ceil(totalItems / limit);
    const meta = {
      totalItems,
      page: +queryParams.page,
      limit,
      previousPageUrl,
      nextPageUrl,
      firstPageUrl,
      lastPageUrl,
      totalPages,
    };

    return new PaginateResult({
      data: serializedData || data,
      meta: new PaginateResultMeta(meta),
    });
  }

  private constructQueryParamsLink(queryParams: {
    [key: string]: [value: string];
  }) {
    let finalString = '';

    for (const [key, value] of Object.entries(queryParams)) {
      if (key === 'page' || key === 'limit') {
        continue;
      }

      finalString += `&${key}=${value}`;
    }

    return finalString;
  }
}
