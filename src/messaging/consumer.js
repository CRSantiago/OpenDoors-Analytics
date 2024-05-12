// src/messaging/consumer.js
import amqp from "amqplib"

async function startConsumer() {
  const conn = await amqp.connect("amqp://localhost") // Change to match your RabbitMQ server
  const channel = await conn.createChannel()
  const queue = "jobApplicationOperations"

  await channel.assertQueue(queue, { durable: true })

  console.log(" [*] Waiting for messages in %s.", queue)
  channel.consume(queue, function (msg) {
    const data = JSON.parse(msg.content.toString())
    console.log(" [x] Received %s", JSON.stringify(data))

    // Process the data depending on the action
    switch (data.action) {
      case "create":
        // Increment some counter, update analytics dashboard, etc.
        break
      case "update":
        // Update analytics based on new data
        break
      case "delete":
        // Adjust analytics to reflect the deletion
        break
    }

    channel.ack(msg)
  })
}

export default startConsumer
