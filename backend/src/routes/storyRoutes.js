import { Router } from "express";
import {
  getStories,
  getStoryById,
  scrapeStories,
  toggleBookmark
} from "../controllers/storyController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/scrape", scrapeStories);
router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", requireAuth, toggleBookmark);

export default router;
