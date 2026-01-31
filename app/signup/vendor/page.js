'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Mail, Lock, Eye, EyeOff, User, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function VendorSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    gstin: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password) => {
    const errors = []
    if (password.length < 8) {
      errors.push('At least 8 characters')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter')
    }
    if (!/\d/.test(password)) {
      errors.push('One number')
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('One special character (@$!%*?&)')
    }
    return errors
  }

  const validateGSTIN = (gstin) => {
    if (!gstin) return false
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstinRegex.test(gstin.toUpperCase())
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Auto-uppercase GSTIN
    const processedValue = name === 'gstin' ? value.toUpperCase() : value
    setFormData(prev => ({ ...prev, [name]: processedValue }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.gstin.trim()) {
      newErrors.gstin = 'GSTIN is required'
    } else if (!validateGSTIN(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format. Must be 15 characters (e.g., 27AAAAA0000A1Z5)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: 'VENDOR',
          companyName: formData.companyName,
          gstin: formData.gstin.toUpperCase()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || 'Signup failed' })
        setIsLoading(false)
        return
      }

      // Redirect to login on success
      router.push('/login?registered=true&role=vendor')
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' })
      setIsLoading(false)
    }
  }

  const passwordErrors = formData.password ? validatePassword(formData.password) : []
  const isGSTINValid = formData.gstin ? validateGSTIN(formData.gstin) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Vendor Registration</h1>
            <p className="text-slate-600 text-sm">Create your vendor account to start selling</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Company Name Field */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.companyName
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Enter your company name"
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* GSTIN Field */}
            <div>
              <label htmlFor="gstin" className="block text-sm font-medium text-slate-700 mb-2">
                GSTIN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="gstin"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  maxLength={15}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors uppercase ${
                    errors.gstin
                      ? 'border-red-300 focus:ring-red-500'
                      : isGSTINValid === true
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="27AAAAA0000A1Z5"
                />
              </div>
              {errors.gstin && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gstin}
                </p>
              )}
              {isGSTINValid && !errors.gstin && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Valid GSTIN format
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Format: 15 characters (e.g., 27AAAAA0000A1Z5)
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.length > 0 ? (
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-medium mb-1">Password must contain:</p>
                      {passwordErrors.map((error, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Password meets all requirements</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering Vendor...
                </>
              ) : (
                'Register as Vendor'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Want to register as a customer?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Customer Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
