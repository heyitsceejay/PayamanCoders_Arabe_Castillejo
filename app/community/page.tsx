'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Users, MessageSquare, Heart, TrendingUp, Send, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  trending?: boolean;
  isLiked?: boolean;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [isEntering, setIsEntering] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<{ [key: string]: any[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchTopContributors();
  }, [activeTab, selectedCategory, searchQuery]);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts();
      fetchTopContributors();
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab, selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeTab === 'trending') {
        params.append('trending', 'true');
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/community/posts?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopContributors = async () => {
    try {
      const response = await fetch('/api/community/stats');
      
      if (response.ok) {
        const data = await response.json();
        setTopContributors(data.topContributors || []);
      }
    } catch (error) {
      console.error('Error fetching top contributors:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', content: '', category: 'General' });
        setShowCreateModal(false);
        fetchTopContributors(); // Refresh top contributors
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: data.likes, isLiked: data.liked }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchComments = async (postId: string, forceRefresh = false) => {
    if (postComments[postId] && !forceRefresh) {
      // Already loaded and not forcing refresh
      return;
    }

    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const response = await fetch(`/api/community/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setPostComments(prev => ({ ...prev, [postId]: data.comments }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId: string) => {
    if (commentingPostId === postId) {
      setCommentingPostId(null);
    } else {
      setCommentingPostId(postId);
      fetchComments(postId);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, comments: data.comments }
            : post
        ));
        setCommentText('');
        
        // Force refresh comments to show the new one
        await fetchComments(postId, true);
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const categories = ['all', 'Career Advice', 'Career Growth', 'Learning', 'Work Life', 'Networking', 'General'];

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-green-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-green-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-10 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 text-white shadow-xl shadow-green-500/40 group/icon flex-shrink-0">
                <Users className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/50 to-emerald-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-[floatUp_0.85s_ease-out] mb-2">
                  Community
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Connect, share, and learn from professionals in your field
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create Post Card */}
            <div className="card relative overflow-hidden group/create hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/create:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-lg font-bold shadow-lg shadow-primary-500/40 group/avatar hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Share your thoughts with the community..."
                    onClick={() => setShowCreateModal(true)}
                    readOnly
                    className="flex-1 px-6 py-4 text-lg rounded-2xl border-2 border-primary-500/30 bg-white/70 hover:border-primary-400 hover:bg-white/90 hover:scale-[1.02] cursor-pointer transition-all shadow-lg backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="relative flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-2xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden whitespace-nowrap group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    <Plus className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                    <span className="relative z-10 hidden sm:inline">Post</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          placeholder="Enter post title..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        >
                          {categories.filter(c => c !== 'all').map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          placeholder="Share your thoughts, experiences, or questions..."
                          rows={6}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                        />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setShowCreateModal(false)}
                          className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePost}
                          disabled={submitting}
                          className="btn-primary flex items-center gap-2"
                        >
                          {submitting ? 'Posting...' : 'Publish Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="card relative overflow-hidden group/filter hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Tabs */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-6 py-3 rounded-xl text-base font-bold transition-all ${
                        activeTab === 'all'
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/40'
                          : 'bg-white/60 border-2 border-primary-500/30 text-gray-700 hover:bg-white/90 hover:border-primary-400 hover:scale-105'
                      }`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => setActiveTab('trending')}
                      className={`px-6 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'trending'
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/40'
                          : 'bg-white/60 border-2 border-primary-500/30 text-gray-700 hover:bg-white/90 hover:border-primary-400 hover:scale-105'
                      }`}
                    >
                      <TrendingUp className="w-5 h-5" />
                      Trending
                    </button>
                  </div>

                  {/* Search */}
                  <div className="flex-1 relative group/search">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 group-hover/search:scale-110 transition-transform duration-300" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-base hover:border-primary-400 hover:bg-white/90 hover:scale-[1.02] shadow-lg backdrop-blur-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="futuristic-loader mx-auto mb-4" style={{ width: '40px', height: '40px' }}>
                    <div className="futuristic-loader-inner"></div>
                  </div>
                  <p className="auth-subtitle">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="card text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-secondary-600 mb-6">Be the first to share something with the community!</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Post
                  </button>
                </div>
              ) : (
                posts.map((post, index) => (
                <div
                  key={post.id}
                  className="card group relative hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden"
                  style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative p-8">
                    {/* Author Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-base font-bold shadow-lg shadow-primary-500/40 group/author hover:scale-110 transition-transform duration-300">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-lg opacity-0 group-hover/author:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-gray-900">{post.author.name}</p>
                        <p className="text-base text-secondary-600 font-medium">{post.author.role} • {post.timestamp}</p>
                      </div>
                      {post.trending && (
                        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/40">
                          <TrendingUp className="w-4 h-4" />
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Post Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-lg text-secondary-700 mb-6 leading-relaxed">{post.content}</p>

                    {/* Category */}
                    <span className="inline-flex items-center px-5 py-2.5 rounded-full text-base font-bold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-700 border border-primary-500/40 mb-6 shadow-md">
                      {post.category}
                    </span>

                    {/* Actions */}
                    <div className="pt-6 border-t border-white/40">
                      <div className="flex items-center gap-8 mb-4">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-3 transition-all group/like ${
                            post.isLiked 
                              ? 'text-red-500' 
                              : 'text-secondary-600 hover:text-red-500'
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 group-hover/like:shadow-lg group-hover/like:shadow-red-500/30 transition-all duration-300">
                            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''} group-hover/like:scale-110 transition-transform duration-300`} />
                          </div>
                          <span className="text-base font-bold">{post.likes}</span>
                        </button>
                        <button 
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-3 text-secondary-600 hover:text-primary-500 transition-all group/comment"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 group-hover/comment:shadow-lg group-hover/comment:shadow-blue-500/30 transition-all duration-300">
                            <MessageSquare className="w-5 h-5 group-hover/comment:scale-110 transition-transform duration-300" />
                          </div>
                          <span className="text-base font-bold">{post.comments}</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {commentingPostId === post.id && (
                        <div className="space-y-4">
                          {/* Existing Comments */}
                          {loadingComments[post.id] ? (
                            <div className="text-center py-4">
                              <div className="futuristic-loader mx-auto" style={{ width: '30px', height: '30px' }}>
                                <div className="futuristic-loader-inner"></div>
                              </div>
                            </div>
                          ) : postComments[post.id] && postComments[post.id].length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {postComments[post.id].map((comment: any) => (
                                <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-semibold flex-shrink-0">
                                    {comment.author.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-semibold text-gray-900">{comment.author.name}</p>
                                      <span className="text-xs text-secondary-500">•</span>
                                      <p className="text-xs text-secondary-500">{comment.author.role}</p>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                    <p className="text-xs text-secondary-500 mt-1">
                                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-secondary-500 text-center py-4">No comments yet. Be the first to comment!</p>
                          )}

                          {/* Comment Input */}
                          <div className="flex gap-3 pt-3 border-t border-gray-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xs font-semibold flex-shrink-0">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleComment(post.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleComment(post.id)}
                                className="btn-primary px-4 py-2 text-sm"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <div className="card relative overflow-hidden group/categories hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/categories:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                    <Filter className="w-5 h-5 text-primary-600" />
                  </div>
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-5 py-3 rounded-xl text-base font-bold transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/40'
                          : 'bg-white/60 border-2 border-primary-500/30 text-gray-700 hover:bg-white/90 hover:border-primary-400 hover:scale-105'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="card relative overflow-hidden group/contributors hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/contributors:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Contributors</h3>
                <div className="space-y-5">
                  {topContributors.length > 0 ? (
                    topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center gap-4 group/item hover:scale-105 transition-transform duration-300">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-base font-bold shadow-lg shadow-green-500/40 group-hover/item:scale-110 transition-transform duration-300">
                          {contributor.name.split(' ').map((n: string) => n[0]).join('')}
                          <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-base">{contributor.name}</p>
                          <p className="text-sm text-secondary-600 font-medium">{contributor.posts} posts • {contributor.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-base text-secondary-600 text-center py-4 font-medium">
                      No contributors yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
