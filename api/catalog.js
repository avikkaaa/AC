import formidable from 'formidable';
import fs from 'node:fs/promises';

export const config = { api: { bodyParser: false } };
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFiles: 1, maxFileSize: 8 * 1024 * 1024, filter: ({ mimetype }) => Boolean(mimetype?.startsWith('image/')) });
    form.parse(req, (error, fields, files) => error ? reject(error) : resolve({ fields, files }));
  });
}

function one(fields, key) {
  const v = fields?.[key];
  return String(Array.isArray(v) ? v[0] : v || '').trim();
}

function extractJson(text) {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

async function askGemini(contents) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: contents }],
      generationConfig: { temperature: 0.12, responseMimeType: 'application/json' }
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed.');
  return data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'AI cataloging is not configured. Add GEMINI_API_KEY to the server environment.' });

  try {
    const { fields, files } = await parseForm(req);
    const uploaded = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!uploaded?.filepath || !uploaded.mimetype?.startsWith('image/')) return res.status(400).json({ error: 'Please upload a valid image.' });

    const buyerCategory = one(fields, 'buyerCategory') || one(fields, 'craft') || 'General handmade marketplace';
    const profileCraft = one(fields, 'profileCraft');
    const profileMaterials = one(fields, 'profileMaterials');
    const profileLocation = one(fields, 'profileLocation');
    const profileExperience = one(fields, 'profileExperience');
    const typicalPrice = one(fields, 'typicalPrice');
    const artisanMaterials = one(fields, 'materials');
    const dimensions = one(fields, 'dimensions');
    const hours = one(fields, 'hours');

    const bytes = await fs.readFile(uploaded.filepath);
    const base64 = bytes.toString('base64');
    const prompt = `You are the AI cataloging and pricing assistant for Artisan Connect, an Indian artisan marketplace.

VISIBLE PRODUCT TASK
Analyze the uploaded product image carefully. Produce a concise market-ready listing based on visible evidence plus artisan-provided context below.
Never invent identity, provenance, certification, exact cultural origin, exact material, technique, age, or historical claims. If uncertain, put the field in needs_confirmation and use neutral wording.

ARTISAN CONTEXT — treat as user-provided, not visually verified:
- selected category/craft: ${buyerCategory}
- profile craft: ${profileCraft || 'not provided'}
- profile materials: ${profileMaterials || 'not provided'}
- product materials entered: ${artisanMaterials || 'not provided'}
- artisan location: ${profileLocation || 'not provided'}
- experience: ${profileExperience || 'not provided'}
- typical existing price range: ${typicalPrice || 'not provided'}
- product dimensions: ${dimensions || 'not provided'}
- labour time: ${hours || 'not provided'}

CATALOG QUALITY RULES
1. title: specific, buyer-friendly, 4-9 words, describe the actual visible object.
2. craft: use the most likely craft/category; if uncertain use the artisan-provided category and lower confidence.
3. description: 2-3 sentences covering object, visible design, likely use, finish/style. No fabricated heritage claims.
4. materials: prefer artisan-provided material context; otherwise infer only if visually obvious and flag it for confirmation.
5. technique: only name a technique when strongly supported; otherwise "Needs artisan confirmation".
6. tags: 6-10 useful marketplace search tags, specific rather than generic.
7. story: one short market-ready sentence, factual and non-invented.

PRICING RULES — INR
Estimate a realistic retail price, not an arbitrary round number. Use this evidence in order:
A. artisan's own typical price range if supplied,
B. visible complexity, apparent size/scale, finish, detail density and product type,
C. artisan-supplied materials, dimensions and labour time,
D. category-level Indian handmade retail positioning.
Do NOT pretend you checked live market prices. Do NOT overprice merely because an item is handmade.
Return a conservative low/high range plus one recommended_price_inr inside that range. If critical pricing inputs are missing, widen the range and reduce pricing_confidence.
If the artisan supplied a typical price range, keep the recommended price reasonably close unless the product clearly appears materially simpler or more complex.
Round recommended_price_inr sensibly: nearest ₹50 below ₹2,000; nearest ₹100 from ₹2,000-₹10,000; nearest ₹500 above ₹10,000.
pricing_reason must briefly explain the main pricing factors and mention uncertainty when relevant.

MARKET MATCH
Score fit to selected category from 0-100. This is an AI recommendation, not a guarantee.

Return ONLY valid JSON with exactly these fields:
title, craft, origin, materials, technique, description, story, tags, buyer_category, market_match_percentage, market_match_reason, market_match, confidence, needs_confirmation, estimated_price_min_inr, estimated_price_max_inr, recommended_price_inr, pricing_confidence, pricing_reason.

tags and needs_confirmation must be arrays of strings. confidence, pricing_confidence and market_match_percentage must be integers 0-100. Price fields must be integer INR values with no currency symbols.`;

    const output = await askGemini([
      { text: prompt },
      { inlineData: { mimeType: uploaded.mimetype, data: base64 } }
    ]);
    const result = extractJson(output);

    if (result.estimated_price_min_inr > result.estimated_price_max_inr) {
      [result.estimated_price_min_inr, result.estimated_price_max_inr] = [result.estimated_price_max_inr, result.estimated_price_min_inr];
    }
    result.recommended_price_inr = Math.max(
      Number(result.estimated_price_min_inr || 0),
      Math.min(Number(result.recommended_price_inr || 0), Number(result.estimated_price_max_inr || result.recommended_price_inr || 0))
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('Gemini catalog error:', error);
    return res.status(500).json({ error: 'AI catalog generation failed. Please try again.' });
  }
}
