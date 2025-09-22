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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides tools for job seekers, employers, and mentors 
            to create meaningful connections and career growth opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}