import formidable from 'formidable';
import fs from 'node:fs/promises';

export const config = { api: { bodyParser: false } };

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 8 * 1024 * 1024,
      filter: ({ mimetype }) => Boolean(mimetype?.startsWith('image/'))
    });
    form.parse(req, (error, fields, files) => error ? reject(error) : resolve({ fields, files }));
  });
}

const one=(fields,key)=>String(Array.isArray(fields?.[key])?fields[key][0]:fields?.[key]||'').trim();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const roundPrice=n=>n<2000?Math.round(n/50)*50:n<10000?Math.round(n/100)*100:Math.round(n/500)*500;

function parseRange(text){
  const nums=String(text||'').match(/\d[\d,]*/g)?.map(x=>Number(x.replace(/,/g,''))).filter(Boolean)||[];
  if(!nums.length)return null;
  return nums.length===1?[Math.round(nums[0]*.8),Math.round(nums[0]*1.2)]:[Math.min(nums[0],nums[1]),Math.max(nums[0],nums[1])];
}

function fallbackResult(ctx){
  const craft=(ctx.craft||ctx.profileCraft||ctx.category||'Handcrafted artwork').trim();
  const materials=(ctx.materials||ctx.profileMaterials||'Needs artisan confirmation').trim();
  const table={
    madhubani:[1500,7500],warli:[1200,6000],pattachitra:[1800,8000],kalamkari:[1200,7000],phulkari:[1400,8500],dhokra:[2200,12000],pottery:[700,4500],weaving:[1800,15000],woodcraft:[1500,12000],jewellery:[700,6500],jewelry:[700,6500],'metal art':[1800,12000],sculpture:[1800,14000],bags:[700,4500],baskets:[500,3500],showpieces:[700,6000],attar:[500,3500]
  };
  const key=Object.keys(table).find(k=>craft.toLowerCase().includes(k));
  let [low,high]=parseRange(ctx.typicalPrice)||table[key]||[1000,6000];
  const hours=Number(ctx.hours||0);
  if(hours>0){const labour=hours*180;low=Math.max(low,labour*.9);high=Math.max(high,labour*1.8)}
  if(ctx.dimensions&&/(large|xl|60|70|80|90|100)/i.test(ctx.dimensions)) {low*=1.15;high*=1.3}
  low=roundPrice(low);high=roundPrice(Math.max(high,low+300));
  const recommended=roundPrice((low+high)/2);
  const title=`Handcrafted ${craft.replace(/\b(art|craft)\b/ig,'').trim()||'Artisan'} Piece`;
  return {
    title,craft,origin:ctx.location||'Needs artisan confirmation',materials,technique:'Needs artisan confirmation',
    description:`A handcrafted ${craft.toLowerCase()} piece prepared for marketplace listing. Confirm material, technique and dimensions before publishing for the most accurate catalog information.`,
    story:'Made by an independent artisan and prepared for direct buyer discovery.',
    tags:[craft,'handmade','artisan','India','craft','home decor'].filter(Boolean),
    buyer_category:ctx.category||craft,market_match_percentage:82,market_match_reason:`Strong category fit with ${craft}.`,market_match:'AI-assisted category match',confidence:68,
    needs_confirmation:['technique',...(materials==='Needs artisan confirmation'?['materials']:[])],
    estimated_price_min_inr:low,estimated_price_max_inr:high,recommended_price_inr:recommended,pricing_confidence:ctx.typicalPrice?82:(hours?76:64),
    pricing_reason:ctx.typicalPrice?'Anchored to the artisan’s existing price range, then adjusted conservatively for product complexity.':hours?'Estimated from category positioning and the supplied labour time; confirm material cost for a tighter price.':'Estimated from the craft category and typical handmade retail positioning; add dimensions, labour time and material details for a tighter price.',fallback:true
  };
}

function extractJson(text){
  const cleaned=String(text||'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim();
  return JSON.parse(cleaned);
}

async function askGemini(parts){
  const models=[process.env.GEMINI_MODEL,'gemini-2.5-flash','gemini-2.0-flash'].filter(Boolean);
  let lastError;
  for(const model of [...new Set(models)]){
    try{
      const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
        method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},
        body:JSON.stringify({contents:[{role:'user',parts}],generationConfig:{temperature:.1,responseMimeType:'application/json'}})
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data?.error?.message||`Gemini ${model} failed`);
      const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';
      if(text)return text;
    }catch(e){lastError=e}
  }
  throw lastError||new Error('No AI model returned a result');
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  try{
    const {fields,files}=await parseForm(req);
    const uploaded=Array.isArray(files.image)?files.image[0]:files.image;
    if(!uploaded?.filepath||!uploaded.mimetype?.startsWith('image/'))return res.status(400).json({error:'Please upload a valid image.'});

    const ctx={
      category:one(fields,'buyerCategory'),craft:one(fields,'craft'),materials:one(fields,'materials'),dimensions:one(fields,'dimensions'),hours:one(fields,'hours'),
      profileCraft:one(fields,'profileCraft'),profileMaterials:one(fields,'profileMaterials'),location:one(fields,'profileLocation'),experience:one(fields,'profileExperience'),typicalPrice:one(fields,'typicalPrice')
    };
    const fallback=fallbackResult(ctx);
    if(!process.env.GEMINI_API_KEY)return res.status(200).json(fallback);

    try{
      const bytes=await fs.readFile(uploaded.filepath);
      const prompt=`You are Artisan Connect's cataloging and pricing assistant for Indian handmade products. Analyze the uploaded product photo and combine visible evidence with artisan-provided context. Never invent provenance, artisan identity, certification, exact cultural origin, materials or technique. If uncertain, say "Needs artisan confirmation" and include the field in needs_confirmation.

Artisan context:
category: ${ctx.category||'not provided'}
profile craft: ${ctx.profileCraft||'not provided'}
materials entered: ${ctx.materials||ctx.profileMaterials||'not provided'}
location: ${ctx.location||'not provided'}
typical price: ${ctx.typicalPrice||'not provided'}
dimensions: ${ctx.dimensions||'not provided'}
hours to make: ${ctx.hours||'not provided'}

Return ONLY JSON with: title, craft, origin, materials, technique, description, story, tags, buyer_category, market_match_percentage, market_match_reason, market_match, confidence, needs_confirmation, estimated_price_min_inr, estimated_price_max_inr, recommended_price_inr, pricing_confidence, pricing_reason.
Use integer INR values. For pricing, prioritize artisan typical price, then labour time, apparent size/complexity, entered materials, and conservative Indian handmade retail positioning. Do not claim live market research. Keep recommended price inside the range.`;
      const output=await askGemini([{text:prompt},{inlineData:{mimeType:uploaded.mimetype,data:bytes.toString('base64')}}]);
      const result=extractJson(output);
      const low=Number(result.estimated_price_min_inr||fallback.estimated_price_min_inr),high=Number(result.estimated_price_max_inr||fallback.estimated_price_max_inr);
      result.estimated_price_min_inr=Math.min(low,high);
      result.estimated_price_max_inr=Math.max(low,high);
      result.recommended_price_inr=clamp(Number(result.recommended_price_inr||fallback.recommended_price_inr),result.estimated_price_min_inr,result.estimated_price_max_inr);
      return res.status(200).json(result);
    }catch(aiError){
      console.error('AI catalog fallback:',aiError);
      return res.status(200).json(fallback);
    }
  }catch(error){
    console.error('Catalog endpoint error:',error);
    return res.status(500).json({error:'Could not read the uploaded image. Please try another image.'});
  }
}
