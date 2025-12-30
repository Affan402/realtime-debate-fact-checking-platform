socket.on("new_argument", async payload => {
  const argument = await ArgumentService.create(payload);

  io.to(payload.debateId).emit("argument_added", argument);

  socket.emit("fact_check_pending", { argumentId: argument._id });

  await aiQueue.add("fact-check", { argument });
});
