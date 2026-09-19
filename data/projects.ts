export interface Project {
  id: number;
  slug: string;
  title: string;
  /** Shorter, cleaner title for cards and overlays; falls back to `title`. */
  displayTitle?: string;
  tag: string;
  url: string;
  description: string;
  imageSrc: string;
  galleryImages: string[];
  /** Optional film played on the case-study page, with the still as its poster. */
  videoSrc?: string;
  featured?: boolean;
  disciplines?: string[];
  tools?: string[];
  client?: string;
  year?: string;
  role?: string;
  brief?: string;
  approach?: string;
  outcome?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'naturlea-social-media-posts',
    title: '"Naturlea" Social Media Posts',
    displayTitle: 'Naturlea — Social Media',
    tag: 'Social',
    url: 'https://www.behance.net/gallery/233287217/Naturlea-Social-media-posts',
    description:
      'Organic botanical brand aesthetic with soft natural light, minimalist grid compositions, and earthy tones.',
    imageSrc: '/projects/Naturlea_Social_media_posts/image_1.jpg',
    galleryImages: [],
    featured: true,
    disciplines: ['Graphic Design', 'Social Media'],
    tools: ['Adobe Illustrator', 'Canva'],
    role: 'Graphic Designer',
    year: '2025',
  },
  {
    id: 2,
    slug: 'synthetic-dreams',
    title: 'Synthetic Dreams',
    displayTitle: 'Synthetic Dreams — AI Film',
    tag: 'AI & Film',
    url: 'https://www.behance.net/gallery/247782549/Synthetic-deams',
    description:
      'Surreal AI-driven visual exploration exploring light, dark atmospheres, and futuristic human forms.',
    imageSrc: '/projects/Synthetic_deams/image_1.png',
    galleryImages: [],
    videoSrc: '/projects/Synthetic_deams/film.mp4',
    featured: true,
    disciplines: ['AI Visuals', 'Film', 'Digital Art'],
    role: 'Graphic Designer',
    year: '2026',
  },
  {
    id: 3,
    slug: 'beora-brand-identity',
    title: '"BEORA" Brand Identity',
    tag: 'Branding',
    url: 'https://www.behance.net/gallery/233288455/BEORA-Brand-identity',
    description:
      'Modern luxury visual identity featuring refined typography, minimal geometry, and quiet elegance.',
    imageSrc: '/projects/BEORA_Brand_identity/image_1.jpg',
    galleryImages: [],
    disciplines: ['Brand Identity', 'Logo Design', 'Graphic Design'],
    tools: ['Adobe Illustrator'],
    role: 'Graphic Designer',
    year: '2025',
  },
  {
    id: 4,
    slug: 'birthday-magazine',
    title: 'Birthday Magazine',
    tag: 'Editorial',
    url: 'https://www.behance.net/gallery/233288821/Birthday-Magazine',
    description:
      'Custom editorial publication design blending personal storytelling, expressive layout, and editorial typography.',
    imageSrc: '/projects/Birthday_Magazine/image_1.jpg',
    galleryImages: [],
    disciplines: ['Editorial Design', 'Magazine Layout'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva'],
    role: 'Graphic Designer',
    year: '2025',
  },
  {
    id: 5,
    slug: 'graphic-t-shirt-collection-streetwear-concept',
    title: 'Graphic T-Shirt Collection — Streetwear Concept',
    tag: 'Apparel',
    url: 'https://www.behance.net/gallery/251604699/Graphic-T-Shirt-Collection-Streetwear-Concept',
    description:
      'High-contrast graphic apparel prints rooted in urban typography and tactile printmaking techniques.',
    imageSrc: '/projects/Graphic_T-Shirt_Collection__Streetwear_Concept/image_1.jpg',
    galleryImages: [],
    disciplines: ['T-Shirt Design', 'Illustration', 'Vector Art'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    role: 'Graphic Designer',
    year: '2026',
  },
  {
    id: 6,
    slug: 'notion-templates-digital-dashboards',
    title: 'Notion Templates & Digital Dashboards',
    tag: 'Branding',
    url: 'https://www.behance.net/gallery/233288187/Notion-templets',
    description:
      'Clean digital organization dashboards designed with aesthetic clarity and functional minimalism.',
    imageSrc: '/projects/Notion_templets/image_1.jpg',
    galleryImages: [],
    disciplines: ['Notion Templates', 'Visual Systems', 'Product Design'],
    tools: ['Adobe Illustrator', 'Notion'],
    role: 'Graphic Designer',
    year: '2025',
  },
];

export const PROJECT_CATEGORIES = [
  'All',
  'Branding',
  'Social',
  'AI & Film',
  'Editorial',
  'Apparel',
];

/** Natural dimensions of each project's full-size presentation board, so the
 *  case-study pages can render them uncropped instead of slicing them into
 *  fixed boxes. Add an entry whenever a new project board is added. */
export const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '/projects/Naturlea_Social_media_posts/image_1.jpg': { width: 1920, height: 3621 },
  '/projects/Synthetic_deams/image_1.png': { width: 1920, height: 1080 },
  '/projects/BEORA_Brand_identity/image_1.jpg': { width: 1920, height: 4204 },
  '/projects/Birthday_Magazine/image_1.jpg': { width: 1920, height: 8846 },
  '/projects/Graphic_T-Shirt_Collection__Streetwear_Concept/image_1.jpg': {
    width: 1920,
    height: 7551,
  },
  '/projects/Notion_templets/image_1.jpg': { width: 1920, height: 10662 },
};

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getProjectIndex(slug: string) {
  return PROJECTS.findIndex((project) => project.slug === slug);
}
