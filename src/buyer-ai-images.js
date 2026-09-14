const memoryCache=new Map();
const pending=new Map();
let active=0;
const queue=[];
const MAX_ACTIVE=1;

function keyFor(item){return String(item?.id||item?.name||'product')}
function descriptionFor(item){return [item?.name,item?.type,item?.category,item?.description].filter(Boolean).join('. ')}
function hash(s=''){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function escXml(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]))}
function craftKind(item){const s=descriptionFor(item).toLowerCase();if(s.includes('madhubani'))return'madhubani';if(s.includes('warli'))return'warli';if(s.includes('pattachitra'))return'pattachitra';if(s.includes('kalamkari'))return'kalamkari';if(s.includes('phulkari')||s.includes('embroider'))return'embroidery';if(s.includes('dhokra')||s.includes('dokra')||s.includes('metal'))return'metal';if(s.includes('pottery')||s.includes('ceramic')||s.includes('terracotta'))return'pottery';if(s.includes('weav')||s.includes('textile')||s.includes('rug'))return'textile';if(s.includes('basket')||s.includes('bamboo')||s.includes('cane'))return'basket';if(s.includes('wood'))return'wood';if(s.includes('jewel'))return'jewellery';return'art'}
function instantPreview(item){
  const text=descriptionFor(item),seed=hash(text),kind=craftKind(item),title=escXml((item?.name||'Handmade product').slice(0,34));
  const palettes={madhubani:['#f3dfbf','#111','#c43f2f','#1f6b56'],warli:['#8f3f2f','#f8f1df','#5c241d','#f5dfb7'],pattachitra:['#f5d9a4','#1b1712','#b8322d','#d9a514'],kalamkari:['#ead7bb','#7b2e2a','#24485a','#b88b35'],embroidery:['#7d1731','#f3b64a','#e45b5b','#f7e2b5'],metal:['#5b4636','#b88137','#d5a94e','#2c2119'],pottery:['#d8aa78','#9b5036','#f0d7b7','#5f392b'],textile:['#d8c3a5','#8e3b2f','#294b5f','#d29b3a'],basket:['#d9bd8b','#9a6a35','#f2e4c8','#5c432a'],wood:['#c38a57','#6e4227','#e8caa7','#41291d'],jewellery:['#e8d1a2','#b47a23','#6b3f26','#f3e2b8'],art:['#ead7c0','#a4472e','#5b3a2d','#d6a35f']};
  const p=palettes[kind]||palettes.art;
  const motifs={
    madhubani:`<rect x="170" y="80" width="260" height="240" rx="8" fill="${p[0]}" stroke="${p[1]}" stroke-width="6"/><circle cx="300" cy="198" r="66" fill="none" stroke="${p[2]}" stroke-width="9"/><path d="M300 132c28 20 40 45 0 67-40-22-28-47 0-67zm0 67c35 9 51 32 19 64-42-6-47-31-19-64zm0 0c-35 9-51 32-19 64 42-6 47-31 19-64z" fill="${p[3]}" stroke="${p[1]}" stroke-width="4"/><path d="M190 105h220M190 295h220" stroke="${p[1]}" stroke-width="5" stroke-dasharray="9 8"/>`,
    warli:`<rect x="160" y="76" width="280" height="245" rx="8" fill="${p[0]}"/><g stroke="${p[1]}" stroke-width="6" fill="none" stroke-linecap="round"><circle cx="300" cy="140" r="18"/><path d="M300 158l-26 48h52zM300 206l-28 52M300 206l28 52M274 185l-42 30M326 185l42 30"/><path d="M205 270q95-62 190 0M190 105h220"/></g>`,
    pattachitra:`<rect x="165" y="76" width="270" height="245" rx="8" fill="${p[0]}" stroke="${p[1]}" stroke-width="8"/><ellipse cx="300" cy="195" rx="76" ry="92" fill="${p[2]}" stroke="${p[1]}" stroke-width="7"/><path d="M245 125q55 50 110 0M235 275q65-52 130 0" fill="none" stroke="${p[3]}" stroke-width="12"/><circle cx="300" cy="195" r="25" fill="${p[3]}"/>`,
    kalamkari:`<path d="M180 92h240v220H180z" fill="${p[0]}"/><path d="M205 285c70-145 130-160 185-170M250 275c15-85 45-120 110-145" fill="none" stroke="${p[1]}" stroke-width="10"/><g fill="${p[2]}"><ellipse cx="245" cy="180" rx="34" ry="18"/><ellipse cx="342" cy="146" rx="35" ry="17"/><ellipse cx="310" cy="235" rx="38" ry="18"/></g>`,
    embroidery:`<rect x="170" y="80" width="260" height="235" rx="12" fill="${p[0]}"/><g fill="none" stroke="${p[1]}" stroke-width="7"><path d="M200 120l200 155M400 120L200 275"/><circle cx="300" cy="198" r="58"/></g><g fill="${p[2]}"><circle cx="300" cy="140" r="16"/><circle cx="300" cy="256" r="16"/><circle cx="242" cy="198" r="16"/><circle cx="358" cy="198" r="16"/></g>`,
    metal:`<ellipse cx="300" cy="314" rx="110" ry="18" fill="#000" opacity=".12"/><path d="M235 292c8-100 18-163 65-192 47 29 57 92 65 192z" fill="${p[1]}" stroke="${p[3]}" stroke-width="8"/><path d="M260 140h80M252 180h96M245 220h110" stroke="${p[2]}" stroke-width="8" stroke-linecap="round"/>`,
    pottery:`<ellipse cx="300" cy="315" rx="120" ry="18" fill="#000" opacity=".12"/><path d="M235 120c22 25 20 50-5 78-32 36-20 105 70 115 90-10 102-79 70-115-25-28-27-53-5-78z" fill="${p[0]}" stroke="${p[1]}" stroke-width="8"/><path d="M245 205q55 38 110 0" fill="none" stroke="${p[1]}" stroke-width="9"/><path d="M260 245q40 26 80 0" fill="none" stroke="${p[2]}" stroke-width="7"/>`,
    textile:`<path d="M175 95h250v205H175z" fill="${p[0]}"/><path d="M175 130h250M175 170h250M175 210h250M175 250h250" stroke="${p[1]}" stroke-width="8"/><path d="M220 95v205M300 95v205M380 95v205" stroke="${p[2]}" stroke-width="7"/>`,
    basket:`<ellipse cx="300" cy="315" rx="120" ry="16" fill="#000" opacity=".12"/><path d="M205 160h190l-20 140H225z" fill="${p[0]}" stroke="${p[1]}" stroke-width="7"/><path d="M225 180h150M220 215h160M215 250h170M210 285h180" stroke="${p[1]}" stroke-width="5"/><path d="M255 160q45-90 90 0" fill="none" stroke="${p[1]}" stroke-width="9"/>`,
    wood:`<rect x="185" y="92" width="230" height="220" rx="20" fill="${p[0]}" stroke="${p[1]}" stroke-width="8"/><circle cx="300" cy="202" r="72" fill="none" stroke="${p[1]}" stroke-width="10"/><path d="M300 130l18 52 55 2-43 33 15 53-45-31-45 31 15-53-43-33 55-2z" fill="${p[2]}" opacity=".72"/>`,
    jewellery:`<ellipse cx="300" cy="210" rx="100" ry="118" fill="none" stroke="${p[1]}" stroke-width="17"/><g fill="${p[2]}"><circle cx="225" cy="170" r="16"/><circle cx="375" cy="170" r="16"/><circle cx="300" cy="320" r="22"/></g>`,
    art:`<rect x="175" y="82" width="250" height="235" rx="10" fill="${p[0]}"/><circle cx="300" cy="195" r="82" fill="${p[1]}" opacity=".82"/><path d="M230 245q70-140 140 0" fill="none" stroke="${p[3]}" stroke-width="14"/>`
  };
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f5eadc"/><stop offset="1" stop-color="#e6cdb4"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="12" stdDeviation="13" flood-opacity=".18"/></filter></defs><rect width="600" height="420" fill="url(#bg)"/><path d="M0 342q150-34 300 0t300 0v78H0z" fill="#c6a27d" opacity=".24"/><g filter="url(#shadow)">${motifs[kind]||motifs.art}</g><rect x="22" y="20" width="126" height="29" rx="15" fill="#6a3e2c" opacity=".92"/><text x="85" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#fff">INDIAN CRAFT PREVIEW</text><rect x="30" y="352" width="540" height="44" rx="14" fill="#fff" opacity=".86"/><text x="48" y="379" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#4a3025">${title}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function schedule(task){return new Promise((resolve,reject)=>{queue.push({task,resolve,reject});pump()})}
function pump(){while(active<MAX_ACTIVE&&queue.length){const j=queue.shift();active++;Promise.resolve().then(j.task).then(j.resolve,j.reject).finally(()=>{active--;pump()})}}
async function fetchImage(item){
  const key=keyFor(item);if(memoryCache.has(key))return memoryCache.get(key);if(pending.has(key))return pending.get(key);
  const job=schedule(async()=>{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
    try{
      const r=await fetch('/api/product-image',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({name:item?.name||'',type:item?.type||'',category:item?.category||'',description:descriptionFor(item)})});
      const d=await r.json().catch(()=>({}));
      const url=r.ok&&d.dataUrl?d.dataUrl:instantPreview(item);memoryCache.set(key,url);return url;
    }catch{return instantPreview(item)}finally{clearTimeout(timer)}
  }).finally(()=>pending.delete(key));
  pending.set(key,job);return job;
}
function setBg(el,url){el.style.backgroundImage=`url("${url}")`;el.style.backgroundSize='cover';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat'}
async function load(el,item){
  if(!el||el.dataset.aiImageDone==='1')return;el.dataset.aiImageDone='1';const fallback=instantPreview(item);setBg(el,fallback);el.classList.add('ac-ai-image-loading');
  try{const url=await fetchImage(item);if(el.isConnected)setBg(el,url)}finally{el.classList.remove('ac-ai-image-loading');el.classList.add('ac-ai-image-ready')}
}
function itemFromElement(el){const id=el.dataset.productId||el.closest('[data-product-id]')?.dataset.productId;return (window.AC_BUYER_CATALOG||[]).find(x=>String(x.id)===String(id))||null}
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;io.unobserve(el);const item=itemFromElement(el);if(item)load(el,item)})},{rootMargin:'100px'}):null;
function hydrate(root=document){root.querySelectorAll?.('[data-ai-product-image]').forEach(el=>{if(el.dataset.aiObserved)return;el.dataset.aiObserved='1';const item=itemFromElement(el);if(!item)return;const cached=memoryCache.get(keyFor(item));setBg(el,cached||instantPreview(item));if(cached)el.dataset.aiImageDone='1';else if(io)io.observe(el);else load(el,item)})}
window.AC_AI_PRODUCT_IMAGES={hydrate,load,fetchImage,instantPreview};
window.addEventListener('ac-browse-rendered',()=>hydrate());window.addEventListener('load',()=>hydrate());
const style=document.createElement('style');style.textContent=`.ac-ai-image-loading{position:relative}.ac-ai-image-loading::after{content:'AI';position:absolute;right:8px;bottom:8px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(74,48,37,.75);color:#fff;font-size:9px;font-weight:900}.ac-ai-image-ready{background-color:#efe2d4}`;document.head.appendChild(style);
