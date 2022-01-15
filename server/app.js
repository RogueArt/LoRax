const express = require("express");
const http = require("http");

const dotenv = require("dotenv");
const cors = require("cors");
//load in our dotenv
dotenv.config();
const port = process.env.PORT || 8080;

const app = express();
//parse body of requests as json
app.use(express.json());
//enable cors
app.use(cors());

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set("socketio", io);

//load in your routes
const socketRoutes = require("./routes/socketRoutes");
app.use("/", socketRoutes);

app.get("/", (req, res) => {
  res.send({ message: "Express server running!" });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  //add our socket functions here
  require("socketEvents/telemetry")(socket, io);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log("Express app listening on port: " + port);
});
