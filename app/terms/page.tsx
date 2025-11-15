'use client'

import { CSSProperties } from 'react'
import { FileText, CheckCircle, User, Briefcase, Copyright, Shield, RefreshCw, Mail } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-10 auth-panel text-center" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <div className="feature-icon mx-auto mb-6 w-16 h-16 flex items-center justify-center">
            <FileText className="h-12 w-12" />
          </div>
          <h1 className="auth-title text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="auth-subtitle text-xl text-secondary-600/90">
            Please read these terms carefully before using our platform
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.2s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Acceptance of Terms</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                By accessing and using WorkQit, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </div>
          </div>
          
          {/* Use of Service */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.3s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Use of Service</h2>
              </div>
              <p className="text-lg text-secondary-600/90 mb-6">You agree to use WorkQit only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="space-y-3">
                {[
                  'Use the service in any way that violates any applicable law or regulation',
                  'Impersonate or attempt to impersonate another user or person',
                  'Engage in any conduct that restricts or inhibits anyone\'s use of the service',
                  'Use any automated system to access the service'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary-500/60 group-hover/item:bg-primary-500 flex-shrink-0"></div>
                    <span className="text-lg text-secondary-600/90 group-hover/item:text-primary-600 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* User Accounts */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.4s_both]" style={{ '--float-delay': '0.4s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">User Accounts</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current 
                information. You are responsible for safeguarding your password and for all activities 
                that occur under your account.
              </p>
            </div>
          </div>
          
          {/* Job Postings and Applications */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.5s_both]" style={{ '--float-delay': '0.5s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Job Postings and Applications</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-4">For Employers:</p>
                  <ul className="space-y-3">
                    {[
                      'You are responsible for the accuracy of job postings',
                      'You must comply with all applicable employment laws',
                      'You agree not to discriminate in hiring practices'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 group/item">
                        <div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary-500/60 group-hover/item:bg-primary-500 flex-shrink-0"></div>
                        <span className="text-lg text-secondary-600/90 group-hover/item:text-primary-600 transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-4">For Job Seekers:</p>
                  <ul className="space-y-3">
                    {[
                      'You must provide accurate information in your profile and applications',
                      'You are responsible for the content of your resume and cover letters'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 group/item">
                        <div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary-500/60 group-hover/item:bg-primary-500 flex-shrink-0"></div>
                        <span className="text-lg text-secondary-600/90 group-hover/item:text-primary-600 transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Intellectual Property */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.6s_both]" style={{ '--float-delay': '0.6s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Copyright className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Intellectual Property</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                The service and its original content, features, and functionality are owned by WorkQit 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
          </div>
          
          {/* Limitation of Liability */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.7s_both]" style={{ '--float-delay': '0.7s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Limitation of Liability</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                WorkQit shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use of or inability to use the service.
              </p>
            </div>
          </div>
          
          {/* Changes to Terms */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.8s_both]" style={{ '--float-delay': '0.8s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Changes to Terms</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice 
                of any changes by posting the new Terms on this page.
              </p>
            </div>
          </div>
          
          {/* Contact Us */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.9s_both]" style={{ '--float-delay': '0.9s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Contact Us</h2>
              </div>
              <p className="text-lg text-secondary-600/90">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@workqit.com" className="auth-link inline-flex items-center gap-2 group/link text-lg">
                  <span>legal@workqit.com</span>
                </a>
              </p>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="text-center animate-[floatUp_0.6s_ease-out_1s_both]" style={{ '--float-delay': '1s' } as CSSProperties}>
            <p className="text-lg text-secondary-500/80 font-medium">
              Last updated: November 14, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
