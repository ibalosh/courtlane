export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { flatten(): unknown } };

export type SafeParseSchema<T> = {
  safeParse(value: unknown): SafeParseResult<T>;
};
