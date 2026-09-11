import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'node:fs/promises';

export const config = { api: { bodyParser: false } };
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFiles: 1, maxFileSize: 8 * 1024 * 1024, filter: ({ mimetype }) => Boolean(mimetype?.startsWith('image/')) });
    form.parse(req, (error, fields, files) => error ? reject(error) : resolve({ fields, files }));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'AI cataloging is not configured. Add OPENAI_API_KEY to the server environment.' });

  try {
    const { fields, files } = await parseForm(req);
    const uploaded = Array.isArray(files.image) ? files.image[0] : files.image;
    const buyerCategory = String(Array.isArray(fields.buyerCategory) ? fields.buyerCategory[0] : fields.buyerCategory || '').trim();
    if (!uploaded?.filepath || !uploaded.mimetype?.startsWith('image/')) return res.status(400).json({ error: 'Please upload a valid image.' });
    if (!buyerCategory) return res.status(400).json({ error: 'Please select a buyer category.' });

    const bytes = await fs.readFile(uploaded.filepath);
    const imageUrl = `data:${uploaded.mimetype};base64,${bytes.toString('base64')}`;

    const response = await client.responses.create({
      model: 'gpt-5.6-luna',
      input: [{ role: 'user', content: [
        { type: 'input_text', text: `You are the responsible cataloging assistant for Artisan Connect, an Indian multi-art marketplace.
The buyer category selected by the user is: ${buyerCategory}.
Analyze only what is reasonably visible in the uploaded artwork photograph.
Never invent the artisan's identity, exact origin, materials, cultural claims, provenance, technique, age, certification, or historical facts.
If a field cannot be established from the image, write exactly "Needs artisan confirmation".
The buyer category is a preference signal, not proof that the product belongs to that market.
Calculate an estimated market-match percentage from 0 to 100 based only on visible product characteristics and fit with the selected buyer category. Clearly label it as an AI recommendation, not a guarantee.
Explain briefly why the percentage was given and what could improve or reduce the fit.
Return concise tags and useful marketplace copy.` },
        { type: 'input_image', image_url: imageUrl }
      ] }],
      text: { format: { type: 'json_schema', name: 'artisan_catalog', strict: true, schema: {
        type: 'object', additionalProperties: false,
        properties: {
          title: { type: 'string' }, craft: { type: 'string' }, origin: { type: 'string' }, materials: { type: 'string' }, technique: { type: 'string' },
          description: { type: 'string' }, story: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } },
          buyer_category: { type: 'string' }, market_match_percentage: { type: 'integer', minimum: 0, maximum: 100 },
          market_match_reason: { type: 'string' }, market_match: { type: 'string' }, confidence: { type: 'integer', minimum: 0, maximum: 100 },
          needs_confirmation: { type: 'array', items: { type: 'string' } }
        },
        required: ['title','craft','origin','materials','technique','description','story','tags','buyer_category','market_match_percentage','market_match_reason','market_match','confidence','needs_confirmation']
      } } }
    });

    return res.status(200).json(JSON.parse(response.output_text));
  } catch (error) {
    console.error('AI catalog error:', error);
    return res.status(500).json({ error: 'AI catalog generation failed. Please try again.' });
  }
}
