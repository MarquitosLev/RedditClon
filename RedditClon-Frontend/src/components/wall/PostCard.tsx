import React, { useState } from 'react';
import { formatRelativeTime, type Post } from '../../services/postService';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [votes, setVotes] = useState(post.upvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (dir: 'up' | 'down') => {
    if (userVote === dir) {
      // Undo
      setVotes(dir === 'up' ? votes - 1 : votes + 1);
      setUserVote(null);
    } else {
      const delta = dir === 'up' ? 1 : -1;
      const undo = userVote ? (userVote === 'up' ? -1 : 1) : 0;
      setVotes(votes + delta + undo);
      setUserVote(dir);
    }
  };

  const formatVotes = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <article className="post-card">
      {/* Vote column */}
      <div className="post-vote-col">
        <button
          className={`vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
          onClick={() => handleVote('up')}
          aria-label="Upvote"
          type="button"
        >
          ▲
        </button>
        <span className={`vote-count ${userVote === 'up' ? 'up' : userVote === 'down' ? 'down' : ''}`}>
          {formatVotes(votes)}
        </span>
        <button
          className={`vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
          onClick={() => handleVote('down')}
          aria-label="Downvote"
          type="button"
        >
          ▼
        </button>
      </div>

      {/* Main content */}
      <div className="post-content">
        {/* Meta */}
        <div className="post-meta">
          <img
            src={post.authorAvatar}
            alt={post.authorUsername}
            className="post-author-avatar"
          />
          <span className="post-author">u/{post.authorUsername}</span>
          <span className="post-dot">·</span>
          <span className="post-time">{formatRelativeTime(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h2 className="post-title">{post.title}</h2>

        {/* Body text — rendered as HTML to show rich-text formatting */}
        {post.body && (
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        )}

        {/* Media */}
        {post.mediaUrl && post.mediaType === 'image' && (
          <div className="post-media-wrapper">
            <img
              src={post.mediaUrl}
              alt="Contenido adjunto"
              className="post-media-img"
            />
          </div>
        )}
        {post.mediaUrl && post.mediaType === 'video' && (
          <div className="post-media-wrapper">
            <video
              src={post.mediaUrl}
              controls
              className="post-media-video"
            />
          </div>
        )}
        {post.mediaUrl && post.mediaType === 'other' && (
          <div className="post-media-other">
            📎 Archivo adjunto
          </div>
        )}

        {/* Action bar */}
        <div className="post-action-bar">
          <button className="post-action-btn" type="button">
            💬 {post.commentCount.toLocaleString('es-AR')} comentarios
          </button>
          <button className="post-action-btn" type="button">
            🔗 Compartir
          </button>
          <button className="post-action-btn" type="button">
            ⭐ Guardar
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
