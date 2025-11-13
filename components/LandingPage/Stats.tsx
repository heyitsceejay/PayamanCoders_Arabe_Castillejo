import type { CSSProperties } from 'react'

const stats = [
  { number: '10,000+', label: 'Job Seekers' },
  { number: '500+', label: 'Employers' },
  { number: '2,500+', label: 'Jobs Posted' },
  { number: '85%', label: 'Success Rate' },
]

export default function Stats() {
  return (
    <section className="hero-gradient relative overflow-hidden py-24">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-500/18 to-transparent"></div>
        <div className="absolute bottom-[-10%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/14 blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Making Impact Together
          </h2>
          <p className="mt-4 text-lg text-secondary-600 md:text-xl">
            Join thousands of individuals and employers creating opportunities for growth
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card group"
              style={{ '--float-delay': `${index * 0.12}s` } as CSSProperties}
            >
              <div className="stat-number mb-4">
                {stat.number}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}