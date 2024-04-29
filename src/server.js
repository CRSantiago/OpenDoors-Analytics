import mongoose from "mongoose"
import dotenv from "dotenv"
import app from "./app.js"

dotenv.config()

const mongoURI = process.env.MONGO_URI

const PORT = process.env.PORT || 3000

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error.message))
