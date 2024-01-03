const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailIdToSocketIdMap = new Map()
const socketIdToEmailIdMap = new Map()

io.on("connection", (socket)=>{
    console.log("New socket is connected", socket.id)
    socket.on("room:join", (data)=>{
        const {emailId, roomId} = data;
        console.log(emailId,roomId)
        emailIdToSocketIdMap.set(emailId, socket.id)
        socketIdToEmailIdMap.set(socket.id, emailId)
        io.to(roomId).emit("user:joined", {emailId, id: socket.id})
        socket.join(roomId);
        io.to(socket.id).emit("room:join", data);
        
    });
    // socket.on("all:emails",({emailId, roomId})=>{
    //     io.to(roomId).emit("show:all:emails", emailId);
    // });
    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });
    socket.on("call:accepted",({to,ans})=>{
        io.to(to).emit("call:accepted", {from: socket.id,ans})
    });
    socket.on("peer:nego:needed",({offer,to})=>{
      io.to(to).emit("peer:nego:needed", {from: socket.id, offer})
    });
    socket.on("peer:nego:done",({to,ans})=>{
      io.to(to).emit("peer:nego:final", {from: socket.id, ans})
    })

    // socket.on("disconnect", () => {
    //     console.log("Socket disconnected", socket.id);

    //     // Remove entries from maps on disconnect
    //     const emailId = socketIdToEmailIdMap.get(socket.id);
    //     emailIdToSocketIdMap.delete(emailId);
    //     socketIdToEmailIdMap.delete(socket.id);
    // });
})


