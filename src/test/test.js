// test.js
import Analytics from "../models/userAnalytics.js"
import mongoose from "mongoose"
import {
  handleCreate,
  handleDelete,
  handleUpdate,
} from "../services/analyticsServices"

describe("Analytics service integration test", () => {
  const userId = new mongoose.Types.ObjectId().toString() // convert ObjectId to string if your schema expects a string

  it("should increment the counts in the database", async () => {
    await handleCreate({
      userId: userId,
      details: { status: "pending" },
    })

    const result = await Analytics.findOne({ userId: userId }).exec()
    expect(result.metrics.totalApplications).toBe(1)
    expect(result.metrics.applicationStatusBreakdown.get("pending")).toBe(1)
  })

  it("should adjust counts of application status according to changes", async () => {
    await handleUpdate({
      userId: userId,
      details: { previousStatus: "pending", newStatus: "rejected" },
    })

    const result = await Analytics.findOne({ userId: userId }).exec()
    expect(result.metrics.totalApplications).toBe(1)
    expect(result.metrics.applicationStatusBreakdown.get("pending")).toBe(0)
    expect(result.metrics.applicationStatusBreakdown.get("rejected")).toBe(1)
  })

  it("should adjust counts of application status according to deletion", async () => {
    await handleDelete({
      userId: userId,
      details: { status: "rejected" },
    })

    const result = await Analytics.findOne({ userId: userId }).exec()
    expect(result.metrics.totalApplications).toBe(0)
    expect(result.metrics.applicationStatusBreakdown.get("rejected")).toBe(0)
  })
})
