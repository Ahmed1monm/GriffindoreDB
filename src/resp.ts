import { RESPType } from './configs';
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

  static decode(respString: string): any {
    const type: string = respString[0];
    console.log(`type: ${type}`);
    console.log(`respString: ${respString}`);
    const payload: string = respString.substring(1).trim();

    switch (type) {
      case RESPType.SimpleString:
      case RESPType.Error:
        return payload;
      case RESPType.Integer:
        return parseInt(payload, 10);
      case RESPType.BulkString:
        const lengthEndIndex: number = payload.indexOf('\r\n');
        const length: number = parseInt(payload.substring(0, lengthEndIndex), 10);
        const dataStartIndex: number = lengthEndIndex + 2;
        return payload.substring(dataStartIndex, dataStartIndex + length);
      case RESPType.Array:
        console.log(`payload: ${payload}`);
        const elements: string[] = payload.substring(1).split('\r\n');
        elements.pop();
        console.log(`elements: ${elements}`);
        return elements.map((element) => this.decode(element));
      default:
        throw new Error(`Unknown RESP type: ${type}`);
    }
  }
}
