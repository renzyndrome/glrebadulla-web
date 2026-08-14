// The four-cell credibility strip. Exactly one entry is marked: LLM+RAG is the
// single data highlight on the page and the only place the accent appears here.

export interface Stat {
  value: string;
  caption: string;
  mark?: boolean;
}

export const stats: Stat[] = [
  { value: '9+', caption: 'years shipping software' },
  { value: '4', caption: 'industries: media, health, government, telecom' },
  {
    value: 'LLM+RAG',
    caption: 'integration and retrieval pipelines in production',
    mark: true,
  },
  { value: '100%', caption: 'remote with international teams since 2023' },
];
