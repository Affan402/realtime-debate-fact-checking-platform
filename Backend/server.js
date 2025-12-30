import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import DBconfig from "./config/Dbconfig.js";
import { socketConfig } from "./config/socket.js";

import DebateRoutes from "./routes/debate.routes.js";
import ArgumentRoutes from "./routes/argument.routes.js";
import FactCheckRoutes from "./routes/factcheck.routes.js";
import AnalyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

(async () => {
  try {
    await DBconfig();

    app.use("/api/debates", DebateRoutes);
    app.use("/api/arguments", ArgumentRoutes);
    app.use("/api/factcheck", FactCheckRoutes);
    app.use("/api/analytics", AnalyticsRoutes);

    const server = http.createServer(app);
    socketConfig(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
