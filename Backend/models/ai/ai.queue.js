import { Queue, Worker } from "bullmq";
import { processFactCheck } from "./ai.processor.js";
import io from "../../sockets/socket.js";

export const aiQueue = new Queue("ai-tasks");

new Worker("ai-tasks", async job => {
  const { argument } = job.data;

  const result = await processFactCheck(argument);

  io.to(argument.debateId).emit("fact_check_result", {
    argumentId: argument._id,
    ...result
  });
});
