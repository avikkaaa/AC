const clampText=(v,n=900)=>String(v||'').replace(/\s+/g,' ').trim().slice(0,n);
const xml=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));
function hash(s=''){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function fallbackSvg({name,type,category,description}){
  const seed=hash([name,type,category,description].join('|'));
  const palettes=[['#F7EFE6','#D7A97F','#A4472E','#4B3024'],['#F4E8D8','#C99669','#8A5034','#3D2A22'],['#F5EBDD','#D6B38D','#B45D3C','#4E3327'],['#F8F0E8','#D2A17C','#934C35','#442D24']];
  const p=palettes[seed%palettes.length];
  const title=xml((name||'Handmade artisan product').slice(0,42));
  const sub=xml((type||category||'Indian handcrafted piece').slice(0,48));
  const shape=seed%4;
  const object=shape===0?`<path d="M210 110h180l28 55-18 150H200l-18-150z" rx="28" fill="${p[1]}"/><path d="M240 145h120" stroke="${p[2]}" stroke-width="12" stroke-linecap="round" opacity=".65"/>`:shape===1?`<ellipse cx="300" cy="225" rx="125" ry="92" fill="${p[1]}"/><ellipse cx="300" cy="205" rx="90" ry="55" fill="${p[0]}"/><path d="M230 260q70 38 140 0" fill="none" stroke="${p[2]}" stroke-width="12" stroke-linecap="round"/>`:shape===2?`<rect x="195" y="105" width="210" height="220" rx="26" fill="${p[1]}"/><path d="M225 145l150 140M375 145L225 285" stroke="${p[2]}" stroke-width="10" opacity=".55"/>`:`<path d="M300 95c70 0 120 54 120 128 0 72-48 117-120 117s-120-45-120-117c0-74 50-128 120-128z" fill="${p[1]}"/><circle cx="300" cy="210" r="55" fill="${p[0]}"/><circle cx="300" cy="210" r="34" fill="${p[2]}" opacity=".65"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p[0]}"/><stop offset="1" stop-color="#ead7c3"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity=".16"/></filter></defs><rect width="600" height="420" fill="url(#g)"/><ellipse cx="300" cy="335" rx="165" ry="23" fill="#5b3a2d" opacity=".12"/><g filter="url(#s)">${object}</g><rect x="26" y="24" width="140" height="30" rx="15" fill="${p[2]}"/><text x="96" y="44" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#fff">GENERATED PREVIEW</text><rect x="28" y="350" width="544" height="50" rx="16" fill="#fff" opacity=".8"/><text x="48" y="371" font-family="Georgia,serif" font-size="17" font-weight="700" fill="${p[3]}">${title}</text><text x="48" y="390" font-family="Arial,sans-serif" font-size="11" fill="${p[3]}" opacity=".72">${sub}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function callGemini(model,prompt,version='v1'){
  const r=await fetch(`https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`,{
    method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE']}})
  });
  const data=await r.json();
  if(!r.ok)throw new Error(data?.error?.message||`${model} failed`);
  const image=(data?.candidates?.[0]?.content?.parts||[]).find(p=>p.inlineData?.data);
  if(!image?.inlineData?.data)throw new Error('Gemini returned no image');
  return {mimeType:image.inlineData.mimeType||'image/png',data:image.inlineData.data,model};
}
async function generateWithGemini(prompt){
  const models=[process.env.GEMINI_IMAGE_MODEL||'gemini-3.1-flash-image','gemini-2.5-flash-image'];
  let last;
  for(const model of [...new Set(models)]){
    for(const version of ['v1','v1beta']){
      try{return await callGemini(model,prompt,version)}catch(e){last=e}
    }
  }
  throw last||new Error('Gemini image generation failed');
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  let body={};
  try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{}
  const product={name:clampText(body.name,120),type:clampText(body.type,120),category:clampText(body.category,120),description:clampText(body.description,900)};
  if(!product.description)product.description=[product.name,product.type,product.category].filter(Boolean).join('. ');
  if(!product.description)return res.status(400).json({error:'Product description is required.'});
  const fallback=fallbackSvg(product);
  if(!process.env.GEMINI_API_KEY)return res.status(200).json({dataUrl:fallback,model:'description-preview',fallback:true});
  try{
    const prompt=`Create a realistic premium ecommerce product photograph for an Indian artisan marketplace. Show only the product: no people, hands, text, watermark, logo, labels or packaging text. Use soft natural studio lighting, a warm neutral handcrafted backdrop, accurate materials, believable proportions and a centered 4:3 marketplace composition. Product name: ${product.name||'Handmade artisan product'}. Product type: ${product.type||product.category||'Handmade craft'}. Product description: ${product.description}`;
    const image=await generateWithGemini(prompt);
    res.setHeader('Cache-Control','private, max-age=86400');
    return res.status(200).json({dataUrl:`data:${image.mimeType};base64,${image.data}`,model:image.model,fallback:false});
  }catch(error){
    console.error('Product image generation failed; using fallback:',error?.message||error);
    return res.status(200).json({dataUrl:fallback,model:'description-preview',fallback:true});
  }
}
