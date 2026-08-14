// Identity, contact and link data. Single source of truth for anything that
// appears in more than one place (nav wordmark, hero, contact, footer, meta).
// Facts here must match design/cv/ — see CLAUDE.md content rules.

export const profile = {
  name: 'Laurence Rebadulla',
  // Fixed string. Do not reword.
  title: 'Senior Software Engineer | AI Developer',
  location: 'Philippines',
  locationLong: 'Philippines · remote',
  timezone: 'UTC+8',
  shortLocale: 'PH · UTC+8',
  status: 'open to work',
  focus: 'LLM integration · RAG',
  shippingSince: '2017',
  email: 'glrebadulla@gmail.com',
  // No WhatsApp number here on purpose. Contact exposes public/wa-qr.png and
  // nothing else: no visible number, no wa.me link (a link would put the number
  // in the href and the browser status bar). The QR already encodes the target,
  // so it can be read back with any QR decoder if it ever needs regenerating.
  cv: {
    href: '/uploads/latest-cv.pdf',
    // Exact download filename, kept verbatim.
    downloadName:
      'Laurence Rebadulla - Senior Software Engineer AI Developer CV.pdf',
  },
} as const;

export interface ProfileLink {
  href: string;
  label: string;
}

export const links: ProfileLink[] = [
  { href: 'https://github.com/renzyndrome', label: 'github/renzyndrome' },
  {
    href: 'https://linkedin.com/in/laurencerebadulla',
    label: 'linkedin/laurencerebadulla',
  },
  { href: 'https://glrebadulla.dev', label: 'glrebadulla.dev' },
];

export interface Fact {
  key: string;
  value: string;
}

// Key/value rows for the hero index card, in display order.
export const heroFacts: Fact[] = [
  { key: 'status', value: profile.status },
  { key: 'location', value: profile.locationLong },
  { key: 'timezone', value: profile.timezone },
  { key: 'focus', value: profile.focus },
  { key: 'shipping since', value: profile.shippingSince },
];
