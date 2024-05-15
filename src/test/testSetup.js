// testSetup.js
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

let mongoServer

async function setupDb() {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
  return mongoose.connection.db
}

async function tearDownDb() {
  await mongoose.disconnect()
  await mongoServer.stop()
}

beforeAll(async () => {
  await setupDb()
})

afterAll(async () => {
  await tearDownDb()
})

export const db = mongoose.connection.db // Depending on how you need to use it
