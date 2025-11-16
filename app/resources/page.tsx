'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Video, FileText, Wrench, Award, Plus, Filter, TrendingUp, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  url?: string;
  author: {
    name: string;
  };
  upvotes: number;
  views: number;
  createdAt: string;
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchResources();
  }, [filter, category]);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchResources, 30000);
    return () => clearInterval(interval);
  }, [filter, category]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`/api/resources?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'template': return FileText;
      case 'tool': return Wrench;
      case 'guide': return BookOpen;
      case 'course': return Award;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      video: 'bg-red-100 text-red-700',
      article: 'bg-blue-100 text-blue-700',
      template: 'bg-green-100 text-green-700',
      tool: 'bg-purple-100 text-purple-700',
      guide: 'bg-orange-100 text-orange-700',
      course: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/30 bg-white/60 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="relative overflow-hidden group/header">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative flex items-center gap-4">
                  <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 text-white shadow-xl shadow-blue-500/40 group/icon flex-shrink-0">
                    <BookOpen className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      📚 Resource Library
                    </h1>
                    <p className="text-lg md:text-xl text-secondary-600">
                      Curated career resources from mentors and experts
                    </p>
                  </div>
                </div>
              </div>
              {user && ['mentor', 'admin'].includes(user.role) && (
                <Link
                  href="/resources/create"
                  className="relative flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-2xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden whitespace-nowrap group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <Plus className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                  <span className="relative z-10">Add Resource</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="card relative overflow-hidden group/filter hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                    <Filter className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="text-base font-bold text-gray-700">Type:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-xl border-2 border-primary-500/30 bg-white/70 px-5 py-3 text-base font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="article">Articles</option>
                    <option value="video">Videos</option>
                    <option value="guide">Guides</option>
                    <option value="template">Templates</option>
                    <option value="tool">Tools</option>
                    <option value="course">Courses</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-gray-700">Category:</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border-2 border-primary-500/30 bg-white/70 px-5 py-3 text-base font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="Resume Writing">Resume Writing</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Career Development">Career Development</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Networking">Networking</option>
                    <option value="Job Search">Job Search</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/40 bg-white/60 p-8"
                >
                  <div className="mb-4 h-6 w-3/4 rounded bg-white/70"></div>
                  <div className="mb-2 h-4 w-full rounded bg-white/70"></div>
                  <div className="mb-4 h-4 w-2/3 rounded bg-white/70"></div>
                  <div className="h-10 w-full rounded bg-white/70"></div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
              <div className="relative py-20 text-center">
                <div className="feature-icon mx-auto mb-6 w-20 h-20">
                  <BookOpen className="w-12 h-12 text-primary-500" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  No resources found
                </h3>
                <p className="text-lg text-secondary-600">
                  Check back later for new resources
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => {
                const Icon = getTypeIcon(resource.type);
                return (
                  <div
                    key={resource._id}
                    className="card group relative hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative p-8">
                      {/* Type Badge */}
                      <div className="mb-4 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-md ${getTypeColor(
                            resource.type
                          )}`}
                        >
                          <Icon className="h-4 w-4" />
                          {resource.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {resource.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-6 line-clamp-3 text-base text-secondary-600 leading-relaxed">
                        {resource.description}
                      </p>

                      {/* Author */}
                      <p className="mb-4 text-sm font-semibold text-secondary-500">
                        By {resource.author.name}
                      </p>

                      {/* Stats */}
                      <div className="mb-6 flex items-center gap-6 text-sm font-semibold text-secondary-600">
                        <span className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          {resource.upvotes} upvotes
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          {resource.views} views
                        </span>
                      </div>

                      {/* Action Button */}
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative flex w-full items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-2xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                          <span className="relative z-10">View Resource</span>
                          <ExternalLink className="w-5 h-5 relative z-10 group-hover/btn:scale-125 group-hover/btn:translate-x-1 transition-all duration-300" />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
