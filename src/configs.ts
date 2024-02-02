export const PORT: number = 6379;
export enum RESPType {
    SimpleString = '+',
    Error = '-',
    Integer = ':',
    BulkString = '$',
    Array = '*',
}