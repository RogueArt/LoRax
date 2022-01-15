const http = require('http')

const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config(); //load in our dotenv

app.use(express.json()); // Parse body of requests as json
app.use(cors()); // Enable cors

const db = require('./db/db.js')

const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
app.set("socketio", io);

// Import routers
const socketRoutes = require("./routes/socketRoutes");
const apiRoutes = require("./routes/api");
app.use("/", socketRoutes);
app.use('/api', apiRoutes)

app.get("/", (req, res) => {
  res.send({ message: "Express server running!" });
});

// Listen for any connections on socket
io.on("connection", (socket) => {
  console.log("a user connected");

  // Add any socket functions here
  require("socketEvents/telemetry")(socket, io);

  // Run code on socket disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Have server listen at our port
const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.log("Express app listening on port", PORT);
});
