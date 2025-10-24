// Vercel serverless function entry point with path reconstruction
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from "../server/app";

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Reconstruct the original path from Vercel's slug parameter
  const slug = Array.isArray(req.query.slug) ? req.query.slug : [req.query.slug || ''];
  const path = '/api/' + slug.filter(Boolean).join('/');
  
  // Override the url to match what Express expects
  req.url = path;
  
  // Pass to Express app
  return app(req as any, res as any);
}
