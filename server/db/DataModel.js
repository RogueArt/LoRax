const mongoose = require('mongoose')

const DataSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  sensor: {
    type: String,
    enum: ['soil', 'temp', 'humid', 'uv'],
    required: true,
  },
  values: {
    type: [Number],
    required: true,
  }
})

const DataModel = mongoose.model('Data', DataSchema)
module.exports = DataModel