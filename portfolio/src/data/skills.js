// Grouped skill chips — no proficiency scores, since none were provided.
// `translateItems: true` marks groups whose items are locale keys rather than literal tech names.
export const skillGroups = [
  { key: 'frontend', items: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS'] },
  { key: 'languages', items: ['JavaScript', 'PHP', 'Python', 'Dart'] },
  { key: 'tools', items: ['VS Code', 'Git', 'GitHub', 'Vercel'] },
  { key: 'projectStack', items: ['TypeScript', 'NestJS'] },
  {
    key: 'learning',
    translateItems: true,
    items: ['skills.learningItems.0', 'skills.learningItems.1'],
  },
];
