/**
 * POST /api/audit  — Vercel serverless function.
 * Body: { url: string, businessName?: string }
 * Returns: AuditReport (see api/lib/runAudit.ts)
 *
 * Requires the ANTHROPIC_API_KEY environment variable to be set in the Vercel
 * project (Settings → Environment Variables).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runAudit } from './lib/runAudit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const url = String(body.url || '').trim();
    const businessName = body.businessName ? String(body.businessName).trim() : undefined;

    if (!url) {
      return res.status(400).json({ error: 'Please provide your website URL.' });
    }

    const report = await runAudit({ url, businessName });
    // Cache nothing — every audit is fresh and lead-specific.
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error generating your audit.';
    const isConfig = /ANTHROPIC_API_KEY/.test(message);
    return res.status(isConfig ? 500 : 502).json({
      error: isConfig
        ? 'The audit service is not configured yet. Please try again shortly.'
        : message
    });
  }
}
