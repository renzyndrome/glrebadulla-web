// Experience and education, sourced from design/cv/. Most recent first.
// `period` strings contain em-dashes on purpose: they are fixed date-range
// design strings, the one exception to the no-em-dash copy rule.

export interface Role {
  period: string;
  role: string;
  org: string;
  orgNote?: string;
  note: string;
  stack: string;
}

export const roles: Role[] = [
  {
    period: '2024 — present',
    role: 'Senior Full Stack Developer',
    org: 'US-based Media Company',
    orgNote: 'remote',
    note: 'LLM features via the OpenAI API, retrieval pipelines, real-time analytics, social automation.',
    stack: 'Python · FastAPI · React · AWS',
  },
  {
    period: '2023 — 2024',
    role: 'Senior Full Stack Developer',
    org: 'Connect Psych Services',
    orgNote: 'remote',
    note: 'Telehealth platform with live chat, voice and video. Reported directly to stakeholders in two-week sprints.',
    stack: 'Django REST · React · Next.js · AWS',
  },
  {
    period: '2020 — 2023',
    role: 'Software Developer to Senior',
    org: 'LITS',
    orgNote: 'Philippines',
    note: 'Led the E-Legislative System for local government. Odoo CRM, Website and HRIS. Promoted for technical leadership.',
    stack: 'Django · React · Odoo · AWS',
  },
  {
    period: '2018 — 2019',
    role: 'Junior Software Engineer',
    org: 'Infoshift Inc.',
    orgNote: 'Philippines',
    note: 'Public developer APIs for one of the largest PH telecoms. Wrote the docs and onboarding guides external developers used.',
    stack: 'Flask · Node.js · AWS microservices',
  },
];

export const education = {
  period: '2013 — 2017',
  qualification: 'BS Information Technology',
  institution: 'Polytechnic University of the Philippines',
};
