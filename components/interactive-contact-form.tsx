'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export function InteractiveContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Job Opportunity / IT Role',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(personalInfo.links.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    try {
      const accessKey =
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '1a45fce7-c9e9-4e4d-b496-dc0e3c474fbd';

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name.trim(),
          email: formData.email.trim(),
          replyto: formData.email.trim(),
          subject: `[Portfolio] ${formData.subject || 'Inquiry'} - from ${formData.name.trim()}`,
          message: formData.message.trim(),
          from_name: `${formData.name.trim()} (via Portfolio Contact Form)`
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit inquiry.');
      }

      setStatus('success');
      setStatusMessage(`Thank you, ${formData.name.trim()}! Your message has been transmitted directly to Latch's inbox.`);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setStatus('error');
      setStatusMessage(
        err instanceof Error ? err.message : 'An error occurred while sending. Please use the direct email link below.'
      );
    }
  };

  const mailtoLink = `mailto:${personalInfo.links.email}?subject=${encodeURIComponent(
    formData.subject || 'Portfolio Inquiry'
  )}&body=${encodeURIComponent(
    `Hi Latch,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`
  )}`;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-5 mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Send a Direct Message
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Delivers straight to Latch&apos;s inbox. You will receive a prompt reply.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shrink-0"
          title="Copy email address"
        >
          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedEmail ? 'Email Copied!' : personalInfo.links.email}</span>
        </button>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
              Message Transmitted Successfully!
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1 max-w-md mx-auto">
              {statusMessage}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setFormData({
                  name: '',
                  email: '',
                  subject: 'Job Opportunity / IT Role',
                  message: ''
                });
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              Send Another Message
            </button>
            <a
              href={mailtoLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open In Mail Client
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-semibold">Unable to submit: </span>
                <span>{statusMessage}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe / Tech Recruiter"
                disabled={status === 'loading'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. recruiter@company.com"
                disabled={status === 'loading'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Subject / Inquiry Topic
            </label>
            <select
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              disabled={status === 'loading'}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all disabled:opacity-50"
            >
              <option value="Job Opportunity / IT Role">Job Opportunity (Full-Time / Junior Dev / QA)</option>
              <option value="Internship / OJT Inquiry">Internship / OJT Inquiry</option>
              <option value="Freelance Web Project">Freelance Web / Hardware Project</option>
              <option value="QA & Software Testing Consultation">QA & Software Testing Consultation</option>
              <option value="General Technical Inquiry">General Technical Inquiry</option>
              <option value="Others">Others (Please specify)</option>
            </select>
          </div>

          {formData.subject === 'Others' && (
            <div>
              <label htmlFor="customSubject" className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Specify Custom Topic / Subject <span className="text-rose-500">*</span>
              </label>
              <input
                id="customSubject"
                type="text"
                required
                placeholder="e.g. Speaking invitation, Hackathon collaboration, etc."
                onChange={(e) => setFormData({ ...formData, subject: e.target.value || 'Others' })}
                disabled={status === 'loading'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="message" className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
                Message <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-neutral-400">
                {formData.message.length} chars
              </span>
            </div>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message, project scope, job details, or question here..."
              disabled={status === 'loading'}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all resize-y disabled:opacity-50"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Prefer your mail client?{' '}
              <a
                href={mailtoLink}
                className="text-sky-600 dark:text-sky-400 font-medium underline hover:text-sky-500"
              >
                Send via Mail app
              </a>
            </p>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
