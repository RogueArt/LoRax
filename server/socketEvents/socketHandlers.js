const db = require('./db/db.js')
const DataModel = require('./db/DataModel.js')

/**
 * {
 *  esp: [Socket],
 *  client: [Socket]
 * }
 */
const socketConnections = {
  esp: [],
  client: [],
}

/* <id: String, { socket: Socket, name: String }> */
const idToSocketConnection = new Map()

// Functions to handle messages from the socket
const socketHandlers = {
  registerConnection: async function ({ from, id }, socket) {
    socketConnections[from].push(socket)
    idToSocketConnection.set(id, { socket, name: id })
  },
  processSensors: async function ({ node_name, sensor, value }) {
    // Debugging code:
    console.log('Got here!')
    socketConnections['client'].forEach(s => {
      s.send(JSON.stringify(msg))
    })

    // Processing:
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
  },
  handleConnectionClose: async function() {
    console.log('Closing socket!')
    // socketConnections = socketConnections.filter((s) => s !== socket);
    console.log(
      'There are ' + socketConnections.length + ' connections left.'
    )
  }
}

module.exports = socketHandlers
