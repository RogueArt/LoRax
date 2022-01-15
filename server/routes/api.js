const express = require('express')
const router = express.Router()

const API_BASE_PATH = '/api'

// Import models
const db = require('../db/db.js')
const DataModel = require('../db/models/Data')

// API routes
router.get('/', (req, res) => {
  res.send({ message: 'Welcome to our API!' })
})

router.get(`/insert`, async (req, res) => {
  // Test endpoint - insert a random datum
  const newData = new DataModel({
    name: 'ideahacks',
    humidity: [20, 21, 30],
    temperature: [10, 20, 30],
    uvLight: ['Normal', 'Poor', 'Poor'],
    moisture: [94,30,40]
  })

  await newData.save().catch(console.error)

  return res.json({ success: true, data: newData.toJSON() })
})

module.exports = router