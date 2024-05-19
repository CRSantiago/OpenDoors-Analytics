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
      responseCount: Number,
      offerCount: Number,
      interviewCount: Number,
      responseRate: Number,
      interviewRate: Number,
      offerRate: Number,
      applicationStatusBreakdown: {
        type: Map,
        of: Number,
        default: 0,
        min: 0,
      },
    },
  },
  { timestamps: true },
  { collection: 'Analytics' }
)

const Analytics = mongoose.model('Analytics', analyticsSchema)

export default Analytics
