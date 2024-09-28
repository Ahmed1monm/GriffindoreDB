import * as fs from 'fs';

import RESPSerializer from './respLexer';
import { handleCommand } from './commands';

class AOF {
    constructor(private filename: string) {}

    public async write(data: string): Promise<void> {
        await fs.promises.appendFile(this.filename, data);
    }

    public async read(): Promise<string> {
        return await fs.promises.readFile(this.filename, 'utf-8');
    }

    public async clear(): Promise<void> {
        await fs.promises.writeFile(this.filename, '');
    }

    public async exists(): Promise<boolean> {
        try {
            await fs.promises.access(this.filename);
            return true;
        } catch {
            return false;
        }
    }

    public async setup(): Promise<void> {
        this.exists().then((exists) => {
            if (!exists) {
                this.write("");
            } else {
                this.read().then((data) => {
                    const commands = data.split("\r\n");
                    for (const command of commands) {
                        if (command.length > 0) {
                            const cmd = RESPSerializer.decode(command);
                            handleCommand(cmd);
                        }
                    }
                });
            }
        });
    }
}

export default AOF;