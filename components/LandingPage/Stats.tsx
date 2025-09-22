const stats = [
  { number: '10,000+', label: 'Job Seekers' },
  { number: '500+', label: 'Employers' },
  { number: '2,500+', label: 'Jobs Posted' },
  { number: '85%', label: 'Success Rate' },
]

export default function Stats() {
  return (
    <section className="py-20 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Making Impact Together
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of individuals and employers creating opportunities for growth
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
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
  )
}