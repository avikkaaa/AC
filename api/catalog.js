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
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
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
    const buyerCategory = String(Array.isArray(fields.buyerCategory) ? fields.buyerCategory[0] : fields.buyerCategory || '').trim();
    if (!uploaded?.filepath || !uploaded.mimetype?.startsWith('image/')) return res.status(400).json({ error: 'Please upload a valid image.' });
    if (!buyerCategory) return res.status(400).json({ error: 'Please select a buyer category.' });

    const bytes = await fs.readFile(uploaded.filepath);
    const base64 = bytes.toString('base64');
    const prompt = `You are the responsible cataloging assistant for Artisan Connect, an Indian multi-art marketplace.
The buyer category selected by the user is: ${buyerCategory}.
Analyze only what is reasonably visible in the uploaded artwork photograph.
Never invent the artisan's identity, exact origin, materials, cultural claims, provenance, technique, age, certification, or historical facts.
If a field cannot be established from the image, write exactly "Needs artisan confirmation".
The buyer category is a preference signal, not proof that the product belongs to that market.
Calculate an estimated market-match percentage from 0 to 100 based only on visible product characteristics and fit with the selected buyer category. Clearly label it as an AI recommendation, not a guarantee.
Return ONLY valid JSON with exactly these fields: title, craft, origin, materials, technique, description, story, tags, buyer_category, market_match_percentage, market_match_reason, market_match, confidence, needs_confirmation.
tags and needs_confirmation must be arrays of strings. market_match_percentage and confidence must be integers from 0 to 100.`;

    const output = await askGemini([
      { text: prompt },
      { inlineData: { mimeType: uploaded.mimetype, data: base64 } }
    ]);

    return res.status(200).json(extractJson(output));
  } catch (error) {
    console.error('Gemini catalog error:', error);
    return res.status(500).json({ error: 'AI catalog generation failed. Please try again.' });
  }
}
