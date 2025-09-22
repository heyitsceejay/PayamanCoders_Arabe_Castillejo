'use client'

import Link from 'next/link'
import { ArrowRight, Users, Building, TrendingUp, Plus, Target, Award, BarChart3 } from 'lucide-react'

interface User {
  firstName: string
  lastName: string
  role: string
}

interface EmployerHomepageProps {
  user?: User
}

const employerFeatures = [
  {
    icon: Building,
    title: 'Streamlined Job Posting',
    description: 'Create and manage job postings with our intuitive interface. Post internships, apprenticeships, and full-time positions.',
  },
  {
    icon: Users,
    title: 'Diverse Talent Pool',
    description: 'Access motivated candidates from underrepresented communities with fresh perspectives and strong work ethic.',
  },
  {
    icon: Target,
    title: 'Smart Candidate Matching',
    description: 'AI-powered matching system connects you with candidates who best fit your requirements and company culture.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track hiring metrics, candidate success rates, and team diversity with comprehensive reporting tools.',
  },
  {
    icon: Award,
    title: 'Structured Feedback System',
    description: 'Provide detailed feedback to candidates with skill assessments and development recommendations.',
  },
  {
    icon: TrendingUp,
    title: 'Diversity & Inclusion Tools',
    description: 'Access resources and tools to build inclusive hiring practices and support underrepresented talent.',
  },
]

const employerStats = [
  { number: '500+', label: 'Partner Employers' },
  { number: '10,000+', label: 'Quality Candidates' },
  { number: '92%', label: 'Hiring Success Rate' },
  { number: '2,500+', label: 'Successful Placements' },
]

export default function EmployerHomepage({ user }: EmployerHomepageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
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
              Find Exceptional Talent from
              <span className="text-blue-600"> Emerging Communities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with motivated job seekers, recent graduates, and career changers who bring 
              fresh perspectives and strong work ethic to your organization. Build a diverse, 
              high-performing team while making a positive social impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <>
                  <Link href="/jobs/create" className="btn-primary text-lg px-8 py-3">
                    <Plus className="w-5 h-5 mr-2 inline" />
                    Post a Job
                  </Link>
                  <Link href="/dashboard" className="btn-secondary text-lg px-8 py-3">
                    View Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
                    Start Hiring Today
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Link>
                  <Link href="/employer/demo" className="btn-secondary text-lg px-8 py-3">
                    Schedule Demo
                  </Link>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Diverse Talent Pipeline</h3>
                <p className="text-gray-600">Access candidates from underrepresented communities with unique perspectives and strong motivation</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Streamlined Hiring</h3>
                <p className="text-gray-600">Efficient job posting, candidate screening, and hiring process with built-in collaboration tools</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Measurable Impact</h3>
                <p className="text-gray-600">Track hiring success, team diversity metrics, and social impact of your inclusive hiring practices</p>
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
              Powerful Tools for Smart Hiring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to find, evaluate, and develop talent from emerging communities. 
              Build a diverse workforce while supporting career growth and social mobility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employerFeatures.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Employers
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of companies making a difference through inclusive hiring
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {employerStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
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

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how employers are building stronger teams through WorkQit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-blue-600 text-4xl font-bold">85%</div>
                <div className="text-gray-600">retention rate</div>
              </div>
              <p className="text-gray-700 mb-4">
                "WorkQit candidates show exceptional commitment and bring fresh perspectives to our team."
              </p>
              <div className="text-sm text-gray-500">
                - Tech Startup, San Francisco
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-blue-600 text-4xl font-bold">3x</div>
                <div className="text-gray-600">faster hiring</div>
              </div>
              <p className="text-gray-700 mb-4">
                "The platform streamlined our hiring process and helped us find quality candidates quickly."
              </p>
              <div className="text-sm text-gray-500">
                - Marketing Agency, Austin
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-blue-600 text-4xl font-bold">40%</div>
                <div className="text-gray-600">more diverse hires</div>
              </div>
              <p className="text-gray-700 mb-4">
                "WorkQit helped us build a more inclusive team while finding exceptional talent."
              </p>
              <div className="text-sm text-gray-500">
                - Financial Services, New York
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Dream Team?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of employers who are making a difference by providing opportunities 
            to talented individuals from underrepresented communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              Start Hiring Today
            </Link>
            <Link href="/employer/demo" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}