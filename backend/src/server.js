import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { scrapeHackerNews } from "./services/scraperService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  scrapeHackerNews().catch((error) => {
    console.error("Initial scrape failed:", error.message);
  });
};

startServer().catch((error) => {
  console.error("Unable to start server:", error);
  process.exit(1);
});
