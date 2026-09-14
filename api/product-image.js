const clampText=(v,n=900)=>String(v||'').replace(/\s+/g,' ').trim().slice(0,n);
const esc=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));

function craftKey(product){
  const s=`${product.name} ${product.type} ${product.category} ${product.description}`.toLowerCase();
  const keys=['madhubani','warli','pattachitra','kalamkari','phulkari','dhokra','dokra','pottery','ceramic','terracotta','weaving','textile','embroidery','basket','bamboo','cane','wood','jewellery','jewelry','metal','painting'];
  return keys.find(k=>s.includes(k))||'indian-art';
}

function craftDirection(product){
  const key=craftKey(product);
  const guides={
    madhubani:'Authentic Mithila/Madhubani folk painting from Bihar on handmade paper or cloth. Dense double-line drawing, flat natural pigments, fish, peacock, lotus and floral motifs, intricate filled borders, visible brush and pigment texture.',
    warli:'Authentic Warli folk art from Maharashtra. White rice-paste geometric figures and village scenes on earthy red-ochre mud surface, handmade wall-painting texture, simple triangular bodies and traditional composition.',
    pattachitra:'Authentic Odisha Pattachitra on prepared cloth/patta. Strong black outlines, mineral reds, ochres and greens, ornate floral borders, stylized traditional motifs and visibly hand-painted finish.',
    kalamkari:'Authentic Kalamkari cotton from Andhra/Telangana. Hand-drawn or block-printed natural dyes, madder red, indigo, black and beige, flowing floral vines and narrative motifs with visible cotton weave.',
    phulkari:'Authentic Punjabi Phulkari embroidery. Handwoven fabric with vivid silk-thread geometric and floral embroidery, visible stitch texture, rich magenta, orange and gold accents.',
    dhokra:'Authentic Dhokra lost-wax metal craft from India. Hand-cast brass or bronze sculpture, warm aged patina, coiled-wire and dotted detailing, slightly irregular handmade casting.',
    dokra:'Authentic Dhokra lost-wax metal craft from India. Hand-cast brass or bronze sculpture, warm aged patina, coiled-wire and dotted detailing, slightly irregular handmade casting.',
    pottery:'Authentic Indian handmade pottery. Wheel-thrown or hand-shaped clay, warm fired tones, realistic clay texture, slight asymmetry and restrained folk decoration.',
    ceramic:'Indian studio ceramic craft. Hand-thrown form, artisan glaze, tactile clay body, imperfect rim and realistic glaze variation.',
    terracotta:'Authentic Indian terracotta craft. Warm red clay, realistic fired texture, hand-incised or painted regional motifs and natural imperfections.',
    weaving:'Authentic Indian handloom textile. Clearly visible woven fibres, natural cotton or wool texture, regional weave pattern, handmade selvedge and soft folds.',
    textile:'Authentic Indian handmade textile art. Visible fabric weave, hand-dyed or hand-embroidered surface, regional motif language and tactile fibres.',
    embroidery:'Authentic Indian hand embroidery. Clearly visible stitches, tactile thread texture, regional floral or geometric motifs and small handmade irregularities.',
    basket:'Authentic Indian natural-fibre basketry. Handwoven cane, grass or reed fibres with realistic strand texture, tight artisan weave and warm natural tones.',
    bamboo:'Authentic Indian bamboo or cane craft. Hand-cut woven strips, visible nodes and fibres, natural straw tones and handmade construction.',
    cane:'Authentic Indian cane craft. Handwoven cane strips with realistic fibre texture, natural warm tones and visible handmade construction.',
    wood:'Authentic Indian hand-carved woodcraft. Real hardwood grain, carved floral or geometric detailing, warm natural finish and subtle tool marks.',
    jewellery:'Authentic Indian artisan jewellery. Handcrafted brass or silver, traditional motifs, beads or stones, realistic metal texture and premium object photography.',
    jewelry:'Authentic Indian artisan jewellery. Handcrafted brass or silver, traditional motifs, beads or stones, realistic metal texture and premium object photography.',
    metal:'Authentic Indian handcrafted metal art. Cast or hammered brass/bell metal, regional motifs, realistic patina and artisan irregularities.',
    painting:'Authentic hand-painted Indian folk or contemporary artwork on real paper or canvas with visible pigment and brush texture, culturally grounded motifs, never a digital poster.',
    'indian-art':'Authentic handmade Indian artisan object or artwork with culturally grounded regional materials, motifs, visible handwork and realistic imperfections.'
  };
  return guides[key]||guides['indian-art'];
}

function neutralFallback(product){
  const title=esc((product.name||'Authentic Indian craft').slice(0,42));
  const type=esc((product.type||product.category||'Handmade Indian artwork').slice(0,50));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5ece2"/><stop offset="1" stop-color="#e4d0bc"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity=".13"/></filter></defs><rect width="600" height="420" fill="url(#bg)"/><rect x="88" y="58" width="424" height="250" rx="20" fill="#fff9f2" filter="url(#s)"/><rect x="110" y="80" width="380" height="206" rx="14" fill="#eadbc9"/><path d="M140 122h320M140 160h320M140 198h320M140 236h320" stroke="#b98f6b" stroke-width="2" opacity=".28"/><text x="300" y="172" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-weight="700" fill="#6a3e2c">Authentic Indian Craft</text><text x="300" y="204" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#7a6253">Generating realistic product photograph…</text><rect x="30" y="342" width="540" height="48" rx="14" fill="#fff" opacity=".9"/><text x="48" y="369" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#4a3025">${title}</text><text x="48" y="388" font-family="Arial,sans-serif" font-size="11" fill="#6f574a">${type}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function callGemini(model,prompt,version='v1beta'){
  const r=await fetch(`https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE']}})});
  const data=await r.json();
  if(!r.ok)throw new Error(data?.error?.message||`${model} failed`);
  const image=(data?.candidates?.[0]?.content?.parts||[]).find(p=>p.inlineData?.data);
  if(!image?.inlineData?.data)throw new Error('Gemini returned no image');
  return{mimeType:image.inlineData.mimeType||'image/png',data:image.inlineData.data,model};
}

async function generateWithGemini(prompt){
  const models=[process.env.GEMINI_IMAGE_MODEL||'gemini-3.1-flash-image','gemini-2.5-flash-image'];
  let last;
  for(const model of [...new Set(models)])for(const version of ['v1beta','v1']){try{return await callGemini(model,prompt,version)}catch(e){last=e}}
  throw last||new Error('Gemini image generation failed');
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{}
  const product={name:clampText(body.name,120),type:clampText(body.type,120),category:clampText(body.category,120),description:clampText(body.description,900)};
  if(!product.description)product.description=[product.name,product.type,product.category].filter(Boolean).join('. ');
  if(!product.description)return res.status(400).json({error:'Product description is required.'});
  const fallback=neutralFallback(product);
  if(!process.env.GEMINI_API_KEY)return res.status(200).json({dataUrl:fallback,model:'neutral-craft-placeholder',fallback:true});
  try{
    const prompt=`Create a PHOTOREALISTIC premium ecommerce product photograph of ONE authentic handmade Indian artisan product. ${craftDirection(product)} Product title: ${product.name||'Handmade Indian artwork'}. Product description: ${product.description}. The result must look like a real physical object photographed with a professional camera for a high-end Indian craft marketplace. Use soft natural daylight, a warm neutral lime-plaster, raw cotton, handmade paper or unfinished-wood backdrop appropriate to the item, subtle grounded shadow, accurate material texture, believable scale, tiny handmade imperfections, 50mm product photography and natural depth of field. Keep the product centered and fully visible in a clean 4:3 composition. STRICTLY FORBIDDEN: cartoon characters, animated creatures, fantasy animals, mascots, icons, vector art, stickers, illustration style, glossy CGI, 3D toy look, surreal objects, people, hands, text, labels, logos, watermark, collage or mockup. Preserve authentic regional Indian craft identity.`;
    const image=await generateWithGemini(prompt);
    res.setHeader('Cache-Control','private, max-age=86400');
    return res.status(200).json({dataUrl:`data:${image.mimeType};base64,${image.data}`,model:image.model,fallback:false,craft:craftKey(product)});
  }catch(error){
    console.error('Product image generation failed; using neutral placeholder:',error?.message||error);
    return res.status(200).json({dataUrl:fallback,model:'neutral-craft-placeholder',fallback:true,craft:craftKey(product)});
  }
}
