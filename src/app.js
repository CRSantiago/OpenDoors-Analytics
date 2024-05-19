import express from 'express'
import cors from 'cors'
import Analytics from './models/userAnalytics.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/analytics/rates/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const analytics = await Analytics.findOne({ userId })
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics data not found' })
    }

    console.log(analytics)

    // Get total applications, responseReceived, interviews, and offers
    const totalApplications = analytics.metrics.totalApplications || 0
    const responseCount = analytics.metrics.responseCount || 0
    const interviews = analytics.metrics.interviewCount || 0
    const offers = analytics.metrics.offerCount || 0

    // Calculate rates
    const responseRate =
      totalApplications > 0 ? (responseCount / totalApplications) * 100 : 0
    const interviewRate =
      totalApplications > 0 ? (interviews / totalApplications) * 100 : 0
    const offerRate =
      totalApplications > 0 ? (offers / totalApplications) * 100 : 0

    res.json({
      responseRate,
      interviewRate,
      offerRate,
    })
  } catch (error) {
    console.error('Failed to calculate rates:', error)
    res.status(500).json({ message: 'Error calculating analytics rates' })
  }
})

// Placeholder route
app.get('/', (req, res) => {
  res.send('Analytics Service is running')
})

export default app
