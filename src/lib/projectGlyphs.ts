/*
 * Original terminal commands for project cards — the owner's own illustrative
 * one-liners (no third-party data). Each card's banner is a single, centered
 * `$ command` on a dark inset "screen": minimal, and clearly a graphic rather
 * than descriptive text. No emoji, no icons (CLAUDE.md rule 6). The green `$`
 * is an allowed accent use.
 */

export type GlyphKey =
  | 'retrieval'
  | 'llm'
  | 'analytics'
  | 'telehealth'
  | 'api'
  | 'legislative'
  | 'terminal';

export const DEFAULT_GLYPH: GlyphKey = 'terminal';

/** Options for the Keystatic `icon` select (keep keys in sync with COMMANDS). */
export const GLYPH_OPTIONS: { label: string; value: GlyphKey }[] = [
  { label: 'Retrieval / RAG', value: 'retrieval' },
  { label: 'LLM / prompt', value: 'llm' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Telehealth', value: 'telehealth' },
  { label: 'API / carrier', value: 'api' },
  { label: 'Legislative / gov', value: 'legislative' },
  { label: 'Terminal (default)', value: 'terminal' },
];

/** The command shown after the `$` on each card's banner (no leading `$`). */
const COMMANDS: Record<GlyphKey, string> = {
  retrieval: 'rag "top regions?"',
  llm: 'llm draft --tone brief',
  analytics: 'dash --watch revenue',
  telehealth: 'book --with practitioner',
  api: 'curl /v1/sms/send',
  legislative: 'bill draft #204',
  terminal: 'whoami',
};

/** Return the command for `key`, falling back to the terminal default. */
export function getCommand(key: string | undefined): string {
  if (key && key in COMMANDS) return COMMANDS[key as GlyphKey];
  return COMMANDS[DEFAULT_GLYPH];
}
