import mongoose from "mongoose";
import { Story } from "../models/Story.js";
import { scrapeHackerNews } from "../services/scraperService.js";

const parsePagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid story id");
    error.statusCode = 400;
    throw error;
  }
};

export const getStories = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1, createdAt: -1 }).skip(skip).limit(limit),
      Story.countDocuments()
    ]);

    res.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryById = async (req, res, next) => {
  try {
    ensureObjectId(req.params.id);
    const story = await Story.findById(req.params.id);

    if (!story) {
      const error = new Error("Story not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ story });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    ensureObjectId(req.params.id);
    const story = await Story.findById(req.params.id);

    if (!story) {
      const error = new Error("Story not found");
      error.statusCode = 404;
      throw error;
    }

    const storyId = story._id.toString();
    const existingBookmark = req.user.bookmarks.some(
      (bookmark) => bookmark._id.toString() === storyId
    );

    if (existingBookmark) {
      req.user.bookmarks = req.user.bookmarks.filter(
        (bookmark) => bookmark._id.toString() !== storyId
      );
    } else {
      req.user.bookmarks.push(story._id);
    }

    await req.user.save();
    await req.user.populate("bookmarks");

    res.json({
      bookmarked: !existingBookmark,
      bookmarks: req.user.bookmarks
    });
  } catch (error) {
    next(error);
  }
};

export const scrapeStories = async (_req, res, next) => {
  try {
    const stories = await scrapeHackerNews();
    res.json({ message: "Scrape completed", count: stories.length, stories });
  } catch (error) {
    next(error);
  }
};
