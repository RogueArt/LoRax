const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const ws = require("ws");

const socketServer = new ws.Server({
  noServer: true,
});

const dotenv = require("dotenv");

dotenv.config(); //load in our dotenv

const db = require("./db/db.js");

// Import routers
const socketRoutes = require("./routes/socketRoutes");
const apiRoutes = require("./routes/api");

app.use("/", socketRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send({ message: "Express server running!" });
});

let socketConnections = [];

socketServer.on("connection", (socket) => {
  socketConnections.push(socket);

  socket.on("message", (msg) => {
    socketConnections.forEach((s) => s.send(msg));
  });
  socket.on("close", () => {
    console.log("Closing socket!");
    socketConnections = socketConnections.filter((s) => s !== socket);
    console.log("There are " + socketConnections.length + " connections left.");
  });
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
