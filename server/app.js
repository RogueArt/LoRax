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
const DataModel = require('./db/models/Data')

// Import routers
const socketRoutes = require("./routes/socketRoutes");
const apiRoutes = require("./routes/api");

app.use("/", socketRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send({ message: "Express server running!" });
});

let socketConnections = {
  "esp": [],
  "client": []
};

let idToConnection = new Map();

  // socket.on("message", async (rawData) => {
  //   socketConnections.forEach((s) => s.send(rawData));

  //   // Parse the data we received
  //   const data = JSON.parse(rawData.toString())
  //   console.log('Debug socket data: ', data)

  //   // Deal with received ESP data here
  //   await handleESPReceiveData(data)
socketServer.on("connection", (socket) => {
  socket.on("message", (msg) => {
    msg = JSON.parse(msg.toString());
    console.log(msg);
    switch (msg.type) {
      case 0:
        console.log(msg.from);
        socketConnections[msg.from].push(socket);
        idToConnection.set(msg.id, socket);
        break;
      case 1:
        console.log("Got here!");
        socketConnections["client"].forEach((s) => {
          s.send(JSON.stringify(msg));
        });
        break;
    }
    // socketConnections.forEach((s) => s.send(JSON.stringify(msg.data)));
  });
  socket.on("close", () => {
    console.log("Closing socket!");
    // socketConnections = socketConnections.filter((s) => s !== socket);
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

async function handleESPReceiveData(data) {
  // Server is receiving data
  const { type } = data
  if (type === undefined) throw Error('No type was supplied for the given data.')
  
  if (type === 1) {
    const { node_name = 'test', sensor, value } = data

    // Check if the sensor exists for the node
    if (await DataModel.exists({ node_name, sensor })) {
      // If it does, then find and update it
      return DataModel.findOneAndUpdate(
        { node_name, sensor },
        { $push: { values: value } }
      )
    }

    // Otherwise, create a new document insert it
    const newData = new DataModel({ node_name, sensor, values: [value] })
    return await newData.save().catch(console.error)
  }

  // Ignore if connection is being initialized
}