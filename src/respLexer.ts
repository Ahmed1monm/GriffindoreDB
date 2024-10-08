import {CommandType, IRedisCommand} from "./commands";

export enum RESPType {
    SimpleString = '+',
    Error = '-',
    Integer = ':',
    BulkString = '$',
    Array = '*',
}

export default class RESPSerializer {
    static encodeSimpleString(value: string): string {
        return `${RESPType.SimpleString}${value}\r\n`;
    }

    static encodeError(errorMsg: string): string {
        return `${RESPType.Error}${errorMsg}\r\n`;
    }

    static encodeInteger(value: number): string {
        return `${RESPType.Integer}${value}\r\n`;
    }

    static encodeBulkString(value: string): string {
        const length: number = value.length;
        return `${RESPType.BulkString}${length}\r\n${value}\r\n`;
    }

    static encodeArray(values: string[]): string {
        const length: number = values.length;
        let result: string = `${RESPType.Array}${length}\r\n`;

        for (const value of values) {
            result += this.encodeBulkString(value);
        }

        return result;
    }

    static decode(respString: string): IRedisCommand {
        const type: string = respString[0];
        const payload: string = respString.substring(1).trim();

        switch (type) {
            case RESPType.SimpleString:
                return {name: CommandType.CHAR, args: [payload]};
            case RESPType.Error:
                return {name: CommandType.ERROR, args: [payload]};
            case RESPType.Integer:
                return {name: CommandType.INTEGER, args: [payload]};
            case RESPType.BulkString:
                const lengthEndIndex: number = payload.indexOf('\r\n');
                const length: number = parseInt(payload.substring(0, lengthEndIndex), 10);
                const dataStartIndex: number = lengthEndIndex + 2;
                return {name: CommandType.STRING, args: [payload.substring(dataStartIndex, dataStartIndex + length)]}
            case RESPType.Array:
                const elements: string[] = payload.split('\r\n').splice(1);
                const [_, command, ...args] = elements; // TODO:: check array length
                return {name: command, args};
            default:
                throw new Error(`Unknown RESP type: ${type}`);
        }
    }
}
