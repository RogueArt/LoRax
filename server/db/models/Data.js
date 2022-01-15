const mongoose = require('mongoose')

const DataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  humidity: {
    type: [Number],
    required: true,
  },
  temperature: {
    type: [Number],
    required: true,
  },
  uvLight: {
    type: [String],
    enum: ['Poor', 'Normal', 'Excellent'],
    required: true,
  },
  moisture: {
    type: [Number],
    required: true,
  },
})

const DataModel = mongoose.model('Data', DataSchema)
module.exports = DataModel