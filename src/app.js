import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

// Placeholder route
app.get("/", (req, res) => {
  res.send("Analytics Service is running")
})

export default app
