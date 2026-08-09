'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Eye, Layers, Grid } from 'lucide-react';
import GlowBackground from './GlowBackground';
import ProjectModal, { Project } from './ProjectModal';
import ArcCarousel from './ArcCarousel';

// ── Stable project data (defined outside component to prevent re-creation) ──
const ALL_PROJECTS: Project[] = [
  {
    id: 1,
    title: '"Naturlea" Social Media Posts',
    tag: 'Social',
    url: 'https://www.behance.net/gallery/233287217/Naturlea-Social-media-posts',
    description: 'Organic botanical brand aesthetic with soft natural light, minimalist grid compositions, and earthy tones.',
    imageSrc: '/projects/Naturlea_Social_media_posts_thumbnail.jpg',
    galleryImages: [
      '/projects/Naturlea_Social_media_posts_thumbnail.jpg',
      '/projects/Naturlea_Social_media_posts/image_1.jpg',
      '/projects/Naturlea_Social_media_posts/image_2.jpg',
    ],
    featured: true,
  },
  {
    id: 2,
    title: '"BEORA" Brand Identity',
    tag: 'Branding',
    url: 'https://www.behance.net/gallery/233288455/BEORA-Brand-identity',
    description: 'Modern luxury visual identity featuring refined typography, minimal geometry, and quiet elegance.',
    imageSrc: '/projects/BEORA_Brand_identity_thumbnail.jpg',
    galleryImages: [
      '/projects/BEORA_Brand_identity_thumbnail.jpg',
      '/projects/BEORA_Brand_identity/image_1.jpg',
      '/projects/BEORA_Brand_identity/image_2.jpg',
    ],
    featured: false,
  },
  {
    id: 3,
    title: 'Pictures Studios Film — TV Commercial & AI Visuals',
    tag: 'AI & Film',
    url: 'https://www.behance.net/nourmohamed193',
    description: 'AI-generated visual development, company profile design, and video concepts aligned with TV commercial storyboards.',
    imageSrc: '/projects/Synthetic_deams_thumbnail.png',
    galleryImages: [
      '/projects/Synthetic_deams_thumbnail.png',
      '/projects/Synthetic_deams/image_1.png',
      '/projects/Synthetic_deams/image_2.png',
    ],
    featured: true,
  },
  {
    id: 4,
    title: 'Birthday Magazine',
    tag: 'Editorial',
    url: 'https://www.behance.net/gallery/233288821/Birthday-Magazine',
    description: 'Custom editorial publication design blending personal storytelling, expressive layout, and editorial typography.',
    imageSrc: '/projects/Birthday_Magazine_thumbnail.jpg',
    galleryImages: [
      '/projects/Birthday_Magazine_thumbnail.jpg',
      '/projects/Birthday_Magazine/image_1.jpg',
      '/projects/Birthday_Magazine/image_2.jpg',
    ],
    featured: false,
  },
  {
    id: 5,
    title: 'Graphic T-Shirt Collection — Streetwear Concept',
    tag: 'Apparel',
    url: 'https://www.behance.net/gallery/251604699/Graphic-T-Shirt-Collection-Streetwear-Concept',
    description: 'High-contrast graphic apparel prints rooted in urban typography and tactile printmaking techniques.',
    imageSrc: '/projects/Graphic_T-Shirt_Collection_thumbnail.jpg',
    galleryImages: [
      '/projects/Graphic_T-Shirt_Collection_thumbnail.jpg',
      '/projects/Graphic_T-Shirt_Collection__Streetwear_Concept/image_1.jpg',
      '/projects/Graphic_T-Shirt_Collection__Streetwear_Concept/image_2.jpg',
    ],
    featured: false,
  },
  {
    id: 6,
    title: 'Synthetic Dreams',
    tag: 'AI & Film',
    url: 'https://www.behance.net/gallery/247782549/Synthetic-deams',
    description: 'Surreal AI-driven visual exploration exploring light, dark atmospheres, and futuristic human forms.',
    imageSrc: '/projects/Synthetic_deams_thumbnail.png',
    galleryImages: [
      '/projects/Synthetic_deams_thumbnail.png',
      '/projects/Synthetic_deams/image_1.png',
      '/projects/Synthetic_deams/image_2.png',
    ],
    featured: false,
  },
  {
    id: 7,
    title: 'Fashion Pattern & Silhouette Study',
    tag: 'Apparel',
    url: 'https://www.behance.net/nourmohamed193',
    description: 'Garment pattern drafting, technical illustration, and geometric silhouette structures from diploma practice.',
    imageSrc: '/projects/Graphic_T-Shirt_Collection_thumbnail.jpg',
    galleryImages: [
      '/projects/Graphic_T-Shirt_Collection_thumbnail.jpg',
      '/projects/Graphic_T-Shirt_Collection__Streetwear_Concept/image_1.jpg',
    ],
    featured: false,
  },
  {
    id: 8,
    title: 'Notion Templates & Digital Dashboards',
    tag: 'Branding',
    url: 'https://www.behance.net/gallery/233288187/Notion-templets',
    description: 'Clean digital organization dashboards designed with aesthetic clarity and functional minimalism.',
    imageSrc: '/projects/Notion_templets_thumbnail.jpg',
    galleryImages: [
      '/projects/Notion_templets_thumbnail.jpg',
      '/projects/Notion_templets/image_1.jpg',
      '/projects/Notion_templets/image_2.jpg',
    ],
    featured: false,
  },
];

export default function Work() {
  const prefersReducedMotion = useReducedMotion();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');

  // ── Stable filtered list — only recomputes when category changes ────────
  const filteredProjects = useMemo(
    () =>
      selectedCategory === 'All'
        ? ALL_PROJECTS
        : ALL_PROJECTS.filter(
            (p) => p.tag.toLowerCase() === selectedCategory.toLowerCase(),
          ),
    [selectedCategory],
  );

  const categories = ['All', 'Branding', 'Social', 'AI & Film', 'Editorial', 'Apparel'];

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };


  return (
    <section
      id="work"
      className="relative py-24 sm:py-32 lg:py-36 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="work-heading"
    >
      {/* Background Radial Glow */}
      <GlowBackground position="top-left" opacity={0.15} size="xl" colorTheme="violet-blend" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gold/15 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
              <h2
                id="work-heading"
                className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium"
              >
                03 / SELECTED WORK & CASE STUDIES
              </h2>
            </div>
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-parchment font-normal">
              Form, light, and visual direction.
            </p>
          </div>

          {/* View Mode Toggle Switch (3D Arc vs Grid) */}
          <div className="flex items-center gap-2 self-start md:self-end bg-plum/60 p-1.5 rounded-full border border-gold/20 backdrop-blur-md">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                viewMode === '3d'
                  ? 'bg-gold text-ink font-semibold shadow-md'
                  : 'text-smoke hover:text-parchment'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              3D Arc View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gold text-ink font-semibold shadow-md'
                  : 'text-smoke hover:text-parchment'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Grid View
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 shrink-0 ${
                selectedCategory === cat
                  ? 'bg-plum text-gold border border-gold/40 shadow-[0_0_15px_rgba(212,167,44,0.2)]'
                  : 'bg-ink/60 text-smoke border border-glass-border hover:border-gold/20 hover:text-parchment'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Rendering */}
        {viewMode === '3d' ? (
          /* 3D Half-Circular Arc Widget Showcase */
          <ArcCarousel
            projects={filteredProjects}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        ) : (
          /* Asymmetric Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-4">
            {filteredProjects.map((project, index) => {
              const isFeatured = project.featured;
              const hasError = imageErrors[project.id];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.8,
                    delay: prefersReducedMotion ? 0 : (index % 2) * 0.15,
                  }}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-glass-border hover:border-gold/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,167,44,0.18)] cursor-pointer ${
                    isFeatured ? 'md:col-span-2 min-h-[460px] lg:min-h-[540px]' : 'min-h-[400px] lg:min-h-[460px]'
                  }`}
                >
                  {/* Visual Container */}
                  <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[380px] bg-plum/60 overflow-hidden">
                    {!hasError ? (
                      <Image
                        src={project.imageSrc}
                        alt={`${project.title} — ${project.description}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1000px"
                        className="object-cover object-center filter grayscale contrast-[0.92] brightness-[0.88] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700 ease-out group-hover:scale-[1.03]"
                        onError={() => handleImageError(project.id)}
                      />
                    ) : (
                      /* Artistic Dark Frame Fallback */
                      <div className="absolute inset-0 bg-gradient-to-br from-plum via-ink to-plum flex flex-col justify-between p-8 border-b border-gold/10">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-xs text-gold uppercase tracking-widest">
                            {project.tag}
                          </span>
                          <ArrowUpRight className="w-5 h-5 text-smoke group-hover:text-gold transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <span className="font-display text-2xl sm:text-3xl text-parchment font-medium italic group-hover:text-gold transition-colors">
                            {project.title}
                          </span>
                          <p className="font-sans text-xs text-smoke line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Tag Pill */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-block px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-gold/20 font-mono text-[11px] uppercase tracking-widest text-gold shadow-md">
                        {project.tag}
                      </span>
                    </div>

                    {/* Quick View & External Link Buttons */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-gold/20 font-mono text-[10px] uppercase tracking-widest text-parchment opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-3 h-3 text-gold" />
                        Quick View
                      </span>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-ink/80 backdrop-blur-md border border-gold/20 flex items-center justify-center text-smoke hover:text-gold hover:border-gold transition-all duration-300 transform hover:scale-110"
                        title="Open on Behance"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Card Info Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow bg-plum/30">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl sm:text-2xl text-parchment font-medium group-hover:text-gold transition-colors duration-300">
                        {project.title}
                      </h3>
                      <span className="font-mono text-xs text-gold/70 shrink-0 uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                        Preview →
                      </span>
                    </div>
                    <p className="font-sans text-smoke text-xs sm:text-sm leading-relaxed mt-2">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Lightbox Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
