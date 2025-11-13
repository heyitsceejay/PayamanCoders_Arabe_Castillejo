'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Users, BookOpen, MessageCircle, Target, Award, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const mentorFeatures = [
  {
    icon: Users,
    title: 'Mentee Matching',
    description: 'Get matched with mentees based on your expertise, industry experience, and availability preferences.',
  },
  {
    icon: MessageCircle,
    title: 'Communication Hub',
    description: 'Stay connected through integrated messaging, video calls, and progress tracking systems.',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Set your availability and manage mentoring sessions with built-in calendar integration.',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access and contribute to a comprehensive library of career development resources and templates.',
  },
  {
    icon: Target,
    title: 'Impact Tracking',
    description: 'Monitor your mentees\' progress and see the real impact of your guidance and support.',
  },
  {
    icon: Award,
    title: 'Recognition Program',
    description: 'Earn recognition for your contributions and build your reputation as a community leader.',
  },
]

const mentorStats = [
  { number: '1,200+', label: 'Active Mentors' },
  { number: '5,000+', label: 'Mentoring Sessions' },
  { number: '89%', label: 'Mentee Success Rate' },
  { number: '4.9/5', label: 'Average Rating' },
]

export default function MentorHomepage() {
  const { user } = useAuth()
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl"></div>
          <div className="absolute right-[-15%] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-secondary-500/10 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {user && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-secondary-600">
                  Welcome back, {user.firstName}!
                </h2>
              </div>
            )}
            
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl md:leading-[1.05]">
              Shape the Future by
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent"> Mentoring Tomorrow's Leaders</span>
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-secondary-600 md:text-xl">
              Share your expertise and experience with motivated job seekers and career changers. 
              Make a meaningful impact by providing guidance, support, and industry insights that 
              can transform careers and lives.
            </p>
            
            <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
              {user ? (
                <>
                  <Link href="/mentorship/dashboard" className="btn-primary text-lg px-8 py-3">
                    <Heart className="w-5 h-5 mr-2 inline" />
                    View Dashboard
                  </Link>
                  <Link href="/mentorship/mentees" className="btn-secondary text-lg px-8 py-3">
                    My Mentees
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
                    <Heart className="w-5 h-5 mr-2 inline" />
                    Start Mentoring
                  </Link>
                  <Link href="/mentorship/learn-more" className="btn-secondary text-lg px-8 py-3">
                    Learn More
                  </Link>
                </>
              )}
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="card group text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 text-primary-600 shadow-md shadow-primary-500/20 transition-all duration-500 group-hover:border-primary-500/40 group-hover:bg-primary-500/15">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Meaningful Connections</h3>
                <p className="text-secondary-600">Build lasting relationships with mentees and watch them grow professionally and personally</p>
              </div>
              
              <div className="card group text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 text-primary-600 shadow-md shadow-primary-500/20 transition-all duration-500 group-hover:border-primary-500/40 group-hover:bg-primary-500/15">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Share Your Expertise</h3>
                <p className="text-secondary-600">Contribute to career maps, resources, and educational content that helps thousands</p>
              </div>
              
              <div className="card group text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 text-primary-600 shadow-md shadow-primary-500/20 transition-all duration-500 group-hover:border-primary-500/40 group-hover:bg-primary-500/15">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Flexible Engagement</h3>
                <p className="text-secondary-600">Choose your level of involvement and mentoring style that fits your schedule</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-15%] top-1/3 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl"></div>
          <div className="absolute right-[-10%] top-0 h-72 w-72 rounded-full bg-secondary-500/10 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Tools to Maximize Your Impact
            </h2>
            <p className="mt-4 text-lg text-secondary-600 md:text-xl">
              Everything you need to provide effective mentorship and support the next generation 
              of professionals from underrepresented communities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {mentorFeatures.map((feature, index) => (
              <div
                key={index}
                className="card group flex flex-col gap-4 border-white/30 bg-white/55 p-8 shadow-lg shadow-primary-900/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-900/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 transition-all duration-500 group-hover:border-primary-500/50 group-hover:bg-primary-500/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-500/15 to-transparent"></div>
          <div className="absolute bottom-[-10%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Join a Community of Change-Makers
            </h2>
            <p className="mt-4 text-lg text-secondary-600 md:text-xl">
              Mentors on WorkQit are making a real difference in people's lives and careers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {mentorStats.map((stat, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-primary-500/25 bg-white/60 p-6 text-center shadow-xl shadow-primary-900/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-900/10"
              >
                <div className="mb-2 text-3xl font-bold text-primary-600 md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-secondary-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-20%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-secondary-500/10 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Real Stories, Real Impact
            </h2>
            <p className="mt-4 text-lg text-secondary-600 md:text-xl">
              See how mentors are changing lives and building the next generation of leaders
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="card border-white/30 bg-white/55 p-8 text-left shadow-lg shadow-primary-900/5 backdrop-blur-xl">
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary-600">12</div>
                <div className="text-sm uppercase tracking-wide text-secondary-500">Mentees placed in jobs</div>
              </div>
              <p className="mb-4 text-secondary-600">
                "Mentoring through WorkQit has been incredibly rewarding. Seeing my mentees land their dream jobs makes it all worthwhile."
              </p>
              <div className="text-xs uppercase tracking-wide text-secondary-500">
                - Sarah Chen, Senior Software Engineer
              </div>
            </div>

            <div className="card border-white/30 bg-white/55 p-8 text-left shadow-lg shadow-primary-900/5 backdrop-blur-xl">
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary-600">50+</div>
                <div className="text-sm uppercase tracking-wide text-secondary-500">Hours of mentoring</div>
              </div>
              <p className="mb-4 text-secondary-600">
                "The platform makes it easy to stay connected with mentees and track their progress. It's flexible and fits my schedule perfectly."
              </p>
              <div className="text-xs uppercase tracking-wide text-secondary-500">
                - Marcus Johnson, Marketing Director
              </div>
            </div>

            <div className="card border-white/30 bg-white/55 p-8 text-left shadow-lg shadow-primary-900/5 backdrop-blur-xl">
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary-600">95%</div>
                <div className="text-sm uppercase tracking-wide text-secondary-500">Would recommend</div>
              </div>
              <p className="mb-4 text-secondary-600">
                "WorkQit connects me with motivated individuals who are eager to learn. It's one of the most fulfilling things I do."
              </p>
              <div className="text-xs uppercase tracking-wide text-secondary-500">
                - Dr. Amanda Rodriguez, Data Scientist
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentoring Opportunities Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] bottom-0 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl"></div>
          <div className="absolute right-[-15%] top-10 h-80 w-80 rounded-full bg-secondary-500/15 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Ways to Make a Difference
            </h2>
            <p className="mt-4 text-lg text-secondary-600 md:text-xl">
              Choose the mentoring style that works best for you and your schedule
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="card text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 text-primary-600 shadow-md shadow-primary-500/20">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">1-on-1 Mentoring</h3>
              <p className="mb-4 text-secondary-600">
                Work closely with individual mentees on their career goals, skill development, and job search strategies.
              </p>
              <div className="text-sm font-medium uppercase tracking-wide text-primary-600">2-4 hours/month</div>
            </div>

            <div className="card text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 text-primary-600 shadow-md shadow-primary-500/20">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Group Mentoring</h3>
              <p className="mb-4 text-secondary-600">
                Lead group sessions, workshops, or webinars to share your expertise with multiple mentees at once.
              </p>
              <div className="text-sm font-medium uppercase tracking-wide text-primary-600">1-2 hours/month</div>
            </div>

            <div className="card text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/10 text-primary-600 shadow-md shadow-primary-500/20">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Content Creation</h3>
              <p className="mb-4 text-secondary-600">
                Create resources, guides, and career maps that help thousands of job seekers in your industry.
              </p>
              <div className="text-sm font-medium uppercase tracking-wide text-primary-600">Flexible timing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 opacity-90"></div>
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/25 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Make a Lasting Impact?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90 md:text-xl">
            Join our community of mentors who are helping shape careers and create opportunities 
            for talented individuals from diverse backgrounds. Your experience can change lives.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth/register" className="btn-primary bg-white text-primary-600 hover:text-primary-700">
              <Heart className="w-5 h-5 mr-2 inline" />
              Become a Mentor
            </Link>
            <Link href="/mentorship/learn-more" className="btn-secondary border-white/60 text-white hover:text-primary-600">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}