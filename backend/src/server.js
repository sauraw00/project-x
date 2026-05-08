import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { scrapeHackerNews } from "./services/scraperService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing server or change PORT.`);
      process.exit(1);
    }

    throw error;
  });

  scrapeHackerNews().catch((error) => {
    console.error("Initial scrape failed:", error.message);
  });
};

startServer().catch((error) => {
  console.error("Unable to start server:", error);
  process.exit(1);
});
