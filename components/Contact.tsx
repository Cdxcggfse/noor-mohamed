'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Download, Mail, Globe, Phone, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Branding',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const services = ['Branding', 'Social Media', 'AI Visuals & Video', 'Fashion & Apparel', 'Editorial'];

  const mailtoHref = `mailto:nm261897@gmail.com?subject=${encodeURIComponent(
    `Project inquiry — ${formData.service}`,
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\n\n${formData.message}`,
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('submitting');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, company: honeypot }),
      });

      if (res.ok) {
        setFormStatus('submitted');
        setStatusMessage('Your inquiry has been sent.');
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setFormStatus('error');
      setStatusMessage(data.error ?? 'Your message could not be sent.');
    } catch {
      setFormStatus('error');
      setStatusMessage('Your message could not be sent — please check your connection.');
    }
  };

  const contactLinks = [
    {
      id: 'email',
      label: 'Email',
      display: 'nm261897@gmail.com',
      href: 'mailto:nm261897@gmail.com',
      icon: Mail,
      external: false,
    },
    {
      id: 'phone',
      label: 'Phone / WhatsApp',
      display: '+20 106 483 5850',
      href: 'tel:+201064835850',
      icon: Phone,
      external: false,
    },
    {
      id: 'behance',
      label: 'Behance',
      display: 'behance.net/nourmohamed193',
      href: 'https://www.behance.net/nourmohamed193',
      icon: Globe,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative min-h-[90vh] py-28 sm:py-36 px-6 sm:px-8 lg:px-12 bg-ink flex items-center justify-center overflow-hidden border-t border-gold/10"
      aria-labelledby="contact-heading"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none z-0" />

      {/* Large Primary Glow Orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[750px] lg:w-[1000px] h-[480px] sm:h-[750px] lg:h-[1000px] rounded-full pointer-events-none z-0 blur-[160px]"
        style={{
          background:
            'radial-gradient(circle, rgba(212,167,44,0.28) 0%, rgba(201,123,114,0.18) 40%, rgba(91,58,102,0.12) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-12 sm:space-y-16">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-plum/80 border border-gold/20 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium">
            07 / SAY HELLO & START A PROJECT
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h2
          id="contact-heading"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.9, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl text-parchment font-normal tracking-tight leading-[1.1] text-center"
        >
          Say hello, or{' '}
          <span className="italic text-gold font-light">send a brief.</span>
        </motion.h2>

        {/* Grid Layout: Contact Info & Form */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.8 }}
            className="lg:col-span-5 space-y-8 text-left"
          >
            <p className="font-sans text-smoke text-base sm:text-lg leading-relaxed">
              Available for branding identity projects, social media campaigns, AI visual development, and fashion concept collaborations.
            </p>

            <div className="space-y-6">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-4 p-4 rounded-xl glass-panel glass-panel-hover spotlight border border-gold/15 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-plum border border-gold/20 flex items-center justify-center text-gold shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] text-gold/70 uppercase tracking-widest block">
                        {link.label}
                      </span>
                      <span className="font-sans text-sm sm:text-base text-parchment group-hover:text-gold transition-colors inline-flex items-center gap-1.5">
                        {link.display}
                        {link.external && <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />}
                      </span>
                    </div>
                  </a>
                );
              })}

              <div className="flex items-center gap-4 p-4 rounded-xl glass-panel border border-gold/10">
                <div className="w-10 h-10 rounded-full bg-plum border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-gold/70 uppercase tracking-widest block">
                    Availability
                  </span>
                  <span className="font-sans text-sm sm:text-base text-smoke">
                    Open to freelance & studio briefs
                  </span>
                </div>
              </div>
            </div>

            {/* Resume & Behance Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/Nour-Mohamed-CV.pdf"
                download="Nour-Mohamed-CV.pdf"
                className="sheen inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gold-sheen text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-all duration-500 ease-luxe shadow-[0_0_20px_rgba(212,167,44,0.35)] hover:shadow-[0_0_35px_rgba(212,167,44,0.5)]"
              >
                <Download className="w-3.5 h-3.5" />
                Download CV
              </a>
              <a
                href="https://www.behance.net/nourmohamed193"
                target="_blank"
                rel="noopener noreferrer"
                className="sheen inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-gold/30 text-parchment font-mono text-xs font-medium uppercase tracking-widest hover:border-gold hover:text-gold transition-all duration-500 ease-luxe backdrop-blur-sm bg-plum/20 hover:bg-plum/40"
              >
                Behance
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Glassmorphism Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.8, delay: 0.15 }}
            className="lg:col-span-7 glass-panel spotlight rounded-2xl p-6 sm:p-10 border border-gold/20 shadow-[0_0_40px_rgba(212,167,44,0.1)] text-left"
          >
            {formStatus === 'submitted' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,167,44,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl text-parchment font-medium">
                  Message Sent Successfully!
                </h3>
                <p className="font-sans text-sm text-smoke max-w-sm">
                  Thank you for reaching out. Nour will review your project details and get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setFormStatus('idle');
                    setStatusMessage('');
                    setHoneypot('');
                    setFormData({ name: '', email: '', service: 'Branding', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full border border-gold/30 font-mono text-xs text-gold uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-gold uppercase tracking-widest font-medium block">
                    PROJECT INQUIRY FORM
                  </span>
                  <h3 className="font-display text-2xl text-parchment font-normal">
                    Let&apos;s start a conversation.
                  </h3>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-mono text-xs text-smoke uppercase tracking-wider block">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Ahmed"
                      className="w-full px-4 py-3 rounded-xl bg-plum/70 border border-gold/15 text-parchment placeholder-smoke/50 font-sans text-sm focus:outline-none focus:border-gold focus:ring-0 focus:bg-plum focus:shadow-[0_0_0_1px_rgba(212,167,44,0.45),0_0_24px_-6px_rgba(212,167,44,0.45)] transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="font-mono text-xs text-smoke uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-plum/70 border border-gold/15 text-parchment placeholder-smoke/50 font-sans text-sm focus:outline-none focus:border-gold focus:ring-0 focus:bg-plum focus:shadow-[0_0_0_1px_rgba(212,167,44,0.45),0_0_24px_-6px_rgba(212,167,44,0.45)] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Service Pills Selection */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-smoke uppercase tracking-wider block">
                    Service Interest
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {services.map((srv) => (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => setFormData({ ...formData, service: srv })}
                        className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all ${
                          formData.service === srv
                            ? 'bg-gold text-ink font-semibold shadow-md'
                            : 'bg-plum/50 text-smoke border border-gold/10 hover:border-gold/30 hover:text-parchment'
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label htmlFor="message" className="font-mono text-xs text-smoke uppercase tracking-wider block">
                    Project Brief / Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your brand, goals, timeline, or visual ideas..."
                    className="w-full px-4 py-3 rounded-xl bg-plum/70 border border-gold/15 text-parchment placeholder-smoke/50 font-sans text-sm focus:outline-none focus:border-gold focus:ring-0 focus:bg-plum focus:shadow-[0_0_0_1px_rgba(212,167,44,0.45),0_0_24px_-6px_rgba(212,167,44,0.45)] transition-all duration-300 resize-none"
                  />
                </div>

                {/* Honeypot — invisible to humans, catches bots */}
                <input
                  type="text"
                  name="company"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only"
                />

                {/* Screen-reader status announcements */}
                <p aria-live="polite" className="sr-only">
                  {statusMessage}
                </p>

                {formStatus === 'error' && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose/40 bg-rose/10 p-4 space-y-2"
                  >
                    <p className="flex items-start gap-2 font-sans text-sm text-parchment">
                      <AlertCircle className="w-4 h-4 text-rose shrink-0 mt-0.5" />
                      <span>{statusMessage}</span>
                    </p>
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-2 pl-6 font-mono text-xs uppercase tracking-widest text-gold hover:text-parchment transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Send it as an email instead
                    </a>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 rounded-xl bg-gold-sheen text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-all duration-500 ease-luxe shadow-[0_0_25px_rgba(212,167,44,0.35)] hover:shadow-[0_0_45px_rgba(212,167,44,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 sheen"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
