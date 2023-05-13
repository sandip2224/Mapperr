const express = require('express')
require('dotenv').config({ path: './.env' })

const connectDB = require('./helpers/db')

const app = express()

// MongoDB Connection Init
connectDB(process.env.MONGO_URI)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Mounting routes
app.use('/api/pins', require('./routes/pinRoute'))
app.use('/api/users', require('./routes/userRoute'))

app.get('/', (req, res) => res.json({ message: 'Travel Mapper API is up and running!' }))

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`🚀 Server running on port ${PORT}!`))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Server Error: ${err.message}`)

  server.close(() => process.exit(1))
})