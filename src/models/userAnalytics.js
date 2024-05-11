import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    metrics: {
      totalApplications: Number,
      responseRate: Number,
      interviewRate: Number,
      offerRate: Number,
      applicationStatusBreakdown: Map,
    },
  },
  { timestamps: true },
  { collection: 'Analytics' }
)

const Analytics = mongoose.model('Analytics', analyticsSchema)

export default Analytics
