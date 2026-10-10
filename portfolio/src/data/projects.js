// Featured projects. All copy lives in the locale files under projects.items.*
export const projects = [
  {
    slug: 'kaboss-image',
    key: 'kabossImage',
    status: 'live',
    liveUrl: 'https://kabossimage.vercel.app/',
    repoUrl: 'https://github.com/HAJ-250/KABOSSInc',
    stack: ['React', 'NestJS', 'TypeScript'],
    image: '/images/projects/kaboss-image-1.jpg',
    featured: true,
  },
  {
    slug: 'umudugudu-management-system',
    key: 'umudugudu',
    status: 'prototype',
    liveUrl: null,
    repoUrl: 'https://github.com/HAJ-250/umudugudu-system',
    stack: ['PHP', 'HTML'],
    image: '/images/projects/umudugudu-management-system-1.jpg',
    featured: true,
  },
];

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);
