import React, { useState, useEffect } from 'react';
import CreatePostBox from './wall/CreatePostBox';
import PostCard from './wall/PostCard';
import { getPosts, type Post } from '../services/postService';

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error cargando posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="wall-container">
      <CreatePostBox onPostCreated={loadPosts} />
      <div className="post-feed">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--meta-text)' }}>
            Cargando publicaciones…
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
