'use client'

import React, { useState, useEffect } from 'react'
import { ALL_COUNTRIES } from '@/utilities/countryCodes'

export interface ContactFormBlockProps {
  id?: string
  heading?: string | null
  subheading?: string | null
  nameLabel?: string | null
  namePlaceholder?: string | null
  companyLabel?: string | null
  companyPlaceholder?: string | null
  emailLabel?: string | null
  emailPlaceholder?: string | null
  phoneLabel?: string | null
  phonePlaceholder?: string | null
  messageLabel?: string | null
  messagePlaceholder?: string | null
  submitButtonLabel?: string | null
  successTitle?: string | null
  successMessage?: string | null
}

interface FormState {
  fullName: string
  company: string
  email: string
  countryCode: string
  telephone: string
  message: string
  websiteUrl: string // Honeypot field
}

interface FormErrors {
  fullName?: string
  email?: string
  message?: string
}

export const ContactFormBlockComponent: React.FC<ContactFormBlockProps> = ({
  id = 'contact',
  heading = 'Contact us',
  subheading = 'Write us a message.',
  nameLabel = 'Full name',
  namePlaceholder = 'Ilaria Casi',
  companyLabel = 'Company',
  companyPlaceholder = 'Enter company name',
  emailLabel = 'E-mail address',
  emailPlaceholder = 'Your e-mail',
  phoneLabel = 'Telephone number',
  phonePlaceholder = '342 ..',
  messageLabel = 'Message here',
  messagePlaceholder = 'Write your message here',
  submitButtonLabel = 'Send message',
  successTitle = 'Thank you for your message!',
  successMessage = 'We have successfully received your inquiry and dispatched an automated confirmation email. Our team will review your message and reach out shortly.',
}) => {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    company: '',
    email: '',
    countryCode: '+ 31',
    telephone: '',
    message: '',
    websiteUrl: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loadTimestamp, setLoadTimestamp] = useState<number>(0)

  // Anti-Spam: Set form load timestamp on mount
  useEffect(() => {
    setLoadTimestamp(Date.now())
  }, [])

  // Validation function
  const validateField = (field: keyof FormState, value: string): string | undefined => {
    const trimmed = value.trim()
    if (field === 'fullName') {
      if (!trimmed) return 'Full name is required.'
      if (trimmed.length < 2) return 'Full name must be at least 2 characters.'
    }
    if (field === 'email') {
      if (!trimmed) return 'E-mail address is required.'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmed)) return 'Please enter a valid e-mail address.'
    }
    if (field === 'message') {
      if (!trimmed) return 'Message is required.'
      if (trimmed.length < 5) return 'Message must be at least 5 characters.'
    }
    return undefined
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name as keyof FormState, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name as keyof FormState, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    // Validate all fields
    const newErrors: FormErrors = {}
    const nameErr = validateField('fullName', form.fullName)
    if (nameErr) newErrors.fullName = nameErr

    const emailErr = validateField('email', form.email)
    if (emailErr) newErrors.email = emailErr

    const messageErr = validateField('message', form.message)
    if (messageErr) newErrors.message = messageErr

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ fullName: true, email: true, message: true })
      return
    }

    setIsLoading(true)

    try {
      const fullPhone = form.telephone.trim()
        ? `${form.countryCode} ${form.telephone.trim()}`
        : ''

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          company: form.company,
          phone: fullPhone,
          email: form.email,
          message: form.message,
          website_url: form.websiteUrl, // Honeypot field
          timestamp: loadTimestamp, // Anti-spam timing token
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit the form. Please try again.')
      }

      setIsSuccess(true)
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setForm({
      fullName: '',
      company: '',
      email: '',
      countryCode: '+ 31',
      telephone: '',
      message: '',
      websiteUrl: '',
    })
    setErrors({})
    setTouched({})
    setIsSuccess(false)
    setServerError(null)
    setLoadTimestamp(Date.now())
  }

  return (
    <section
      id={id}
      className="w-full bg-black text-white py-24 lg:py-32 px-4 sm:px-6 lg:px-12 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Subheading (Matching Figma) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-[44px] font-normal tracking-tight text-white leading-tight">
              {heading}
            </h2>
            <p className="text-zinc-400 text-lg lg:text-xl font-normal">
              {subheading}
            </p>
          </div>

          {/* Right Column: Interactive Contact Form (Matching Figma) */}
          <div className="lg:col-span-8">
            {isSuccess ? (
              /* Success State Card */
              <div className="bg-[#08080a] border border-emerald-500/40 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white">{successTitle || 'Thank you for your message!'}</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {successMessage || (
                      <>
                        We have successfully received your inquiry and dispatched an automated confirmation email to{' '}
                        <strong className="text-white font-medium">{form.email}</strong>. Our team will review your message and reach out shortly.
                      </>
                    )}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors border border-zinc-700"
                  >
                    Write another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Anti-Spam: Invisible Honeypot Trap */}
                <div aria-hidden="true" className="opacity-0 absolute -left-[9999px] w-0 h-0 overflow-hidden">
                  <label htmlFor="website_url">Do not fill this field</label>
                  <input
                    type="text"
                    id="website_url"
                    name="websiteUrl"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.websiteUrl}
                    onChange={handleChange}
                  />
                </div>

                {/* Server Error State Alert */}
                {serverError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-sm flex items-start gap-3 animate-in fade-in"
                  >
                    <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Submission Error</p>
                      <p className="text-rose-300/90 text-xs mt-0.5">{serverError}</p>
                    </div>
                  </div>
                )}

                {/* Row 1: Full name + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-normal text-zinc-200">
                      {nameLabel || 'Full name'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      disabled={isLoading}
                      value={form.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={namePlaceholder || 'Ilaria Casi'}
                      aria-required="true"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      className={`w-full px-4 py-3.5 rounded-lg bg-[#121214] text-white placeholder-zinc-500/70 border transition-all duration-200 focus:outline-none focus:ring-1 ${
                        errors.fullName
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                          : 'border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500'
                      }`}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="text-xs text-rose-400 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-normal text-zinc-200">
                      {companyLabel || 'Company'}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      disabled={isLoading}
                      value={form.company}
                      onChange={handleChange}
                      placeholder={companyPlaceholder || 'Enter company name'}
                      className="w-full px-4 py-3.5 rounded-lg bg-[#121214] text-white placeholder-zinc-500/70 border border-zinc-800 transition-all duration-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                    />
                  </div>
                </div>

                {/* Row 2: E-mail address + Telephone number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* E-mail address */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-normal text-zinc-200">
                      {emailLabel || 'E-mail address'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      disabled={isLoading}
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={emailPlaceholder || 'Your e-mail'}
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full px-4 py-3.5 rounded-lg bg-[#121214] text-white placeholder-zinc-500/70 border transition-all duration-200 focus:outline-none focus:ring-1 ${
                        errors.email
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                          : 'border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500'
                      }`}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-rose-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Telephone number with country code split */}
                  <div className="space-y-2">
                    <label htmlFor="telephone" className="block text-sm font-normal text-zinc-200">
                      {phoneLabel || 'Telephone number'}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative min-w-[96px]">
                        <div className="flex items-center justify-between h-full px-3.5 py-3.5 rounded-lg bg-[#121214] text-zinc-200 border border-zinc-800 text-sm font-medium pointer-events-none">
                          <span>{form.countryCode}</span>
                          <svg className="w-3.5 h-3.5 text-zinc-500 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <select
                          id="countryCode"
                          name="countryCode"
                          disabled={isLoading}
                          value={form.countryCode}
                          onChange={handleChange}
                          aria-label="Country calling code"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-zinc-900 text-white"
                        >
                          {ALL_COUNTRIES.map((c) => (
                            <option key={`${c.code}-${c.name}`} value={c.dialCode} className="bg-zinc-900 text-white">
                              {c.name} ({c.dialCode})
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        disabled={isLoading}
                        value={form.telephone}
                        onChange={handleChange}
                        placeholder={phonePlaceholder || '342 ..'}
                        className="flex-1 px-4 py-3.5 rounded-lg bg-[#121214] text-white placeholder-zinc-500/70 border border-zinc-800 transition-all duration-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Message here */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-normal text-zinc-200">
                    {messageLabel || 'Message here'} <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    disabled={isLoading}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={messagePlaceholder || 'Write your message here'}
                    aria-required="true"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-4 py-3.5 rounded-lg bg-[#121214] text-white placeholder-zinc-500/70 border transition-all duration-200 focus:outline-none focus:ring-1 resize-y min-h-[140px] ${
                      errors.message
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500'
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-rose-400 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Row 4: Submit Button (Matching Figma Pill Design) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#1d61ef] hover:bg-blue-600 active:scale-95 text-white text-sm font-medium transition-all shadow-md disabled:opacity-60 disabled:pointer-events-none gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <span>{submitButtonLabel || 'Send message'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactFormBlockComponent
