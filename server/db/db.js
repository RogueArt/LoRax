const mongoose = require('mongoose')

// Validate our dotenv for the mongo uri
const { MONGO_URI } = process.env
if (MONGO_URI === undefined) throw Error('You specify a MONGO_URI in your .env file!')

// Connect to Atlas
mongoose.connect(MONGO_URI)