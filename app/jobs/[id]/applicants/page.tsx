'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, MapPin, Briefcase, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ResumePreviewModal from '@/components/ResumePreviewModal'

interface Applicant {
  applicationId: string
  applicant: {
    id: string
    firstName: string
    lastName: string
    email: string
    bio: string
    skills: string[]
    experience: string
    location: string
  }
  application: {
    status: string
    coverLetter: string
    appliedDate: string
    feedbacks: any[]
    resume?: {
      filename: string
      cloudinaryUrl: string
      uploadedAt: string
    }
  }
}

interface JobInfo {
  id: string
  title: string
  company: string
}

export default function JobApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [previewResume, setPreviewResume] = useState<{
    url: string;
    filename: string;
    applicantName: string;
  } | null>(null)

  // Redirect if not employer
  useEffect(() => {
    if (user && user.role !== 'employer') {
      router.push('/')
      return
    }
  }, [user, router])

  useEffect(() => {
    if (params.id && user?.role === 'employer') {
      fetchApplicants(params.id as string)
    }
  }, [params.id, user])

  const fetchApplicants = async (jobId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jobs/${jobId}/applicants`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setJobInfo(data.job)
        setApplicants(data.applicants)
      } else if (response.status === 401 || response.status === 403) {
        setError('Unauthorized access')
        router.push('/')
      } else {
        setError('Failed to load applicants')
      }
    } catch (error) {
      console.error('Error fetching applicants:', error)
      setError('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: string, feedback?: any) => {
    try {
      setUpdatingStatus(applicationId)
      const response = await fetch(`/api/jobs/${params.id}/applicants`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          applicationId,
          status,
          feedback
        })
      })

      if (response.ok) {
        // Update the local state
        setApplicants(prev => prev.map(applicant => 
          applicant.applicationId === applicationId 
            ? { ...applicant, application: { ...applicant.application, status } }
            : applicant
        ))
        
        // Close modal if open
        setSelectedApplicant(null)
      } else {
        alert('Failed to update application status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update application status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'reviewed':
        return <Eye className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="futuristic-loader">
          <div className="futuristic-loader-inner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-red-600 text-center">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 auth-panel" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <Link 
            href="/"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-6 group/back transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover/back:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold group-hover/back:text-primary-600 transition-colors duration-300">Back to Dashboard</span>
          </Link>
          
          {jobInfo && (
            <div>
              <h1 className="auth-title text-4xl font-bold mb-3">
                Applicants for "{jobInfo.title}"
              </h1>
              <p className="auth-subtitle text-base text-secondary-600/90">
                {jobInfo.company} • {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="card p-12 text-center relative overflow-hidden group/empty animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="feature-icon mx-auto mb-6 w-20 h-20 group-hover/empty:scale-110 transition-transform duration-500">
              <User className="h-10 w-10" />
            </div>
            <h3 className="feature-heading text-2xl font-bold mb-3">No applicants yet</h3>
            <p className="auth-subtitle text-base max-w-md mx-auto">
              When candidates apply to this job, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applicants.map((applicant) => (
            <div key={applicant.applicationId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {applicant.applicant.firstName} {applicant.applicant.lastName}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {applicant.applicant.email}
                    </div>
                    {applicant.applicant.location && (
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {applicant.applicant.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.application.status)}`}>
                    {getStatusIcon(applicant.application.status)}
                    <span className="ml-1 capitalize">{applicant.application.status}</span>
                  </span>
                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Skills */}
              {applicant.applicant.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.applicant.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {applicant.applicant.skills.length > 5 && (
                      <span className="text-gray-500 text-sm">
                        +{applicant.applicant.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Resume */}
              {applicant.application.resume && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Resume</h4>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => setPreviewResume({
                        url: applicant.application.resume!.cloudinaryUrl,
                        filename: applicant.application.resume!.filename,
                        applicantName: `${applicant.applicant.firstName} ${applicant.applicant.lastName}`
                      })}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium underline"
                    >
                      {applicant.application.resume.filename}
                    </button>
                    <button
                      onClick={() => setPreviewResume({
                        url: applicant.application.resume!.cloudinaryUrl,
                        filename: applicant.application.resume!.filename,
                        applicantName: `${applicant.applicant.firstName} ${applicant.applicant.lastName}`
                      })}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 rounded hover:bg-primary-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </button>
                    <span className="text-gray-500 text-xs">
                      (Uploaded {applicant.application.resume.uploadedAt ? new Date(applicant.application.resume.uploadedAt).toLocaleDateString() : 'Recently'})
                    </span>
                  </div>
                </div>
              )}

              {/* Cover Letter Preview */}
              {applicant.application.coverLetter && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {applicant.application.coverLetter}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Applied {new Date(applicant.application.appliedDate).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  {applicant.application.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'reviewed')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'rejected')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {applicant.application.status === 'reviewed' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'accepted')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'rejected')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApplicant.applicant.firstName} {selectedApplicant.applicant.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedApplicant.applicant.email}</p>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Applicant Details */}
              <div className="space-y-6">
                {selectedApplicant.applicant.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700">{selectedApplicant.applicant.bio}</p>
                  </div>
                )}

                {selectedApplicant.applicant.experience && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
                    <p className="text-gray-700">{selectedApplicant.applicant.experience}</p>
                  </div>
                )}

                {selectedApplicant.applicant.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplicant.application.coverLetter && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedApplicant.application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Application Status and Actions */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Applied on {new Date(selectedApplicant.application.appliedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Current status: <span className="font-medium capitalize">{selectedApplicant.application.status}</span>
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedApplicant.application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'reviewed')}
                            disabled={updatingStatus === selectedApplicant.applicationId}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Mark as Reviewed
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'rejected')}
                            disabled={updatingStatus === selectedApplicant.applicationId}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {selectedApplicant.application.status === 'reviewed' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'accepted')}
                            disabled={updatingStatus === selectedApplicant.applicationId}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'rejected')}
                            disabled={updatingStatus === selectedApplicant.applicationId}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Resume Preview Modal */}
      {previewResume && (
        <ResumePreviewModal
          isOpen={!!previewResume}
          onClose={() => setPreviewResume(null)}
          resumeUrl={previewResume.url}
          filename={previewResume.filename}
          applicantName={previewResume.applicantName}
        />
      )}
      </div>
    </div>
  )
}