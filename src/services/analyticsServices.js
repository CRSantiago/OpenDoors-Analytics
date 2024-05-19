import Analytics from '../models/userAnalytics.js'

export async function handleCreate(data) {
  const incrementObject = {
    'metrics.totalApplications': 1,
    [`metrics.applicationStatusBreakdown.${data.details.status}`]: 1,
  }

  if (data.details.responseReceived) {
    incrementObject['metrics.responseCount'] = 1
  }

  await Analytics.updateOne(
    { userId: data.userId },
    { $inc: incrementObject },
    { upsert: true }
  )
}

export async function handleUpdate(data) {
  const { previousStatus, newStatus } = data.details
  const updates = {
    $inc: {
      [`metrics.applicationStatusBreakdown.${previousStatus}`]: -1,
      [`metrics.applicationStatusBreakdown.${newStatus}`]: 1,
    },
  }

  // Example: increment responseReceived if the new status implies a response
  // and the previous status was "Applied"
  if (newStatus !== 'Applied' && previousStatus === 'Applied') {
    updates.$inc['metrics.responseCount'] = 1
  }

  // Check if transitioning to 'Interviewed' for the first time
  if (newStatus === 'Interviewing') {
    updates.$inc['metrics.interviewCount'] = 1
  }

  // Check if transitioning to 'Offered' for the first time
  if (newStatus === 'Offer') {
    updates.$inc['metrics.offerCount'] = 1
  }

  await Analytics.updateOne({ userId: data.userId }, updates, { upsert: true })
}

export async function handleDelete(data) {
  await Analytics.updateOne({ userId: data.userId }, [
    {
      $set: {
        'metrics.totalApplications': {
          $cond: {
            if: { $gt: ['$metrics.totalApplications', 0] },
            then: { $subtract: ['$metrics.totalApplications', 1] },
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
        // Example: decrement responseCount if the deleted status implies a response
        'metrics.responseCount': {
          $cond: {
            if: {
              $and: [
                { $gt: ['$metrics.responseCount', 0] },
                { $ne: [data.details.status, 'Applied'] }, // Decrease if status was not 'Applied'
              ],
            },
            then: { $subtract: ['$metrics.responseCount', 1] },
            else: 0,
          },
        },
      },
    },
  ])
}
