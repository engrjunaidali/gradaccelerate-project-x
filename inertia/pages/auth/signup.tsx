import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'

interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  [key: string]: any
}

export default function Signup() {
  const { data, setData, post, processing, errors } = useForm<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const newErrors: Record<string, string> = {}

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!data.password) {
      newErrors.password = 'Password is required'
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setLocalErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      post('/auth/session/signup')
    }
  }

  return (
    <>
      <Head title="Sign Up - Notes App" />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Notes account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/auth/session/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={data.fullName}
                    onChange={(e) => setData('fullName', e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                  {(localErrors.fullName || errors.fullName) && (
                    <p className="mt-2 text-sm text-red-600">
                      {localErrors.fullName || errors.fullName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                  {(localErrors.email || errors.email) && (
                    <p className="mt-2 text-sm text-red-600">
                      {localErrors.email || errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Create a password"
                  />
                  {(localErrors.password || errors.password) && (
                    <p className="mt-2 text-sm text-red-600">
                      {localErrors.password || errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={data.confirmPassword}
                    onChange={(e) => setData('confirmPassword', e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                  {(localErrors.confirmPassword || errors.confirmPassword) && (
                    <p className="mt-2 text-sm text-red-600">
                      {localErrors.confirmPassword || errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Creating account...' : 'Create account'}
                </button>
              </div>

              <div className="text-center">
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to Home
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
