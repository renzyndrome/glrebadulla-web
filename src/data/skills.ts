// Capabilities, sourced from design/cv/. The AI/LLM group is deliberately
// separate from `skillGroups`: it gets the one raised panel treatment on the
// page because it is the lead differentiator. Everything else is a flat row.

export interface SkillGroup {
  name: string;
  note?: string;
  items: string[];
}

export const aiGroup = {
  label: 'ai / llm',
  status: 'primary focus · running in production',
  headline: 'LLM features that answer from your own data.',
  blurb:
    'RAG pipelines and OpenAI features that answer from your data instead of guessing. Already running in tools a content team uses every day.',
  // The retrieval path, drawn as a hairline rail with five nodes.
  pipeline: ['question', 'embed', 'retrieve', 'ground', 'answer'],
  pipelineCaption:
    "The retrieval path behind those features. OpenAI embeddings build the index, LangChain orchestrates the lookup, and every answer is tied back to the company's own records.",
  items: [
    'OpenAI API',
    'embeddings + retrieval (RAG)',
    'LangChain',
    'Claude Code',
  ],
} as const;

export const skillGroups: SkillGroup[] = [
  {
    name: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    name: 'Backend',
    note: 'APIs that hold up under real load',
    items: [
      'Django',
      'DRF',
      'FastAPI',
      'Flask',
      'Node.js',
      'Celery',
      'Redis',
      'REST design',
    ],
  },
  {
    name: 'Frontend',
    note: 'typed React interfaces that load fast',
    items: [
      'React',
      'Next.js',
      'TanStack Start',
      'TanStack Router',
      'TanStack Query',
      'Vite',
    ],
  },
  {
    name: 'Cloud, DevOps',
    note: 'deployed, monitored and scaled',
    items: [
      'AWS EC2',
      'S3',
      'Lambda',
      'RDS',
      'API Gateway',
      'CloudWatch',
      'Docker',
      'Linux',
      'CI/CD',
      'Cloudflare Workers + R2',
      'DigitalOcean',
      'Linode',
    ],
  },
  {
    name: 'Databases',
    note: 'the right store for the job',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Supabase'],
  },
  {
    name: 'Also',
    note: 'shipped with, still useful',
    items: ['Dart/Flutter', 'Odoo', 'Microsoft Dynamics 365', 'Agile/Scrum'],
  },
];
