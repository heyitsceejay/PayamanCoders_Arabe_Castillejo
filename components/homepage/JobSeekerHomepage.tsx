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
import OnboardingModal from "@/components/onboarding/OnboardingModal";

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

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    applications: 0,
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Check onboarding status when user is available
    if (user?.role === 'job_seeker') {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      console.log('🔍 Checking onboarding status...');
      const response = await fetch('/api/onboarding/status');
      console.log('📡 Onboarding API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Onboarding status data:', data);
        
        // Show onboarding if not completed
        if (!data.onboarding?.completed) {
          console.log('🎯 Opening onboarding modal - onboarding not completed');
          setShowOnboarding(true);
        } else {
          console.log('✔️ Onboarding already completed, skipping modal');
        }
      } else {
        console.error('❌ Onboarding API returned error:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to check onboarding status:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [profileRes, statsRes, applicationsRes, notificationsRes, internshipsRes] =
        await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/applications"),
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

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData.applications || []);
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Navigation Bar */}
        <nav className="border-b border-white/30 bg-white/60 shadow-lg shadow-primary-900/10 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <span className="rounded-xl border border-white/40 bg-white/70 px-3 py-1 text-2xl font-bold text-primary-600 shadow-inner shadow-primary-900/5">
                  WorkQit
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/60"></div>
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/60"></div>
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/60"></div>
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/60"></div>
            </div>
          </div>
        </nav>

        {/* Loading Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 rounded-full bg-white/60"></div>
            <div className="h-4 w-1/2 rounded-full bg-white/60"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-primary-900/10">
                <div className="h-32 rounded-2xl bg-white/70"></div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-primary-900/10 lg:col-span-2">
                <div className="h-64 rounded-2xl bg-white/70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
        <div className="surface-panel max-w-md border-red-300/40 text-center text-red-600 shadow-red-900/10">
          <h3 className="mb-3 text-lg font-semibold text-red-600">Error Loading Dashboard</h3>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-primary mt-6 bg-gradient-to-r from-red-600 to-red-500 px-6 py-2 text-sm hover:from-red-500 hover:to-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          fetchDashboardData();
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-[-40%] h-56 w-56 rounded-full bg-primary-500/20 blur-3xl"></div>
          <div className="absolute left-[-20%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary-500/15 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Welcome back, {userProfile?.firstName || "User"}!
          </h1>
          <p className="text-secondary-600">
            Ready to find your next career opportunity? Here's what's new today.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: User Profile Summary */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card text-center">
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/20 to-primary-500/5 text-primary-600 shadow-inner shadow-primary-900/10">
                  {userProfile?.profile?.profilePicture ? (
                    <img
                      src={userProfile.profile.profilePicture}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>

                {/* User Name */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {userProfile?.firstName} {userProfile?.lastName}
                </h3>

                {/* Application Summary */}
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    {applicationStats.applications}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-secondary-500">
                    Applications
                  </div>
                </div>

                {/* Career Interests */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-secondary-600">
                    Career Interests
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {userProfile?.profile?.skills?.length ? (
                      userProfile.profile.skills
                        .slice(0, 4)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="badge bg-primary-500/10 text-primary-600"
                          >
                            {skill}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm text-secondary-500">
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Link
                  href="/profile"
                  className="btn-primary px-6 py-2 text-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Applications
                </h3>
                {applications.length > 0 && (
                  <Link
                    href="/applications"
                    className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-500"
                  >
                    View All
                  </Link>
                )}
              </div>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/40 py-8 text-center backdrop-blur">
                    <p className="mb-4 text-secondary-500">
                      No applications yet
                    </p>
                    <Link
                      href="/jobs"
                      className="btn-secondary px-5 py-2 text-sm"
                    >
                      <span>Browse Jobs to Apply</span>
                    </Link>
                  </div>
                ) : (
                  applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:border-primary-500/40"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {app.jobTitle}
                        </h4>
                        <p className="text-sm text-secondary-600">{app.company}</p>
                        <p className="text-xs text-secondary-500">
                          Applied {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.status === 'pending' ? 'Under Review' : 
                         app.status === 'reviewed' ? 'Reviewed' :
                         app.status === 'accepted' ? 'Accepted' : 'Not Selected'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Recent Notifications
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/30 bg-white/60 p-3 shadow-inner shadow-primary-900/5 backdrop-blur"
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                      notification.read ? 'bg-white/50 text-secondary-500' : 'bg-primary-500/15 text-primary-600'
                    }`}>
                      <Bell className={`h-4 w-4 ${
                        notification.read ? '' : ''
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${
                        notification.read ? 'text-secondary-600' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-secondary-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recommended Internships */}
          <div className="lg:col-span-2">
            <div className="surface-panel">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Recommended Internships
              </h2>

              {/* Internships Grid */}
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {internships.length > 0 ? (
                  internships.map((internship) => (
                    <div
                      key={internship._id}
                      className="group rounded-2xl border border-white/40 bg-white/60 p-5 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-400 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/10"
                    >
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {internship.title}
                      </h3>
                      <p className="mb-2 text-sm text-secondary-600">
                        {internship.company}
                      </p>
                      <p className="mb-4 line-clamp-2 text-sm text-secondary-600">
                        {internship.description ||
                          "Exciting opportunity to grow your career and gain valuable experience."}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide text-secondary-500">
                          {internship.location}{" "}
                          {internship.remote && "• Remote"}
                        </span>
                        <Link
                          href={`/jobs/${internship._id}`}
                          className="btn-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                        >
                          Apply now
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 rounded-3xl border border-dashed border-primary-500/40 bg-white/40 py-10 text-center backdrop-blur">
                    <p className="mb-4 text-secondary-500">
                      No recommendations available at the moment
                    </p>
                    <Link
                      href="/jobs"
                      className="btn-secondary px-5 py-2 text-sm"
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
                    className="btn-ghost px-6 py-2 text-sm uppercase tracking-wide disabled:opacity-50 disabled:shadow-none"
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
    </>
  );
}
