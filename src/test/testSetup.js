// testSetup.js
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

let mongoServer

/**
 * Connect to the in-memory database.
 * ensures tests do not have side effects
 * enhances portability, performance
 */
async function setupDb() {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
  return mongoose.connection.db
}

/**
 * Drop database, close the connection and stop mongodb.
 */

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
