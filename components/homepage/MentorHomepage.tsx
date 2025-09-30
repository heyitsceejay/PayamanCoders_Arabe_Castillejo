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
      <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {user && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Welcome back, {user.firstName}!
                </h2>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Shape the Future by
              <span className="text-green-600"> Mentoring Tomorrow's Leaders</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Share your expertise and experience with motivated job seekers and career changers. 
              Make a meaningful impact by providing guidance, support, and industry insights that 
              can transform careers and lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Meaningful Connections</h3>
                <p className="text-gray-600">Build lasting relationships with mentees and watch them grow professionally and personally</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Your Expertise</h3>
                <p className="text-gray-600">Contribute to career maps, resources, and educational content that helps thousands</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Engagement</h3>
                <p className="text-gray-600">Choose your level of involvement and mentoring style that fits your schedule</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tools to Maximize Your Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to provide effective mentorship and support the next generation 
              of professionals from underrepresented communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorFeatures.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join a Community of Change-Makers
            </h2>
            <p className="text-xl text-gray-600">
              Mentors on WorkQit are making a real difference in people's lives and careers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {mentorStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-gray-600">
              See how mentors are changing lives and building the next generation of leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-green-600 text-4xl font-bold">12</div>
                <div className="text-gray-600">mentees placed in jobs</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Mentoring through WorkQit has been incredibly rewarding. Seeing my mentees land their dream jobs makes it all worthwhile."
              </p>
              <div className="text-sm text-gray-500">
                - Sarah Chen, Senior Software Engineer
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-green-600 text-4xl font-bold">50+</div>
                <div className="text-gray-600">hours of mentoring</div>
              </div>
              <p className="text-gray-700 mb-4">
                "The platform makes it easy to stay connected with mentees and track their progress. It's flexible and fits my schedule perfectly."
              </p>
              <div className="text-sm text-gray-500">
                - Marcus Johnson, Marketing Director
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-green-600 text-4xl font-bold">95%</div>
                <div className="text-gray-600">would recommend</div>
              </div>
              <p className="text-gray-700 mb-4">
                "WorkQit connects me with motivated individuals who are eager to learn. It's one of the most fulfilling things I do."
              </p>
              <div className="text-sm text-gray-500">
                - Dr. Amanda Rodriguez, Data Scientist
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentoring Opportunities Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ways to Make a Difference
            </h2>
            <p className="text-xl text-gray-600">
              Choose the mentoring style that works best for you and your schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1-on-1 Mentoring</h3>
              <p className="text-gray-600 mb-4">
                Work closely with individual mentees on their career goals, skill development, and job search strategies.
              </p>
              <div className="text-sm text-green-600 font-medium">2-4 hours/month</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Group Mentoring</h3>
              <p className="text-gray-600 mb-4">
                Lead group sessions, workshops, or webinars to share your expertise with multiple mentees at once.
              </p>
              <div className="text-sm text-green-600 font-medium">1-2 hours/month</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Content Creation</h3>
              <p className="text-gray-600 mb-4">
                Create resources, guides, and career maps that help thousands of job seekers in your industry.
              </p>
              <div className="text-sm text-green-600 font-medium">Flexible timing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Lasting Impact?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of mentors who are helping shape careers and create opportunities 
            for talented individuals from diverse backgrounds. Your experience can change lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-green-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              <Heart className="w-5 h-5 mr-2 inline" />
              Become a Mentor
            </Link>
            <Link href="/mentorship/learn-more" className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}