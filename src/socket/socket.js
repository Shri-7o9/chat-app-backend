export const setupSocket = (io) => {

    io.on("connection", (socket)=>{

        console.log("User connected:", socket.id);


        socket.on("joinRoom",(userId)=>{
            socket.join(userId);
            console.log("User joined:", userId);
        });


        socket.on("sendMessage",(message)=>{
            console.log(message);

            io.to(message.receiverId)
              .emit("newMessage", message);
        });


        socket.on("disconnect",()=>{
            console.log("User disconnected:", socket.id);
        });
        socket.on("forwardMessage",(messages)=>{
    console.log("Forwarding messages:", messages);

    messages.forEach((message) => {
        io.to(message.receiverId)
          .emit("newMessage", message);
    });
});

    });

};