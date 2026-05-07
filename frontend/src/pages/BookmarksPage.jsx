import StoryCard from "../components/StoryCard.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const BookmarksPage = () => {
  const { updateBookmarks, user } = useAuth();
  const bookmarks = (user?.bookmarks || []).filter((bookmark) => typeof bookmark !== "string");

  const handleToggleBookmark = async (storyId) => {
    const { data } = await api.post(`/stories/${storyId}/bookmark`);
    updateBookmarks(data.bookmarks);
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Protected</p>
          <h1>Your bookmarks</h1>
        </div>
      </section>

      {bookmarks.length ? (
        <div className="story-list">
          {bookmarks.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              isAuthenticated
              isBookmarked
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">Your saved stories will appear here.</div>
      )}
    </main>
  );
};

export default BookmarksPage;
