import * as net from "net";

const server: net.Server = net.createServer((connection: net.Socket)=>{
    
    connection.on("data",(data: Buffer)=>{
        console.log(`received data: ${data.toString('utf-8')}`)
        // Send Pong 
        connection.write('+OK\r\n')
    })

    connection.on("end", ()=>{
        console.log("client disconnected !!")
    })
});

const PORT = 6379;

server.listen(PORT,'localhost',undefined, ()=>{
    console.log(`Server listining on port ${PORT}`)
})
