const money=n=>`₹${Number(n||0).toLocaleString('en-IN')}`;

function profile(){
  try{return JSON.parse(localStorage.getItem('ac-artisan-profile')||'{}')}catch{return{}}
}

function setValue(el,value){
  if(!el||value==null||value==='')return;
  const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
  const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;
  setter?setter.call(el,String(value)):el.value=String(value);
  el.dispatchEvent(new Event('input',{bubbles:true}));
  el.dispatchEvent(new Event('change',{bubbles:true}));
}

function findAddForm(){
  return [...document.querySelectorAll('form.seller-form')].find(f=>f.querySelector('input[type="file"][accept*="image"]')&&f.querySelector('input[name="title"]'));
}

function enhance(){
  const form=findAddForm();
  if(!form||form.dataset.aiCatalogEnhanced)return false;
  form.dataset.aiCatalogEnhanced='1';

  const grid=form.querySelector('.form-grid');
  if(grid&&!form.querySelector('[name="dimensions"]')){
    const dimensions=document.createElement('label');
    dimensions.innerHTML='Dimensions / size <input name="dimensions" placeholder="e.g. 30 × 20 cm" />';
    const hours=document.createElement('label');
    hours.innerHTML='Hours to make <input name="hours" inputmode="decimal" placeholder="e.g. 6" />';
    grid.append(dimensions,hours);
  }

  const box=document.createElement('div');
  box.className='ac-ai-catalog-box';
  box.innerHTML=`<div><strong>✦ AI catalog + smart pricing</strong><small>Upload a clear product photo, then generate a title, craft, description and estimated price.</small></div><button type="button" class="btn secondary ac-ai-generate">Generate with AI</button><div class="ac-ai-result" hidden></div>`;
  const upload=form.querySelector('.artwork-upload');
  upload?.insertAdjacentElement('afterend',box);

  const button=box.querySelector('.ac-ai-generate');
  const result=box.querySelector('.ac-ai-result');
  button.addEventListener('click',async()=>{
    const file=form.querySelector('input[type="file"]')?.files?.[0];
    if(!file){result.hidden=false;result.innerHTML='<b>Add a product photo first.</b>';return}
    button.disabled=true;button.textContent='Analyzing photo…';
    result.hidden=false;result.innerHTML='<span>AI is reading the product and estimating a price…</span>';
    try{
      const p=profile(),fd=new FormData();
      fd.append('image',file);
      fd.append('buyerCategory',form.elements.craft?.value||p.craft||'');
      fd.append('craft',form.elements.craft?.value||'');
      fd.append('materials',form.elements.materials?.value||'');
      fd.append('dimensions',form.elements.dimensions?.value||'');
      fd.append('hours',form.elements.hours?.value||'');
      fd.append('profileCraft',p.craft||'');
      fd.append('profileMaterials',p.materials||'');
      fd.append('profileLocation',p.location||'');
      fd.append('profileExperience',p.experience||'');
      fd.append('typicalPrice',p.price||'');
      const r=await fetch('/api/catalog',{method:'POST',body:fd});
      const raw=await r.text();
      let d={};try{d=raw?JSON.parse(raw):{}}catch{}
      if(!r.ok)throw new Error(d.error||'AI cataloging failed');

      setValue(form.elements.title,d.title);
      setValue(form.elements.craft,d.craft);
      setValue(form.elements.materials,Array.isArray(d.materials)?d.materials.join(', '):d.materials);
      setValue(form.elements.description,d.description);
      if(Number(d.recommended_price_inr)>0)setValue(form.elements.price,money(d.recommended_price_inr));

      const low=Number(d.estimated_price_min_inr||0),high=Number(d.estimated_price_max_inr||0),rec=Number(d.recommended_price_inr||0);
      result.innerHTML=`<div class="ac-ai-price"><span>AI recommended price</span><strong>${rec?money(rec):'Needs more details'}</strong>${low&&high?`<small>Estimated range ${money(low)} – ${money(high)}</small>`:''}</div><p>${d.pricing_reason||'Price estimated from the product image and artisan-provided details.'}</p><div class="ac-ai-meta"><span>Catalog confidence: ${Number(d.confidence||0)}%</span><span>Pricing confidence: ${Number(d.pricing_confidence||0)}%</span><span>Market match: ${Number(d.market_match_percentage||0)}%</span></div>${Array.isArray(d.tags)&&d.tags.length?`<small>Tags: ${d.tags.join(' · ')}</small>`:''}`;
      form.dataset.aiCatalog=JSON.stringify(d);
    }catch(err){result.innerHTML=`<b>${String(err.message||'AI cataloging failed. Please try again.')}</b>`}
    finally{button.disabled=false;button.textContent='Regenerate with AI'}
  });
  return true;
}

const style=document.createElement('style');
style.textContent=`.ac-ai-catalog-box{margin:14px 0 18px;padding:14px;border:1px solid rgba(164,71,46,.22);border-radius:16px;background:rgba(164,71,46,.055);display:grid;gap:10px}.ac-ai-catalog-box>div:first-child{display:flex;flex-direction:column;gap:4px}.ac-ai-catalog-box small{color:#735a4c}.ac-ai-result{padding:12px;border-radius:12px;background:#fffaf2;display:grid;gap:8px}.ac-ai-price{display:flex;flex-direction:column;gap:2px}.ac-ai-price strong{font:700 24px Georgia,serif;color:var(--rust,#a4472e)}.ac-ai-meta{display:flex;gap:8px;flex-wrap:wrap}.ac-ai-meta span{font-size:11px;font-weight:700;padding:5px 8px;border-radius:999px;background:rgba(164,71,46,.08)}`;
document.head.appendChild(style);

enhance();
const obs=new MutationObserver(()=>enhance());
obs.observe(document.body,{childList:true,subtree:true});
