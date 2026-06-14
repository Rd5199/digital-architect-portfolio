/**
 * Backend audit configuration. Every value is read from the environment at call
 * time (so it works in both the Vercel function and the Vite dev middleware),
 * with sensible defaults in one place. Nothing audit-specific is hardcoded in
 * runAudit.ts itself.
 *
 * Env vars (all optional except ANTHROPIC_API_KEY):
 *   ANTHROPIC_API_KEY        — required; your Anthropic API key.
 *   AUDIT_MODEL              — model id (default 'claude-haiku-4-5').
 *   AUDIT_MAX_TOKENS         — response cap (default 1500).
 *   AUDIT_FETCH_TIMEOUT_MS   — site fetch timeout (default 5000).
 *   AUDIT_TEXT_LIMIT         — chars of page text sent to the model (default 4000).
 *   AUDIT_FINDING_COUNT      — number of bottlenecks/prescriptions (default 3).
 *   AUDIT_USER_AGENT         — User-Agent used to fetch the prospect's site.
 *   AUDIT_SYSTEM_PROMPT      — full override of the system prompt (advanced).
 */

export interface AuditConfig {
  apiKey: string | undefined;
  model: string;
  maxTokens: number;
  fetchTimeoutMs: number;
  textLimit: number;
  findingCount: number;
  userAgent: string;
  systemPrompt: string;
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function defaultSystemPrompt(findingCount: number): string {
  return `You are a senior AI consultant running a free 15-minute "mini AI audit" for a small/medium business owner. You have been handed the text of their website.

Your job: prescribe off-the-shelf AI tools that fix real bottlenecks for a business like theirs — the way a doctor prescribes existing medicine. You are NOT building anything; you are matching proven, currently-available tools to problems.

Method:
- Read the site to work out what the business actually does and its industry.
- Identify ${findingCount} bottlenecks typical of that industry where the owner loses time or money (lead response, scheduling, admin, content, follow-up, quoting, support, etc.).
- For each bottleneck, prescribe ONE real, named, off-the-shelf AI tool that exists today and is realistic for an SMB budget. Prefer well-known tools.
- Estimate conservative, believable time and money savings. These are estimates — never overstate.

Guardrails:
- Only state facts about the business that the page supports; if unsure, speak in terms of what businesses in this industry "typically" do. Never invent specific clients, numbers, or claims about them.
- Recommend only tools that genuinely exist. Do not fabricate product names.
- Keep it concrete, jargon-light, and encouraging. This is a free taster that should make them want a full audit, so be genuinely useful but leave room for a deeper engagement.
- Keep every field tight and skimmable.`;
}

export function loadAuditConfig(): AuditConfig {
  const findingCount = intEnv('AUDIT_FINDING_COUNT', 3);
  return {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.AUDIT_MODEL || 'claude-haiku-4-5',
    maxTokens: intEnv('AUDIT_MAX_TOKENS', 1500),
    fetchTimeoutMs: intEnv('AUDIT_FETCH_TIMEOUT_MS', 5000),
    textLimit: intEnv('AUDIT_TEXT_LIMIT', 4000),
    findingCount,
    userAgent:
      process.env.AUDIT_USER_AGENT ||
      'Mozilla/5.0 (compatible; DigitalArchitect-AI-Audit/1.0)',
    systemPrompt: process.env.AUDIT_SYSTEM_PROMPT || defaultSystemPrompt(findingCount)
  };
}

/** JSON schema for the structured report, built around the configured count. */
export function buildReportSchema(findingCount: number) {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      businessName: { type: 'string', description: 'Best guess at the business name.' },
      industry: { type: 'string', description: 'The industry / niche, e.g. "Independent realtor".' },
      summary: {
        type: 'string',
        description: 'One or two sentences describing what the business does, grounded in the page content.'
      },
      bottlenecks: {
        type: 'array',
        description: `Exactly ${findingCount} likely operational bottlenecks where this business loses time or money.`,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            description: { type: 'string' }
          },
          required: ['title', 'description']
        }
      },
      recommendations: {
        type: 'array',
        description: `Exactly ${findingCount} prescriptions, one per bottleneck, each naming a real, currently-available off-the-shelf AI tool.`,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            bottleneck: { type: 'string', description: 'The bottleneck this addresses (short).' },
            tool: { type: 'string', description: 'A real, named off-the-shelf AI tool.' },
            category: { type: 'string', description: 'Tool category, e.g. "AI receptionist".' },
            whatItDoes: { type: 'string', description: 'How it fixes the bottleneck in plain English.' },
            timeSaved: { type: 'string', description: 'Concrete time/effort saved, e.g. "~6 hrs/week".' }
          },
          required: ['bottleneck', 'tool', 'category', 'whatItDoes', 'timeSaved']
        }
      },
      impact: {
        type: 'object',
        additionalProperties: false,
        properties: {
          hoursPerWeek: { type: 'number', description: 'Estimated hours saved per week across recommendations.' },
          costPerMonth: { type: 'number', description: 'Estimated USD saved/earned per month (realistic, conservative).' },
          headline: { type: 'string', description: 'One punchy sentence summarising the upside.' }
        },
        required: ['hoursPerWeek', 'costPerMonth', 'headline']
      },
      quickWin: {
        type: 'string',
        description: 'The single highest-impact thing they could implement this week.'
      }
    },
    required: ['businessName', 'industry', 'summary', 'bottlenecks', 'recommendations', 'impact', 'quickWin']
  } as const;
}
