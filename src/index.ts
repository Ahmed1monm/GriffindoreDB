import * as net from "net";

import RESPSerializer from "./resp";
import {PORT} from "./configs";

const server: net.Server = net.createServer((connection: net.Socket)=>{

    connection.on("data",(data: Buffer)=>{
        console.log(`received data: ${data.toString('utf-8')}`)
        RESPSerializer.decode(data.toString())

        connection.write(RESPSerializer.encodeSimpleString("PONG"));
    })

    connection.on("end", ()=>{
        console.log("client disconnected !!")
    })
});

server.listen(PORT,'localhost',undefined, ()=>{
    console.log(`Server listening on port ${PORT}`)
})
