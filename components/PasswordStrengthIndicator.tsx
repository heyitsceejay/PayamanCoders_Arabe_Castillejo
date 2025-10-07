'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
  email?: string
  username?: string
  onValidationChange?: (isValid: boolean) => void
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  strength: string
  score: number
  feedback: string[]
}

export default function PasswordStrengthIndicator({
  password,
  email,
  username,
  onValidationChange
}: PasswordStrengthIndicatorProps) {
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [requirements, setRequirements] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch password requirements on mount
    fetchRequirements()
  }, [])

  useEffect(() => {
    if (password) {
      validatePassword()
    } else {
      setValidation(null)
      onValidationChange?.(false)
    }
  }, [password, email, username])

  const fetchRequirements = async () => {
    try {
      const response = await fetch('/api/auth/password-requirements')
      const data = await response.json()
      setRequirements(data.requirements || [])
    } catch (error) {
      console.error('Failed to fetch password requirements:', error)
    }
  }

  const validatePassword = async () => {
    if (!password) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email, username })
      })

      const result = await response.json()
      setValidation(result)
      onValidationChange?.(result.isValid)
    } catch (error) {
      console.error('Password validation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Weak':
      case 'Weak':
        return 'text-red-600 bg-red-100'
      case 'Fair':
        return 'text-orange-600 bg-orange-100'
      case 'Good':
        return 'text-yellow-600 bg-yellow-100'
      case 'Strong':
        return 'text-blue-600 bg-blue-100'
      case 'Very Strong':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStrengthBarWidth = (score: number) => {
    return Math.min((score / 8) * 100, 100)
  }

  if (!password) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Password Requirements:</h4>
        <ul className="space-y-2">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              {req}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Password Strength Bar */}
      {validation && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Password Strength</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStrengthColor(validation.strength)}`}>
              {validation.strength}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                validation.score <= 2 ? 'bg-red-500' :
                validation.score <= 4 ? 'bg-orange-500' :
                validation.score <= 5 ? 'bg-yellow-500' :
                validation.score <= 6 ? 'bg-blue-500' :
                'bg-green-500'
              }`}
              style={{ width: `${getStrengthBarWidth(validation.score)}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Password Requirements:</h4>
        
        {isLoading ? (
          <div className="text-sm text-gray-500">Checking password...</div>
        ) : (
          <ul className="space-y-2">
            {requirements.map((req, index) => {
              const isError = validation?.errors.some(error => 
                error.toLowerCase().includes(req.toLowerCase().split(' ')[1]) ||
                req.toLowerCase().includes(error.toLowerCase().split(' ')[2])
              )
              const isMet = password && !isError
              
              return (
                <li key={index} className="flex items-center text-sm">
                  {isMet ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  )}
                  <span className={isMet ? 'text-green-700' : 'text-red-600'}>
                    {req}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {/* Validation Errors */}
        {validation && validation.errors.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
            <h5 className="text-sm font-medium text-red-800 mb-2">Issues to fix:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-center">
                  <XCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Feedback */}
        {validation && validation.feedback.length > 0 && validation.isValid && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
            <ul className="text-sm text-green-700 space-y-1">
              {validation.feedback.map((feedback, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                  {feedback}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}