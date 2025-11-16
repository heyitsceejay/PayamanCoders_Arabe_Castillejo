'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  MessageCircle, 
  Lightbulb, 
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Video,
  FileText
} from 'lucide-react'

interface InterviewTip {
  category: string
  tips: string[]
}

interface AIResponse {
  tips: InterviewTip[]
  commonQuestions: string[]
  preparationSteps: string[]
}

export default function InterviewPrepPage() {
  const [jobRole, setJobRole] = useState('')
  const [experience, setExperience] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [error, setError] = useState('')

  const handleGenerateTips = async () => {
    if (!jobRole) {
      setError('Please enter a job role')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/interview-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole,
          experience,
          industry,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiResponse(data)
      } else {
        setError('Failed to generate tips. Please try again.')
      }
    } catch (err) {
      console.error('Error generating tips:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generalTips = [
    {
      icon: Target,
      title: 'Research the Company',
      description: 'Study the company\'s mission, values, recent news, and culture before the interview.',
      color: 'blue'
    },
    {
      icon: MessageCircle,
      title: 'Practice STAR Method',
      description: 'Structure your answers using Situation, Task, Action, Result for behavioral questions.',
      color: 'purple'
    },
    {
      icon: CheckCircle,
      title: 'Prepare Questions',
      description: 'Have thoughtful questions ready about the role, team, and company growth.',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Show Enthusiasm',
      description: 'Express genuine interest in the role and demonstrate your passion for the field.',
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Interview Preparation
              </h1>
              <p className="text-secondary-600">
                Get personalized interview tips powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* AI Tips Generator */}
        <div className="card mb-8">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Generate Personalized Tips
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job Role *
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                className="w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3 backdrop-blur transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3 backdrop-blur transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">Select level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6+ years)</option>
                  <option value="lead">Lead/Manager</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Technology, Finance, Healthcare"
                  className="w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3 backdrop-blur transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerateTips}
              disabled={loading || !jobRole}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating Tips...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate AI Tips
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Generated Tips */}
        {aiResponse && (
          <div className="mb-8 space-y-6">
            {/* Tips by Category */}
            {aiResponse.tips.map((tipCategory, idx) => (
              <div key={idx} className="card">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Lightbulb className="h-5 w-5 text-primary-600" />
                  {tipCategory.category}
                </h3>
                <ul className="space-y-3">
                  {tipCategory.tips.map((tip, tipIdx) => (
                    <li key={tipIdx} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-secondary-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Common Questions */}
            {aiResponse.commonQuestions.length > 0 && (
              <div className="card">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Common Interview Questions
                </h3>
                <ul className="space-y-3">
                  {aiResponse.commonQuestions.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-600">
                        {idx + 1}
                      </span>
                      <span className="text-secondary-700">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparation Steps */}
            {aiResponse.preparationSteps.length > 0 && (
              <div className="card">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Target className="h-5 w-5 text-blue-600" />
                  Preparation Checklist
                </h3>
                <ul className="space-y-3">
                  {aiResponse.preparationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-xs font-semibold text-blue-600">
                        {idx + 1}
                      </div>
                      <span className="text-secondary-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* General Tips */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Universal Interview Tips
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {generalTips.map((tip, idx) => (
              <div key={idx} className="card group transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getColorClasses(tip.color)}`}>
                    <tip.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                </div>
                <p className="text-secondary-700">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="card">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a
              href="/webinars"
              className="flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 p-4 transition-all hover:border-primary-500/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Webinars</h3>
                <p className="text-sm text-secondary-600">Join live sessions</p>
              </div>
            </a>

            <a
              href="/resources"
              className="flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 p-4 transition-all hover:border-primary-500/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Resources</h3>
                <p className="text-sm text-secondary-600">Study materials</p>
              </div>
            </a>

            <a
              href="/mentors"
              className="flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 p-4 transition-all hover:border-primary-500/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Find Mentors</h3>
                <p className="text-sm text-secondary-600">Get guidance</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
