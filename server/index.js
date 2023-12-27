const { Server } = require("socket.io");

const io = new Server(8000);

io.on("connection", (socket)=>{
    console.log("New socket is connected", socket.id)
})
