import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import StoryCard from "../components/StoryCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const getBookmarkIds = (bookmarks = []) => {
  return bookmarks.map((bookmark) => (typeof bookmark === "string" ? bookmark : bookmark._id));
};

const StoriesPage = () => {
  const { isAuthenticated, updateBookmarks, user } = useAuth();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState("");

  const bookmarkedIds = useMemo(() => getBookmarkIds(user?.bookmarks), [user]);

  const fetchStories = async (page = 1) => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.get(`/stories?page=${page}&limit=10`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load stories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleScrape = async () => {
    setIsScraping(true);
    setError("");

    try {
      await api.post("/stories/scrape");
      await fetchStories(1);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to scrape Hacker News");
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggleBookmark = async (storyId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const { data } = await api.post(`/stories/${storyId}/bookmark`);
      updateBookmarks(data.bookmarks);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update bookmark");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Top 10 from Hacker News</p>
          <h1>Stories ranked by points</h1>
        </div>
        <button className="icon-text-button solid" type="button" onClick={handleScrape}>
          <RefreshCw aria-hidden="true" size={18} className={isScraping ? "spin" : ""} />
          {isScraping ? "Scraping" : "Scrape"}
        </button>
      </section>

      {!isAuthenticated ? (
        <p className="notice">
          <Link to="/login">Login</Link> to save bookmarks across sessions.
        </p>
      ) : null}

      {error ? <p className="error-message">{error}</p> : null}

      {isLoading ? (
        <div className="empty-state">Loading stories...</div>
      ) : stories.length ? (
        <>
          <div className="story-list">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                isAuthenticated={isAuthenticated}
                isBookmarked={bookmarkedIds.includes(story._id)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              onClick={() => fetchStories(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages || 1}
            </span>
            <button
              type="button"
              onClick={() => fetchStories(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">No stories yet. Run the scraper to fetch Hacker News.</div>
      )}
    </main>
  );
};

export default StoriesPage;
