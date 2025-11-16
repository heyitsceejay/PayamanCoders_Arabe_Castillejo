'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Video, Plus, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Webinar {
  _id: string;
  title: string;
  description: string;
  host: {
    name: string;
    role: string;
    avatar?: string;
  };
  scheduledDate: string;
  duration: number;
  meetLink?: string;
  maxAttendees?: number;
  category: string;
  tags: string[];
  status: string;
  attendees: any[];
}

export default function WebinarsPage() {
  const { user } = useAuth();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('scheduled');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchWebinars();
  }, [filter, category]);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`/api/webinars?${params}`);
      if (response.ok) {
        const data = await response.json();
        setWebinars(data.webinars || []);
      }
    } catch (error) {
      console.error('Error fetching webinars:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      career_development: 'bg-blue-100 text-blue-700',
      technical_skills: 'bg-purple-100 text-purple-700',
      interview_prep: 'bg-green-100 text-green-700',
      industry_insights: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[cat] || colors.other;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      career_development: 'Career Development',
      technical_skills: 'Technical Skills',
      interview_prep: 'Interview Prep',
      industry_insights: 'Industry Insights',
      other: 'Other',
    };
    return labels[cat] || cat;
  };

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
                  <Video className="h-7 w-7" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 animate-[floatUp_0.85s_ease-out]">
                  Career Webinars
                </h1>
              </div>
              <p className="text-secondary-600">
                Learn from industry experts and mentors
              </p>
            </div>
            {user && ['mentor', 'admin'].includes(user.role) && (
              <Link
                href="/webinars/create"
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Webinar
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 card">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="all">All</option>
                <option value="scheduled">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="completed">Past</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="all">All Categories</option>
                <option value="career_development">Career Development</option>
                <option value="technical_skills">Technical Skills</option>
                <option value="interview_prep">Interview Prep</option>
                <option value="industry_insights">Industry Insights</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Webinars List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="mb-4 h-6 w-3/4 rounded bg-white/70"></div>
                <div className="mb-2 h-4 w-full rounded bg-white/70"></div>
                <div className="mb-4 h-4 w-2/3 rounded bg-white/70"></div>
                <div className="h-10 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : webinars.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="feature-icon mx-auto mb-4 w-16 h-16">
              <Video className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No webinars found
            </h3>
            <p className="text-secondary-600">
              Check back later for upcoming webinars
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
              <Link
                key={webinar._id}
                href={`/webinars/${webinar._id}`}
                className="feature-card group p-6 transition-all hover:-translate-y-1"
              >
                <div className="mb-3 flex items-center gap-2">
                  {/* Status Badge */}
                  {webinar.status === 'live' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
                      LIVE NOW
                    </div>
                  )}

                  {/* Category */}
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryColor(
                      webinar.category
                    )}`}
                  >
                    {getCategoryLabel(webinar.category)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {webinar.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-secondary-600">
                  {webinar.description}
                </p>

                {/* Host */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-semibold text-white">
                    {webinar.host.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {webinar.host.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {webinar.host.role}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 border-t border-white/40 pt-4">
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    {formatDate(webinar.scheduledDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {webinar.duration} minutes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Users className="h-4 w-4 text-green-500" />
                    {webinar.attendees.length}
                    {webinar.maxAttendees && ` / ${webinar.maxAttendees}`}{' '}
                    registered
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
