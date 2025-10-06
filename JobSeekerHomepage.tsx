"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Edit,
  Home,
  Briefcase,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    bio?: string;
    skills: string[];
    location?: string;
    profilePicture?: string;
  };
}

interface ApplicationStats {
  applications: number;
}

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface Internship {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  remote: boolean;
}

export default function JobSeekerHomepage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    applications: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [profileRes, statsRes, notificationsRes, internshipsRes] =
        await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/dashboard/stats"),
          fetch("/api/notifications"),
          fetch("/api/dashboard/recommendations?limit=4"),
        ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData.user);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setApplicationStats({ applications: statsData.applications || 0 });
      }

      // Mock notifications if API doesn't exist
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      } else {
        // Fallback mock notifications
        setNotifications([
          {
            id: "1",
            message: "New job match found for your skills",
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            id: "2",
            message: "Application status updated for Frontend Developer role",
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            id: "3",
            message: "Profile viewed by 3 employers this week",
            createdAt: new Date().toISOString(),
            read: true,
          },
        ]);
      }

      if (internshipsRes.ok) {
        const internshipsData = await internshipsRes.json();
        setInternships(internshipsData.recommendations || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreInternships = async () => {
    try {
      setLoadingMore(true);
      const response = await fetch(
        `/api/dashboard/recommendations?limit=4&offset=${internships.length}`
      );

      if (response.ok) {
        const data = await response.json();
        setInternships((prev) => [...prev, ...(data.recommendations || [])]);
      }
    } catch (error) {
      console.error("Error loading more internships:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  WorkQit
                </span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                WorkQit
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <Link
                href="/jobs"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Opportunities
              </Link>
              <Link
                href="/profile"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4 mr-1" />
                My Profile
              </Link>
              <Link
                href="/messages"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Messages
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-900"></div>
        <div className="absolute inset-0 cyber-grid-bg opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="neon-text">{userProfile?.firstName || "User"}</span>!
          </h1>
          <p className="text-white/90 text-lg">
            Ready to find your next career opportunity? Here's what's new today.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full mt-4"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Profile Summary */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="cyber-card p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full blur-lg opacity-50"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full flex items-center justify-center">
                    {userProfile?.profile?.profilePicture ? (
                      <img
                        src={userProfile.profile.profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-black" />
                    )}
                  </div>
                </div>

                {/* User Name */}
                <h3 className="text-xl font-bold text-white mb-4">
                  {userProfile?.firstName} {userProfile?.lastName}
                </h3>

                {/* Application Summary */}
                <div className="mb-6">
                  <div className="text-4xl font-bold neon-text mb-1">
                    {applicationStats.applications}
                  </div>
                  <div className="text-sm text-white/90">Applications</div>
                </div>

                {/* Career Interests */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Career Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.profile?.skills?.length ? (
                      userProfile.profile.skills
                        .slice(0, 4)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/15 text-white/90 text-xs rounded-lg border border-white/30"
                          >
                            {skill}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm text-white/70">
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Link
                  href="/profile"
                  className="cyber-button inline-flex items-center px-6 py-3 text-sm font-bold"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="cyber-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Notifications
              </h3>
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 bg-white/10 rounded-lg border border-white/20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/70 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recommended Internships */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recommended Internships
              </h2>

              {/* Internships Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {internships.length > 0 ? (
                  internships.map((internship) => (
                    <div
                      key={internship._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {internship.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {internship.company}
                      </p>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {internship.description ||
                          "Exciting opportunity to grow your career and gain valuable experience."}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {internship.location}{" "}
                          {internship.remote && "• Remote"}
                        </span>
                        <Link
                          href={`/jobs/${internship._id}`}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          Apply now
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No recommendations available at the moment
                    </p>
                    <Link
                      href="/jobs"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse All Opportunities
                    </Link>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {internships.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={loadMoreInternships}
                    disabled={loadingMore}
                    className="inline-flex items-center px-6 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? "Loading..." : "Load More Opportunities"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
