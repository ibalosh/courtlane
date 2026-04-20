export type ParseResult<T> = { success: true; data: T } | { success: false; error: { flatten(): unknown } };

export type ParseSchema<T> = {
  safeParse(value: unknown): ParseResult<T>;
};
