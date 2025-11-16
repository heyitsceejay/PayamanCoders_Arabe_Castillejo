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
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="relative overflow-hidden group/header">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative flex items-center gap-4">
                <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/40 group/icon flex-shrink-0">
                  <Video className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-[floatUp_0.85s_ease-out] mb-2">
                    Career Webinars
                  </h1>
                  <p className="text-lg md:text-xl text-secondary-600">
                    Learn from industry experts and mentors
                  </p>
                </div>
              </div>
            </div>
            {user && ['mentor', 'admin'].includes(user.role) && (
              <Link
                href="/webinars/create"
                className="relative flex items-center justify-center gap-3 px-8 py-4 text-base md:text-lg font-bold rounded-[2rem] border border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 group/btn hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden flex-shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
                <Plus className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover/btn:rotate-90 group-hover/btn:scale-125 transition-all duration-500" />
                <span className="relative z-10">Create Webinar</span>
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10 card relative overflow-hidden group/filter hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex flex-wrap items-center gap-6 p-6">
            <div className="flex items-center gap-3">
              <Filter className="h-6 w-6 text-primary-500 group-hover/filter:scale-110 transition-transform duration-300" />
              <span className="text-base font-bold text-gray-700">Status:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border-2 border-primary-500/30 bg-white/70 px-5 py-3 text-base font-semibold text-gray-700 shadow-lg backdrop-blur-xl transition-all hover:border-primary-400 hover:bg-white/90 hover:scale-105 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <option value="all">All</option>
                <option value="scheduled">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="completed">Past</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-700">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border-2 border-primary-500/30 bg-white/70 px-5 py-3 text-base font-semibold text-gray-700 shadow-lg backdrop-blur-xl transition-all hover:border-primary-400 hover:bg-white/90 hover:scale-105 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
              <Link
                key={webinar._id}
                href={`/webinars/${webinar._id}`}
                className="feature-card group relative p-8 transition-all hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative">
                  <div className="mb-4 flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    {webinar.status === 'live' && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/40">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white"></span>
                        LIVE NOW
                      </div>
                    )}

                    {/* Category */}
                    <span
                      className={`inline-block rounded-full px-4 py-2 text-sm font-bold shadow-md ${getCategoryColor(
                        webinar.category
                      )}`}
                    >
                      {getCategoryLabel(webinar.category)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {webinar.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 line-clamp-2 text-base text-secondary-600 leading-relaxed">
                    {webinar.description}
                  </p>

                  {/* Host */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-base font-bold text-white shadow-lg shadow-primary-500/40 group-hover/host:scale-110 transition-transform duration-300">
                      {webinar.host.name.charAt(0)}
                      <div className="absolute -inset-1 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-lg opacity-0 group-hover/host:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {webinar.host.name}
                      </p>
                      <p className="text-sm text-secondary-500 font-medium">
                        {webinar.host.role}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 border-t border-white/40 pt-5">
                    <div className="flex items-center gap-3 text-base text-secondary-600">
                      <Calendar className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">{formatDate(webinar.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-secondary-600">
                      <Clock className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">{webinar.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-secondary-600">
                      <Users className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">
                        {webinar.attendees.length}
                        {webinar.maxAttendees && ` / ${webinar.maxAttendees}`}{' '}
                        registered
                      </span>
                    </div>
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
