const http = require('http')

const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config(); //load in our dotenv

const db = require('./db/db.js');

// Import routers
const socketRoutes = require("./routes/socketRoutes");
const apiRoutes = require("./routes/api");

app.use("/", socketRoutes);
app.use('/api', apiRoutes)

app.get("/", (req, res) => {
    res.send({ message: "Express server running!" });
  });


const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set("socketio", io);



// Listen for any connections on socket
io.on("connection", (socket) => {
  console.log("a user connected");

  // Add any socket functions here
  require("./socketEvents/telemetry")(socket, io);

  // Run code on socket disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});



// Have server listen at our port
const PORT = process.env.PORT ?? 8080;
server.listen(PORT, () => {
  console.log("Express app listening on port", PORT);

});
