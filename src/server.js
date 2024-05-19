import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app.js'
import startConsumer from './messaging/consumer.js'

dotenv.config()

const mongoURI = process.env.MONGO_URI

const PORT = process.env.PORT || 4000

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected')
    startConsumer()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error.message))
