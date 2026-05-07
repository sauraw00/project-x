import * as cheerio from "cheerio";
import { Story } from "../models/Story.js";

const parseNumber = (value = "") => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const resolveStoryUrl = (href, baseUrl) => {
  if (!href) {
    return baseUrl;
  }

  return new URL(href, baseUrl).toString();
};

const parsePostedAt = (ageElement) => {
  const title = ageElement.attr("title");
  if (title) {
    return title.split(" ")[0];
  }

  return ageElement.text().trim();
};

export const scrapeHackerNews = async () => {
  const baseUrl = process.env.HN_URL || "https://news.ycombinator.com";
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error(`Hacker News responded with ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const rows = $(".athing").slice(0, 10);
  const scrapedStories = [];

  rows.each((_index, row) => {
    const storyRow = $(row);
    const subtext = storyRow.next();
    const titleLink = storyRow.find(".titleline > a").first();
    const hnId = storyRow.attr("id");
    const title = titleLink.text().trim();

    if (!hnId || !title) {
      return;
    }

    scrapedStories.push({
      hnId,
      title,
      url: resolveStoryUrl(titleLink.attr("href"), baseUrl),
      points: parseNumber(subtext.find(".score").text()),
      author: subtext.find(".hnuser").text().trim() || "unknown",
      postedAt: parsePostedAt(subtext.find(".age").first())
    });
  });

  const savedStories = await Promise.all(
    scrapedStories.map((story) =>
      Story.findOneAndUpdate({ hnId: story.hnId }, story, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      })
    )
  );

  return savedStories;
};
