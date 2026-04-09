import { FindManyOptions } from "typeorm";
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default("createdAt"),
  order: z.enum(["ASC", "DESC"]).default("DESC"),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function buildPaginationOptions(
  params: PaginationParams,
  allowedSortFields: string[] = ["createdAt", "updatedAt"],
): Pick<FindManyOptions, "skip" | "take" | "order"> {
  const sortField = allowedSortFields.includes(params.sort)
    ? params.sort
    : "createdAt";

  return {
    skip: (params.page - 1) * params.limit,
    take: params.limit,
    order: { [sortField]: params.order } as Record<string, "ASC" | "DESC">,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  return {
    data,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
