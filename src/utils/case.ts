export type SnakeCase<T> = { [K in keyof T as CamelToSnake<K & string>]: T[K] }
export type CamelCase<T> = { [K in keyof T as SnakeToCamel<K & string>]: T[K] }
type CamelToSnake<T extends string, P extends string = ''> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
    ? CamelToSnake<R, `${P}${C0 extends Lowercase<C0> ? '' : '_'}${Lowercase<C0>}`>
    : P

type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamel<U>>}` : S
