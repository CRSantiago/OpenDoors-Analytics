import { MongoMemoryServer } from "mongodb-memory-server"
import { MongoClient } from "mongodb"

let mongoServer
let db

beforeAll(async () => {
  // Create and start the instance
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  const client = await MongoClient.connect(mongoUri)
  db = client.db(mongoServer.instanceInfo.dbName) // Use the database for testing
})

afterAll(async () => {
  if (db) {
    await db.client.close() // Make sure to close the connection properly
  }
  if (mongoServer) {
    await mongoServer.stop() // Stop the MongoMemoryServer
  }
})
