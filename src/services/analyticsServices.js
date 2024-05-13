import Analytics from "../models/userAnalytics.js"

export async function handleCreate(data) {
  await Analytics.updateOne(
    { userId: data.userId },
    {
      $inc: {
        "metrics.totalApplications": 1,
        [`metrics.applicationStatusBreakdown.${data.details.status}`]: 1,
      },
    },
    { upsert: true }
  )
}

export async function handleUpdate(data) {
  if (
    data.details.previousStatus &&
    data.details.newStatus &&
    data.details.previousStatus !== data.details.newStatus
  ) {
    await Analytics.updateOne(
      { userId: data.userId },
      {
        $inc: {
          [`metrics.applicationStatusBreakdown.${data.details.previousStatus}`]:
            -1,
          [`metrics.applicationStatusBreakdown.${data.details.newStatus}`]: 1,
        },
      },
      { upsert: true }
    )
  }
}

export async function handleDelete(data) {
  await Analytics.updateOne({ userId: data.userId }, [
    {
      $set: {
        "metrics.totalApplications": {
          $cond: {
            if: { $gt: ["$metrics.totalApplications", 0] },
            then: { $subtract: ["$metrics.totalApplications", 1] },
            else: 0, // Prevent it from going negative
          },
        },
        [`metrics.applicationStatusBreakdown.${data.details.status}`]: {
          $cond: {
            if: {
              $gt: [
                `$metrics.applicationStatusBreakdown.${data.details.status}`,
                0,
              ],
            },
            then: {
              $subtract: [
                `$metrics.applicationStatusBreakdown.${data.details.status}`,
                1,
              ],
            },
            else: 0, // Prevent it from going negative
          },
        },
      },
    },
  ])
}
