const memoryCache=new Map();
const pending=new Map();
let active=0;
const queue=[];
const MAX_ACTIVE=1;

function keyFor(item){return String(item?.id||item?.name||'product')}
function descriptionFor(item){return [item?.name,item?.type,item?.category,item?.description].filter(Boolean).join('. ')}
function escXml(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]))}

function instantPreview(item){
  const title=escXml((item?.name||'Indian handmade product').slice(0,38));
  const type=escXml((item?.type||item?.category||'Authentic Indian craft').slice(0,48));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5ece2"/><stop offset="1" stop-color="#e4cfbb"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity=".13"/></filter></defs><rect width="600" height="420" fill="url(#bg)"/><rect x="88" y="58" width="424" height="250" rx="20" fill="#fff9f2" filter="url(#shadow)"/><rect x="110" y="80" width="380" height="206" rx="14" fill="#eadbc9"/><path d="M140 122h320M140 160h320M140 198h320M140 236h320" stroke="#b98f6b" stroke-width="2" opacity=".28"/><text x="300" y="171" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-weight="700" fill="#6a3e2c">Authentic Indian Craft</text><text x="300" y="203" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#7a6253">Generating realistic product photograph…</text><rect x="28" y="344" width="544" height="48" rx="14" fill="#fff" opacity=".9"/><text x="48" y="370" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#4a3025">${title}</text><text x="48" y="389" font-family="Arial,sans-serif" font-size="11" fill="#6f574a">${type}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function schedule(task){return new Promise((resolve,reject)=>{queue.push({task,resolve,reject});pump()})}
function pump(){while(active<MAX_ACTIVE&&queue.length){const j=queue.shift();active++;Promise.resolve().then(j.task).then(j.resolve,j.reject).finally(()=>{active--;pump()})}}

async function fetchImage(item){
  const key=keyFor(item);
  if(memoryCache.has(key))return memoryCache.get(key);
  if(pending.has(key))return pending.get(key);
  const job=schedule(async()=>{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
    try{
      const r=await fetch('/api/product-image',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({name:item?.name||'',type:item?.type||'',category:item?.category||'',description:descriptionFor(item)})});
      const d=await r.json().catch(()=>({}));
      const url=r.ok&&d.dataUrl?d.dataUrl:instantPreview(item);
      memoryCache.set(key,url);
      return url;
    }catch{return instantPreview(item)}finally{clearTimeout(timer)}
  }).finally(()=>pending.delete(key));
  pending.set(key,job);return job;
}

function setBg(el,url){el.style.backgroundImage=`url("${url}")`;el.style.backgroundSize='cover';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat'}
async function load(el,item){
  if(!el||el.dataset.aiImageDone==='1')return;
  el.dataset.aiImageDone='1';
  const fallback=instantPreview(item);setBg(el,fallback);el.classList.add('ac-ai-image-loading');
  try{const url=await fetchImage(item);if(el.isConnected)setBg(el,url)}finally{el.classList.remove('ac-ai-image-loading');el.classList.add('ac-ai-image-ready')}
}
function itemFromElement(el){const id=el.dataset.productId||el.closest('[data-product-id]')?.dataset.productId;return (window.AC_BUYER_CATALOG||[]).find(x=>String(x.id)===String(id))||null}
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;io.unobserve(el);const item=itemFromElement(el);if(item)load(el,item)})},{rootMargin:'100px'}):null;
function hydrate(root=document){root.querySelectorAll?.('[data-ai-product-image]').forEach(el=>{if(el.dataset.aiObserved)return;el.dataset.aiObserved='1';const item=itemFromElement(el);if(!item)return;const cached=memoryCache.get(keyFor(item));setBg(el,cached||instantPreview(item));if(cached)el.dataset.aiImageDone='1';else if(io)io.observe(el);else load(el,item)})}

window.AC_AI_PRODUCT_IMAGES={hydrate,load,fetchImage,instantPreview};
window.addEventListener('ac-browse-rendered',()=>hydrate());
window.addEventListener('load',()=>hydrate());
const style=document.createElement('style');style.textContent=`.ac-ai-image-loading{position:relative}.ac-ai-image-loading::after{content:'AI';position:absolute;right:8px;bottom:8px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(74,48,37,.75);color:#fff;font-size:9px;font-weight:900}.ac-ai-image-ready{background-color:#efe2d4}`;document.head.appendChild(style);
