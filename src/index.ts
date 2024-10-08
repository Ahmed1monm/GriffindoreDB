import * as net from "net";

import RESPSerializer from "./respLexer";
import {handleCommand} from "./commands";
import AOF from "./AOF";

const PORT = 6379;
const HOST = "localhost"


const server: net.Server = net.createServer((connection: net.Socket) => {
    const aof = new AOF("aof.log");
    aof.setup();

    connection.on("data", (data: Buffer) => {
        const command = RESPSerializer.decode(data.toString());
        aof.write(data.toString());
        const result = handleCommand(command);
        try{
            connection.write(result);
        }catch (e){
            console.error(e);
        }
    })

    connection.on("end", () => {
        console.log("client disconnected !!")
    })
});


server.listen(PORT, HOST, undefined, () => {
    console.log(`Server listening on port ${PORT}`)
})
