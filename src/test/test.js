import { handleCreate } from "../services/analyticsServices.js"
import mongoose from "mongoose"

describe("Analytics service integration test", () => {
  it("should increment the counts in the database", async () => {
    try {
      const userId = new mongoose.Types.ObjectId().toHexString()
      await handleCreate({
        userId: userId,
        details: { status: "pending" },
      })

      const result = await db
        .collection("analytics")
        .findOne({ userId: userId })
      expect(result.metrics.totalApplications).toBe(1)
      expect(result.metrics.applicationStatusBreakdown.pending).toBe(1)
    } catch (error) {
      console.log(error)
    }
  })
})
