// src/messaging/consumer.js
import amqp from "amqplib"
import { handleCreate, handleUpdate, handleDelete} from "../services/analyticsServices.js"

async function startConsumer() {
  const conn = await amqp.connect("amqp://localhost") // Change to match your RabbitMQ server
  const channel = await conn.createChannel()
  const queue = "jobApplicationOperations"

  await channel.assertQueue(queue, { durable: true })

  console.log(" [*] Waiting for messages in %s.", queue)
  channel.consume(queue, async function (msg) {
    const data = JSON.parse(msg.content.toString())
    console.log(" [x] Received %s", JSON.stringify(data))

    // Process the data depending on the action
    switch (data.action) {
      case "create":
        await handleCreate(data)

        break
      case "update":
        // Update analytics based on new data
        await handleUpdate(data)
        break
      case "delete":
        // Adjust analytics to reflect the deletion
        await handleDelete(data)
        break
    }

    channel.ack(msg)
  })
}

export default startConsumer
