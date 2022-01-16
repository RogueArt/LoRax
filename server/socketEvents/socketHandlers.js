const db = require('../db/db.js')
const DataModel = require('../db/DataModel.js')

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
  processSensors: async function ({ id, sensor, value }) {
    // Debugging code:
    console.log('Got here!')
    socketConnections['client'].forEach(s => {
      s.send(JSON.stringify(msg))
    })

    // Processing:
    // Check if the sensor exists for the node
    if (await DataModel.exists({ id, sensor })) {
      // If it does, then find and update it
      return DataModel.findOneAndUpdate(
        { id, sensor },
        { $push: { values: value } }
      )
    }

    // Otherwise, create a new document and insert it
    const newData = new DataModel({ id, sensor, values: [value] })
    return await newData.save().catch(console.error)
  },
  renameNode: async function ({ id, name }) {
    // Check if the id exists in our connection
    if (!idToSocketConnection.has(id)) return console.error('ID does not exist in map!')

    // If it does, update the name
    const { socket } = idToSocketConnection.get(id)
    idToSocketConnection.set(id, { socket, name })
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
