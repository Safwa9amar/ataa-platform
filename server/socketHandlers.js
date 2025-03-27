// socketHandlers.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log(`New socket connected: ${socket.id}`);

    socket.on("register", ({ userId }) => {
      if (userId) {
        // Use a namespace or room to associate the user
        socket.join(`user:${userId}`);
        console.log(`Socket ${socket.id} joined room user:${userId}`);
      }
    });

    socket.on("disconnect", () => {
      // console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
