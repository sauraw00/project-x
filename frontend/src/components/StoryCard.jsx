import { Bookmark, ExternalLink } from "lucide-react";

const StoryCard = ({ story, isBookmarked, onToggleBookmark, isAuthenticated }) => {
  return (
    <article className="story-card">
      <div className="story-main">
        <a className="story-title" href={story.url} target="_blank" rel="noreferrer">
          {story.title}
          <ExternalLink aria-hidden="true" size={16} />
        </a>
        <div className="story-meta">
          <span>{story.points} points</span>
          <span>{story.author}</span>
          <span>{story.postedAt || "recently"}</span>
        </div>
      </div>

      <button
        className={`bookmark-button ${isBookmarked ? "active" : ""}`}
        type="button"
        onClick={() => onToggleBookmark(story._id)}
        disabled={!isAuthenticated}
        title={isAuthenticated ? "Toggle bookmark" : "Login to bookmark"}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark aria-hidden="true" size={20} fill={isBookmarked ? "currentColor" : "none"} />
      </button>
    </article>
  );
};

export default StoryCard;
