const express = require("express");
const app = express();
const ws = require("ws");

const socketServer = new ws.Server({
  noServer: true,
});

const dotenv = require("dotenv");

dotenv.config(); //load in our dotenv

// Import socket handlers
const socketHandlers = require('./socketEvents/socketHandlers')

// Import routers
const socketRoutes = require("./routes/socketRoutes");
const apiRoutes = require("./routes/api");
app.use("/", socketRoutes);
app.use("/api", apiRoutes);



app.get("/", (req, res) => {
  res.send({ message: "Express server running!" });
});

socketServer.on("connection", async (socket) => {
  socket.on("message", (rawData) => {
    const data = JSON.parse(rawData.toString());
    const { type } = data

    // Type must be provided on all data that's sent
    if (type === undefined) return console.error('No type was supplied for the given data.')

    switch (type) {
      case 0: return socketHandlers.registerConnection(data, socket)
      case 1: return socketHandlers.processSensors(data)
      case 2:  return socketHandlers.renameNode(data)
    }
    // socketConnections.forEach((s) => s.send(JSON.stringify(msg.data)));
  });
  socket.on("close", () => socketHandlers.handleConnectionClose());
  require("./socketEvents/telemetry")(socket);

  console.log("Received socket open!");
});

// Have server listen at our port
const PORT = process.env.PORT ?? 8080;
const rootServer = app.listen(PORT, () => {
  console.log(`Example listening on heroku at port: ` + PORT);
});
rootServer.on("upgrade", (request, socket, head) => {
  socketServer.handleUpgrade(request, socket, head, (socket) => {
    socketServer.emit("connection", socket, request);
  });
});