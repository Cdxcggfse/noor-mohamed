'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import GlowBackground from './GlowBackground';

export default function Experience() {
  const prefersReducedMotion = useReducedMotion();

  const timelineEvents = [
    {
      company: 'Pictures Studios Film',
      period: 'Sept 2025 – Apr 2026',
      role: 'Graphic Designer',
      highlights: [
        'Designed creative company profiles based on redefined briefs to enhance brand originality.',
        'Generated high-quality AI-based images and video assets aligned with storyboard concepts for advertising campaigns.',
        'Collaborated with production team to support visual scene development using AI tools and creative direction.',
        'Contributed to TV commercial graphic assets and AI-generated video content supporting brand messaging.',
        'Adapted design approaches across digital, video, and promotional formats under tight deadlines.',
      ],
    },
    {
      company: 'Freelance Graphic Designer',
      period: 'Mar 2025 – Present',
      role: 'Graphic Designer & Creative Direction',
      highlights: [
        'Designed social media posts, branding materials, and promotional visuals for diverse client portfolios.',
        'Worked directly with clients to translate ideas into clear, effective visual concepts.',
        'Managed multiple client projects simultaneously, conducting revisions tailored to specific target audiences.',
      ],
    },
  ];

  const education = [
    {
      institution: 'Technical Industrial Institute',
      degree: 'Diploma in Fashion Design Specialization: Pattern Making',
      period: 'Sept 2021 – Jul 2023',
      details: [
        'Specialized in pattern making, garment construction, and modifying garment patterns.',
        'Studied design fundamentals, fabric selection, color matching, and fashion illustration.',
      ],
    },
  ];

  const courses = [
    {
      name: 'CapCut Desktop and Mobile Mastery Course',
      provider: 'Udemy',
      date: 'Feb 2025',
    },
    {
      name: 'Adobe Photoshop from Beginner to Advanced',
      provider: 'Udemy',
      date: 'Mar 2024',
    },
    {
      name: 'Fashion Design for Beginners',
      provider: 'Almentor',
      date: 'Aug 2022',
    },
  ];

  return (
    <section
      id="experience"
      className="relative py-24 sm:py-32 lg:py-36 px-6 sm:px-8 lg:px-12 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="experience-heading"
    >
      {/* Background Radial Glow */}
      <GlowBackground position="top-right" opacity={0.14} size="lg" colorTheme="rose-blend" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
          <h2
            id="experience-heading"
            className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium"
          >
            05 / EXPERIENCE & CREDENTIALS
          </h2>
        </div>

        {/* Work Experience Vertical Timeline */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gold" />
            <h3 className="font-display text-2xl text-parchment font-normal">
              Professional Experience
            </h3>
          </div>

          <div className="relative pl-6 sm:pl-10 space-y-12 sm:space-y-16">
            {/* Glowing Connector Line */}
            <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-gold via-rose to-violet/40 rounded-full opacity-60 shadow-[0_0_12px_rgba(212,167,44,0.4)]" />

            {timelineEvents.map((item, index) => (
              <motion.div
                key={item.company}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.7,
                  delay: prefersReducedMotion ? 0 : index * 0.2,
                }}
                className="relative group"
              >
                {/* Glowing Marker Dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-ink border-2 border-gold flex items-center justify-center group-hover:border-rose transition-colors duration-300 shadow-[0_0_10px_rgba(212,167,44,0.6)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold group-hover:bg-rose transition-colors" />
                </div>

                {/* Timeline Card */}
                <div className="glass-panel glass-panel-hover spotlight rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/10 pb-4">
                    <div>
                      <h4 className="font-display text-xl sm:text-2xl text-parchment font-medium group-hover:text-gold transition-colors">
                        {item.company}
                      </h4>
                      <p className="font-mono text-xs text-gold uppercase tracking-wider mt-1">
                        {item.role}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-smoke/70 bg-plum px-3 py-1 rounded-full border border-gold/10 self-start sm:self-center shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {item.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 font-sans text-smoke text-sm sm:text-base leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-gold/70 shrink-0 mt-1" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education & Certified Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gold/15">
          {/* Education */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gold" />
              <h3 className="font-display text-2xl text-parchment font-normal">
                Education
              </h3>
            </div>

            {education.map((edu) => (
              <motion.div
                key={edu.institution}
                  initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.6 }}
                className="glass-panel glass-panel-hover spotlight rounded-2xl p-6 space-y-3"
              >
                <div className="flex justify-between items-start gap-2 border-b border-gold/10 pb-3">
                  <div>
                    <h4 className="font-display text-lg text-parchment font-medium">
                      {edu.degree}
                    </h4>
                    <p className="font-mono text-xs text-gold uppercase tracking-wider mt-0.5">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-smoke/70 bg-plum px-2.5 py-0.5 rounded-full border border-gold/10 shrink-0">
                    {edu.period}
                  </span>
                </div>
                <ul className="space-y-1.5 font-sans text-xs text-smoke">
                  {edu.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Certified Courses */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="font-display text-2xl text-parchment font-normal">
                Certifications & Courses
              </h3>
            </div>

            <div className="space-y-4">
              {courses.map((course, cIdx) => (
                <motion.div
                  key={course.name}
                initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                  viewport={{ once: true }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: cIdx * 0.1 }}
                  className="glass-panel glass-panel-hover spotlight rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-display text-base text-parchment font-medium">
                      {course.name}
                    </h4>
                    <p className="font-mono text-xs text-gold/80 uppercase tracking-wider">
                      {course.provider}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-smoke/70 bg-plum px-2.5 py-1 rounded-full border border-gold/10 shrink-0">
                    {course.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
