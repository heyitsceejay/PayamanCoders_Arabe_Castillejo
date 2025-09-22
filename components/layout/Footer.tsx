import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">WorkQit</h3>
            <p className="text-gray-300 mb-4">
              Connecting talent with opportunity. Empowering individuals from low-income communities 
              and recent graduates with job opportunities and upskilling resources.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-gray-300 hover:text-white">Find Jobs</Link></li>
              <li><Link href="/career-map" className="text-gray-300 hover:text-white">Career Map</Link></li>
              <li><Link href="/community" className="text-gray-300 hover:text-white">Community</Link></li>
              <li><Link href="/employers" className="text-gray-300 hover:text-white">For Employers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 WorkQit Platform. Built by Christian John Castillejo & Cloyd Matthew Arabe.
          </p>
        </div>
      </div>
    </footer>
  )
}