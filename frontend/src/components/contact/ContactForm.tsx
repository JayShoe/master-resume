'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, User, Mail, MessageSquare, Briefcase, Calendar, CheckCircle, AlertCircle, Building, Clock, DollarSign } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  inquiryType: 'project' | 'collaboration' | 'hiring' | 'consulting' | 'speaking' | 'other';
  budget?: string;
  timeline?: string;
  message: string;
  consent: boolean;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<ContactFormData>({
    mode: 'onBlur',
    defaultValues: {
      inquiryType: 'project'
    }
  });

  const inquiryType = watch('inquiryType');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      // Simulate form submission (in real app, this would call an API)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'portfolio_website'
        }),
      });

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: 'Thank you for your message! I\'ll get back to you within 24 hours.'
        });
        reset();
        
        // Track form submission analytics (in real app)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submission', {
            event_category: 'contact',
            event_label: data.inquiryType,
          });
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again or contact me directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypeOptions = [
    { value: 'project', label: 'New Project', icon: Briefcase },
    { value: 'collaboration', label: 'Collaboration', icon: User },
    { value: 'hiring', label: 'Hiring Opportunity', icon: Briefcase },
    { value: 'consulting', label: 'Consulting', icon: MessageSquare },
    { value: 'speaking', label: 'Speaking Engagement', icon: Calendar },
    { value: 'other', label: 'Other', icon: MessageSquare },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Form Status */}
        {formStatus.type && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            borderRadius: '8px',
            border: formStatus.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
            background: formStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: formStatus.type === 'success' ? '#166534' : '#dc2626'
          }}>
            {formStatus.type === 'success' ? (
              <CheckCircle size={20} style={{ flexShrink: 0 }} />
            ) : (
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
            )}
            <p style={{ fontSize: '14px', margin: 0 }}>{formStatus.message}</p>
          </div>
        )}

        {/* Personal Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                type="text"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: `1px solid ${errors.name ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? '#fca5a5' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Your full name"
              />
            </div>
            {errors.name && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#dc2626' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: `1px solid ${errors.email ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#fca5a5' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#dc2626' }}>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Company and Subject */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>Company</label>
            <div style={{ position: 'relative' }}>
              <Building size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                {...register('company')}
                type="text"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Your company name"
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Subject <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                {...register('subject', {
                  required: 'Subject is required',
                  minLength: { value: 5, message: 'Subject must be at least 5 characters' }
                })}
                type="text"
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: `1px solid ${errors.subject ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.subject ? '#fca5a5' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="What's this about?"
              />
            </div>
            {errors.subject && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#dc2626' }}>
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        {/* Inquiry Type */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Type of Inquiry <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {inquiryTypeOptions.map(option => {
              const IconComponent = option.icon;
              const isSelected = inquiryType === option.value;
              return (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    border: `1px solid ${isSelected ? '#3b82f6' : '#d1d5db'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                >
                  <input
                    {...register('inquiryType', { required: 'Please select an inquiry type' })}
                    type="radio"
                    value={option.value}
                    style={{ display: 'none' }}
                  />
                  <IconComponent size={16} style={{ color: isSelected ? '#3b82f6' : '#6b7280' }} />
                  <span style={{ color: isSelected ? '#3b82f6' : '#374151' }}>{option.label}</span>
                </label>
              );
            })}
          </div>
          {errors.inquiryType && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#dc2626' }}>
              {errors.inquiryType.message}
            </p>
          )}
        </div>

        {/* Project Details (shown for project/consulting inquiries) */}
        {(inquiryType === 'project' || inquiryType === 'consulting') && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>Budget Range</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  zIndex: 1
                }} />
                <select
                  {...register('budget')}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '12px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                  <option value="discuss">Let's discuss</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>Timeline</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  zIndex: 1
                }} />
                <select
                  {...register('timeline')}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '12px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-plus-months">6+ months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Message <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <textarea
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 20, message: 'Message must be at least 20 characters' }
            })}
            rows={5}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.message ? '#fca5a5' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '120px',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              background: '#ffffff',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.message ? '#fca5a5' : '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Tell me about your project, timeline, and any specific requirements..."
          />
          {errors.message && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#dc2626' }}>
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Consent */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer'
          }}>
            <input
              {...register('consent', {
                required: 'Please agree to the terms to continue'
              })}
              type="checkbox"
              style={{
                marginTop: '2px',
                width: '16px',
                height: '16px',
                accentColor: '#3b82f6',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '13px',
              color: '#374151',
              lineHeight: '1.5'
            }}>
              I consent to having this website store my submitted information for the purpose of responding to my inquiry. 
              <span style={{ color: '#dc2626' }}>*</span>
            </span>
          </label>
          {errors.consent && (
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626' }}>
              {errors.consent.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: (!isValid || isSubmitting) ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: (!isValid || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: (!isValid || isSubmitting) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (!(!isValid || isSubmitting)) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(!isValid || isSubmitting)) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>

        <p style={{
          fontSize: '12px',
          textAlign: 'center',
          color: '#6b7280',
          margin: 0
        }}>
          I'll respond to all serious inquiries within 24 hours during business days.
        </p>
        {/* CSS Animation */}
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </form>
    </div>
  );
}