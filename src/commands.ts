import RESPSerializer from "./respLexer";
import {get, set} from "./database";

export enum CommandType {
    SET = "SET",
    GET = "GET",
    ERROR = "ERROR",
    COMMAND = "COMMAND",
    PING = "PING",

    INTEGER = "INTEGER",
    CHAR = "CHAR",
    STRING = "STRING",
}

export interface IRedisCommand {
    name: string;
    args: string[];
}


export function handleCommand(command: IRedisCommand) {
    console.log(command);
    switch (command.name.toUpperCase()) {
        case CommandType.COMMAND:
        case CommandType.PING:
            return RESPSerializer.encodeSimpleString("PONG");
        case CommandType.SET:
            return RESPSerializer.encodeBulkString(set(command.args[1], command.args[3]));
        case CommandType.GET:
            return RESPSerializer.encodeBulkString(get(command.args[1]));
        case CommandType.INTEGER:
            return RESPSerializer.encodeInteger(parseInt(command.args[0], 10));
        case CommandType.CHAR:
            return RESPSerializer.encodeSimpleString(command.args[0]);
        default:
            return RESPSerializer.encodeError(`Unknown command: ${command.name}`);
    }
}