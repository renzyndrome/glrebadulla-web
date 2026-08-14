import { config, fields, collection } from '@keystatic/core';

// Local storage: the admin UI (dev only, at /keystatic) reads/writes content
// files directly in this repo. Commit the changes and Cloudflare rebuilds the
// static site. To later edit from a hosted admin, switch to GitHub storage:
//   storage: { kind: 'github', repo: 'renzyndrome/glrebadulla-web' }
// (that also requires the Cloudflare adapter + a GitHub App — see README).
export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'glrebadulla.dev' },
  },
  collections: {
    // Projects — data-only YAML files: src/content/projects/<slug>.yaml
    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      columns: ['name', 'order'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Name (kebab-case)',
            description: 'Shown as the card title, e.g. rag-analytics-assistant',
          },
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower shows first (impact order).',
          defaultValue: 10,
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        chips: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            ai: fields.checkbox({
              label: 'AI chip',
              description: 'Green-tint chip (AI/LLM tech). Leave off for neutral.',
              defaultValue: false,
            }),
          }),
          {
            label: 'Tech chips',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
        image: fields.text({
          label: 'Screenshot path (optional)',
          description:
            'Public path to an original, permission-cleared screenshot, e.g. /images/projects/foo.png. Leave empty for NDA work: the detail page then shows the NDA note instead.',
        }),
        content: fields.markdoc({
          label: 'Detail page content',
          description:
            'Long-form content shown on the project detail page (/projects/<slug>).',
          options: {
            image: {
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            },
          },
        }),
      },
    }),

    // Blog posts — Markdoc body + frontmatter: src/content/blog/<slug>.mdoc
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      columns: ['title', 'date'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
        }),
        summary: fields.text({
          label: 'Summary',
          description: 'One line shown in the blog list.',
          multiline: true,
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are excluded from the production build.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/blog',
              publicPath: '/images/blog/',
            },
          },
        }),
      },
    }),
  },
});
