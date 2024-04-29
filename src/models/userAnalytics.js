import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  metrics: {
    totalApplications: Number,
    responseRate: Number,
    interviewRate: Number,
    offerRate: Number,
  },
})

const Analytics = mongoose.model("Analytics", analyticsSchema)

export default Analytics
