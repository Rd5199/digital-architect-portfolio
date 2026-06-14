/**
 * Free AI Audit — core logic.
 *
 * Acts as an AI "website reviewer": fetches the prospect's site, reads what the
 * business actually does, then prescribes off-the-shelf AI tools for the
 * bottlenecks a business in that industry typically has. Designed to run inside
 * an ~8s serverless budget, so it does ONE fast page fetch + ONE Claude call
 * with a structured-output schema — no agent loop, no web search round-trips.
 *
 * All tunable values (model, token cap, timeouts, finding count, system prompt)
 * live in ./auditConfig and come from environment variables — nothing is
 * hardcoded here.
 *
 * Shared by the Vercel function (api/audit.ts) and the local Vite dev
 * middleware (vite.config.ts) so both paths exercise the same real AI.
 */
import Anthropic from '@anthropic-ai/sdk';
import { loadAuditConfig, buildReportSchema } from './auditConfig.js';

export interface AuditInput {
  url: string;
  businessName?: string;
}

export interface Recommendation {
  bottleneck: string;
  tool: string;
  category: string;
  whatItDoes: string;
  timeSaved: string;
}

export interface AuditReport {
  businessName: string;
  industry: string;
  summary: string;
  bottlenecks: { title: string; description: string }[];
  recommendations: Recommendation[];
  impact: {
    hoursPerWeek: number;
    costPerMonth: number;
    headline: string;
  };
  quickWin: string;
  /** True when we could not read the live site and inferred from the domain. */
  inferred: boolean;
}

function normalizeUrl(raw: string): string {
  let u = (raw || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

function htmlToText(
  html: string,
  limit: number
): { title: string; description: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
  );
  const ogDescMatch = html.match(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i
  );

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: (titleMatch?.[1] || '').replace(/\s+/g, ' ').trim(),
    description: (descMatch?.[1] || ogDescMatch?.[1] || '').trim(),
    text: text.slice(0, limit)
  };
}

async function fetchSite(
  url: string,
  timeoutMs: number,
  textLimit: number,
  userAgent: string
): Promise<{ ok: boolean; title: string; description: string; text: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        // Identify politely; some hosts block unknown agents.
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!res.ok) return { ok: false, title: '', description: '', text: '' };
    const html = await res.text();
    const parsed = htmlToText(html, textLimit);
    return { ok: parsed.text.length > 0, ...parsed };
  } catch {
    return { ok: false, title: '', description: '', text: '' };
  } finally {
    clearTimeout(timer);
  }
}

export async function runAudit(input: AuditInput): Promise<AuditReport> {
  const cfg = loadAuditConfig();

  const url = normalizeUrl(input.url);
  if (!url) throw new Error('A website URL is required.');
  if (!cfg.apiKey) throw new Error('Server is missing ANTHROPIC_API_KEY.');

  const site = await fetchSite(url, cfg.fetchTimeoutMs, cfg.textLimit, cfg.userAgent);
  const domain = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  })();

  const client = new Anthropic({ apiKey: cfg.apiKey });

  const context = site.ok
    ? `Website: ${url}
Page title: ${site.title || '(none)'}
Meta description: ${site.description || '(none)'}
${input.businessName ? `Business name (provided): ${input.businessName}\n` : ''}
Page content (extracted):
"""
${site.text}
"""`
    : `Website: ${url} (the live page could not be read — infer from the domain and any provided name).
Domain: ${domain}
${input.businessName ? `Business name (provided): ${input.businessName}` : ''}`;

  const message = await client.messages.create({
    model: cfg.model,
    max_tokens: cfg.maxTokens,
    system: cfg.systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Run the mini AI audit for this business and return the structured report.\n\n${context}`
      }
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: buildReportSchema(cfg.findingCount) as unknown as Record<string, unknown>
      }
    }
  });

  const block = message.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error('The audit could not be generated. Please try again.');
  }

  const parsed = JSON.parse(block.text) as Omit<AuditReport, 'inferred'>;
  return { ...parsed, inferred: !site.ok };
}
