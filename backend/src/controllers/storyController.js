import mongoose from "mongoose";
import { Story } from "../models/Story.js";
import { User } from "../models/User.js";
import { scrapeHackerNews } from "../services/scraperService.js";

const getPagination = ({ page = 1, limit = 10 }) => {
  const currentPage = Math.max(parseInt(page), 1);
  const perPage = Math.min(Math.max(parseInt(limit), 1), 50);

  return {
    currentPage,
    perPage,
    offset: (currentPage - 1) * perPage
  };
};

const validateStoryId = (storyId) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    const err = new Error("Story ID is not valid");
    err.statusCode = 400;
    throw err;
  }
};

export const getStories = async (req, res, next) => {
  try {
    const { currentPage, perPage, offset } = getPagination(req.query);

    const storiesPromise = Story.find({})
      .sort({ points: -1, createdAt: -1 })
      .skip(offset)
      .limit(perPage);

    const totalPromise = Story.countDocuments();

    const [stories, totalStories] = await Promise.all([
      storiesPromise,
      totalPromise
    ]);

    return res.status(200).json({
      success: true,
      data: stories,
      pagination: {
        currentPage,
        perPage,
        totalStories,
        totalPages: Math.ceil(totalStories / perPage)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getStoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateStoryId(id);

    const story = await Story.findOne({ _id: id });

    if (!story) {
      const err = new Error("No story found");
      err.statusCode = 404;
      throw err;
    }

    return res.status(200).json({
      success: true,
      story
    });
  } catch (err) {
    next(err);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateStoryId(id);

    const story = await Story.findById(id);

    if (!story) {
      const err = new Error("Story does not exist");
      err.statusCode = 404;
      throw err;
    }

    const alreadyBookmarked = req.user.bookmarks.some(
      (item) => item.toString() === id
    );

    const updateQuery = alreadyBookmarked
      ? { $pull: { bookmarks: id } }
      : { $addToSet: { bookmarks: id } };

    await User.findByIdAndUpdate(req.user._id, updateQuery);

    const updatedUser = await User.findById(req.user._id).populate("bookmarks");

    return res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
      bookmarks: updatedUser.bookmarks
    });
  } catch (err) {
    next(err);
  }
};

export const scrapeStories = async (req, res, next) => {
  try {
    const scrapedStories = await scrapeHackerNews();

    return res.status(200).json({
      success: true,
      message: "Stories scraped successfully",
      total: scrapedStories.length,
      stories: scrapedStories
    });
  } catch (err) {
    next(err);
  }
};