// test.js
import Analytics from '../models/userAnalytics.js'
import mongoose from 'mongoose'
import {
  handleCreate,
  handleDelete,
  handleUpdate,
} from '../services/analyticsServices'

describe('Analytics service integration test', () => {
  const userId = new mongoose.Types.ObjectId().toString() // convert ObjectId to string

  it('should increment the counts in the database of total applications and responseReceived', async () => {
    await handleCreate({
      userId: userId,
      details: { status: 'pending', responseReceived: true },
    })

    const result = await Analytics.findOne({ userId: userId }).exec()
    expect(result.metrics.totalApplications).toBe(1)
    expect(result.metrics.responseReceived).toBe(1)
    expect(result.metrics.applicationStatusBreakdown.get('pending')).toBe(1) // get the value of the key "pending"
  })

  it("should adjust counts of application status and increment responseReceived on status change from 'Applied'", async () => {
    await handleCreate({
      userId: userId,
      details: { status: 'Applied' },
    })
    await handleUpdate({
      userId: userId,
      details: { previousStatus: 'Applied', newStatus: 'Interviewing' },
    })

    const result = await Analytics.findOne({ userId: userId }).exec()
    expect(result.metrics.totalApplications).toBe(2)
    expect(result.metrics.responseReceived).toBe(2) // responseReceived should be incremented based on status change
    expect(result.metrics.applicationStatusBreakdown.get('Applied')).toBe(0)
    expect(result.metrics.applicationStatusBreakdown.get('Interviewing')).toBe(
      1
    )
  })

  it('should decrement counts correctly on deletion', async () => {
    await handleDelete({
      userId: userId,
      details: { status: 'Interviewing' },
    })

    const result = await Analytics.findOne({ userId: userId }).exec()
    expect(result.metrics.totalApplications).toBe(1)
    expect(result.metrics.applicationStatusBreakdown.get('Interviewing')).toBe(
      0
    )
  })
})
