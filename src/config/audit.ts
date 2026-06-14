/**
 * Single source of truth for the Free AI Audit section.
 *
 * - `auditConfig`  — deployment values, all sourced from environment variables
 *                    (Vite `VITE_*`). Nothing deployment-specific lives in the
 *                    component.
 * - `auditContent` — every on-page string + the scan-stage list, so copy can be
 *                    edited here without touching the template.
 */

export interface ScanStage {
  label: string;
}

export const auditConfig = {
  /** Endpoint the form POSTs to. */
  endpoint: import.meta.env.VITE_AUDIT_ENDPOINT || '/api/audit',
  /** Scheduler link for the "Book a call" CTA; empty → scroll to #contact. */
  bookingUrl: import.meta.env.VITE_BOOKING_URL || '',
  /** Web3Forms access key for lead capture; empty → capture skipped. */
  web3formsKey: import.meta.env.VITE_WEB3FORMS_KEY || '',
  /** Dwell time per scanning stage (ms). */
  stageMs: Number(import.meta.env.VITE_AUDIT_STAGE_MS) || 850
};

export const auditContent = {
  badge: 'Free · No sign-up · Results in seconds',
  title: 'Get a Free AI Audit of Your Business',
  subtitle:
    'Drop in your website and our AI reviews your business the way a consultant would — spotting where you’re losing time and money, then prescribing the exact off-the-shelf AI tools that fix it.',

  form: {
    urlLabel: 'Your website',
    urlPlaceholder: 'yourbusiness.com',
    nameLabel: 'Business name',
    nameOptional: '(optional)',
    namePlaceholder: 'e.g. Maple Street Dental',
    emailLabel: 'Email',
    emailHint: '(for your report)',
    emailPlaceholder: 'you@company.com',
    submit: 'Run my free AI audit',
    fineprint: 'Takes ~10 seconds. We’ll never share your details.'
  },

  stages: [
    { label: 'Scanning your website' },
    { label: 'Identifying your industry' },
    { label: 'Mapping workflows & bottlenecks' },
    { label: 'Matching off-the-shelf AI tools' },
    { label: 'Estimating time & cost savings' },
    { label: 'Compiling your report' }
  ] as ScanStage[],

  report: {
    inferredNote:
      'We couldn’t fully read your live site, so this is based on your domain — a full audit on a call will be sharper.',
    statHoursUnit: 'hrs',
    statHoursLabel: 'saved / week',
    statCostUnit: '$',
    statCostLabel: 'value / month',
    bottlenecksTitle: 'What’s slowing you down',
    prescriptionsTitle: 'The AI tools we’d prescribe',
    rxFixesLabel: 'Fixes:',
    quickWinTag: 'Start here',
    ctaTitle: 'This was the free 10-second taster.',
    ctaBodyBefore: 'Your ',
    ctaBodyStrong: 'full custom AI audit is on us',
    ctaBodyAfter:
      ' — a deeper, hands-on review of your real workflows with a tailored roadmap. No charge, no obligation.',
    ctaBook: 'Book my free deep-dive',
    ctaReset: 'Audit another site',
    emailedPrefix: 'A copy is on its way to '
  },

  errors: {
    noUrl: 'Please enter your website address.',
    generic: 'We couldn’t complete your audit. Please try again.'
  },

  /** Subject prefix for the lead notification email. */
  leadSubjectPrefix: 'New AI Audit lead — '
};
