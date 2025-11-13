import type { CSSProperties } from 'react'
import { CheckCircle, Users, BarChart3, MapPin, MessageSquare, Building } from 'lucide-react'

const features = [
  {
    icon: Building,
    title: 'Employer Dashboard',
    description: 'Post internships, apprenticeships, and jobs. Evaluate candidates with structured templates and track progress.',
  },
  {
    icon: BarChart3,
    title: 'Performance Tools',
    description: 'Comprehensive feedback loops with ratings, skill assessments, and exportable performance reports.',
  },
  {
    icon: MapPin,
    title: 'Career Map Builder',
    description: 'Interactive career visualization from entry-level to senior roles with personalized roadmaps.',
  },
  {
    icon: CheckCircle,
    title: 'Smart Job Matching',
    description: 'Intelligent filters for location, skills, and availability to find the perfect opportunities.',
  },
  {
    icon: MessageSquare,
    title: 'Community Forums',
    description: 'Peer forums for sharing experiences, tips, and advice with fellow job seekers.',
  },
  {
    icon: Users,
    title: 'Mentorship Program',
    description: 'Connect with professional mentors and alumni for guidance and career support.',
  },
]

export default function Features() {
  return (
    <section className="hero-gradient relative overflow-hidden py-24">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary-500/12 blur-3xl"></div>
        <div className="absolute right-[-15%] top-16 h-80 w-80 rounded-full bg-secondary-500/12 blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="feature-heading">
            Everything You Need to Succeed
          </h2>
          <p className="feature-subheading">
            Our comprehensive platform provides tools for job seekers, employers, and mentors 
            to create meaningful connections and career growth opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
              style={{ '--float-delay': `${index * 0.08}s` } as CSSProperties}
            >
              <div className="feature-icon mb-5">
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-lg text-secondary-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}