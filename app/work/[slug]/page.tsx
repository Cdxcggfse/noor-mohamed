import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CaseStudyFilm from '@/components/CaseStudyFilm';
import {
  PROJECTS,
  getProjectBySlug,
  getProjectIndex,
  IMAGE_DIMENSIONS,
} from '@/data/projects';

interface CaseStudyPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return { title: 'Project not found — Nour Mohamed' };
  }

  return {
    title: `${project.title} — Nour Mohamed`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
    },
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-smoke/70">
        {label}
      </dt>
      <dd className="font-sans text-sm text-parchment leading-relaxed">{value}</dd>
    </div>
  );
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) notFound();

  const index = getProjectIndex(project.slug);
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];
  const gallery = project.galleryImages.filter((image) => image !== project.imageSrc);
  const heroDimension = IMAGE_DIMENSIONS[project.imageSrc];

  return (
    <main id="top" className="relative min-h-screen bg-ink text-parchment overflow-x-hidden selection:bg-gold/30 selection:text-parchment">
      <Nav />

      <article className="relative pt-32 sm:pt-40 pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-14">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-smoke hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All work
          </Link>

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium">
                {project.tag}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-parchment leading-[1.1] font-normal">
              {project.title}
            </h1>
            <p className="font-sans text-smoke text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </header>

          {/* ── Facts ──────────────────────────────────────────────────── */}
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-y border-gold/15 py-8 bg-gradient-to-b from-white/[0.02] to-transparent">
            {project.role && <Fact label="Role" value={project.role} />}
            {project.client && <Fact label="Client" value={project.client} />}
            {project.year && <Fact label="Year" value={project.year} />}
            {project.disciplines && project.disciplines.length > 0 && (
              <Fact label="Disciplines" value={project.disciplines.join(' · ')} />
            )}
            {project.tools && project.tools.length > 0 && (
              <Fact label="Tools" value={project.tools.join(' · ')} />
            )}
          </dl>

          {/* ── Hero Visual — film when present, else the full board ────── */}
          {project.videoSrc ? (
            <CaseStudyFilm
              src={project.videoSrc}
              poster={project.imageSrc}
              title={project.title}
              width={heroDimension?.width ?? 1024}
              height={heroDimension?.height ?? 576}
            />
          ) : heroDimension ? (
            <Image
              src={project.imageSrc}
              alt={`${project.title} — full project presentation`}
              width={heroDimension.width}
              height={heroDimension.height}
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="w-full h-auto rounded-2xl border border-gold/20 bg-plum shadow-stage"
            />
          ) : (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20 bg-plum">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1152px"
                className="object-cover object-center"
              />
            </div>
          )}

          {/* ── Narrative ──────────────────────────────────────────────── */}
          {(project.brief || project.approach || project.outcome) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {project.brief && (
                <section className="space-y-3">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-gold">
                    The brief
                  </h2>
                  <p className="font-sans text-smoke text-sm leading-relaxed">{project.brief}</p>
                </section>
              )}
              {project.approach && (
                <section className="space-y-3">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-gold">
                    Approach
                  </h2>
                  <p className="font-sans text-smoke text-sm leading-relaxed">
                    {project.approach}
                  </p>
                </section>
              )}
              {project.outcome && (
                <section className="space-y-3">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-gold">
                    Outcome
                  </h2>
                  <p className="font-sans text-smoke text-sm leading-relaxed">
                    {project.outcome}
                  </p>
                </section>
              )}
            </div>
          )}

          {/* ── Gallery — additional boards, uncropped ─────────────────── */}
          {gallery.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gold">Gallery</h2>
              <div className="space-y-8">
                {gallery.map((image) => {
                  const dimension = IMAGE_DIMENSIONS[image];
                  return dimension ? (
                    <Image
                      key={image}
                      src={image}
                      alt={`${project.title} — visual detail`}
                      width={dimension.width}
                      height={dimension.height}
                      sizes="(max-width: 1200px) 100vw, 1152px"
                      className="w-full h-auto rounded-xl border border-glass-border bg-plum"
                    />
                  ) : (
                    <div
                      key={image}
                      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-glass-border bg-plum"
                    >
                      <Image
                        src={image}
                        alt={`${project.title} — visual detail`}
                        fill
                        sizes="(max-width: 1200px) 100vw, 1152px"
                        className="object-cover object-center"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Footer Actions ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gold/15 pt-8">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-parchment transition-all duration-300 shadow-[0_0_25px_rgba(212,167,44,0.35)] hover:shadow-[0_0_40px_rgba(212,167,44,0.55)]"
            >
              View full project on Behance
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {nextProject.slug !== project.slug && (
              <Link href={`/work/${nextProject.slug}`} className="group sm:text-right">
                <span className="font-mono text-[10px] uppercase tracking-widest text-smoke/70 block">
                  Next project
                </span>
                <span className="font-display text-lg sm:text-xl text-parchment group-hover:text-gold transition-colors inline-flex items-center gap-2">
                  {nextProject.title}
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
