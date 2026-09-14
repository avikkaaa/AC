const CACHE_KEY='ac-buyer-ai-image-cache-v2';
let cache={};
try{cache=JSON.parse(sessionStorage.getItem(CACHE_KEY)||'{}')}catch{}
const pending=new Map();
let active=0;
const queue=[];
const MAX_ACTIVE=2;

function keyFor(item){return String(item?.id||item?.name||'product')}
function descriptionFor(item){return [item?.name,item?.type,item?.category,item?.description].filter(Boolean).join('. ')}
function save(){try{sessionStorage.setItem(CACHE_KEY,JSON.stringify(cache))}catch{}}
function hash(s=''){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function escXml(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]))}
function instantPreview(item){
  const text=descriptionFor(item),seed=hash(text),p=[['#F6ECE1','#D7AF8B','#A4472E','#4A3025'],['#F4E6D8','#D0A276','#985638','#422D24'],['#F8EFE5','#CFA889','#B05B3A','#4C3328']][seed%3];
  const title=escXml((item?.name||'Handmade product').slice(0,36));
  const type=escXml((item?.type||item?.category||'Artisan craft').slice(0,40));
  const shape=seed%3;
  const art=shape===0?`<path d="M195 120h210l-22 190H217z" fill="${p[1]}"/><path d="M235 150h130" stroke="${p[2]}" stroke-width="12" stroke-linecap="round" opacity=".65"/>`:shape===1?`<ellipse cx="300" cy="225" rx="125" ry="95" fill="${p[1]}"/><ellipse cx="300" cy="200" rx="86" ry="54" fill="${p[0]}"/><path d="M240 270q60 28 120 0" fill="none" stroke="${p[2]}" stroke-width="12"/>`:`<rect x="195" y="110" width="210" height="205" rx="24" fill="${p[1]}"/><path d="M225 145l150 135M375 145L225 280" stroke="${p[2]}" stroke-width="10" opacity=".55"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${p[0]}"/><stop offset="1" stop-color="#ead4c0"/></linearGradient></defs><rect width="600" height="420" fill="url(#g)"/><ellipse cx="300" cy="330" rx="165" ry="22" fill="#4a3025" opacity=".12"/>${art}<rect x="28" y="24" width="104" height="28" rx="14" fill="${p[2]}"/><text x="80" y="43" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="#fff">AI PREVIEW</text><rect x="28" y="348" width="544" height="48" rx="16" fill="#fff" opacity=".82"/><text x="48" y="370" font-family="Georgia" font-size="16" font-weight="700" fill="${p[3]}">${title}</text><text x="48" y="389" font-family="Arial" font-size="11" fill="${p[3]}" opacity=".72">${type}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function schedule(task){return new Promise((resolve,reject)=>{queue.push({task,resolve,reject});pump()})}
function pump(){while(active<MAX_ACTIVE&&queue.length){const j=queue.shift();active++;Promise.resolve().then(j.task).then(j.resolve,j.reject).finally(()=>{active--;pump()})}}
async function fetchImage(item){
  const key=keyFor(item);if(cache[key])return cache[key];if(pending.has(key))return pending.get(key);
  const job=schedule(async()=>{
    const r=await fetch('/api/product-image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:item?.name||'',type:item?.type||'',category:item?.category||'',description:descriptionFor(item)})});
    const d=await r.json().catch(()=>({}));
    const url=r.ok&&d.dataUrl?d.dataUrl:instantPreview(item);
    cache[key]=url;save();return url;
  }).finally(()=>pending.delete(key));
  pending.set(key,job);return job;
}
function setBg(el,url){el.style.backgroundImage=`url("${url}")`;el.style.backgroundSize='cover';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat'}
async function load(el,item){
  if(!el||el.dataset.aiImageDone==='1')return;
  el.dataset.aiImageDone='1';
  const fallback=instantPreview(item);setBg(el,fallback);el.classList.add('ac-ai-image-loading');
  try{const url=await fetchImage(item);setBg(el,url);el.classList.remove('ac-ai-image-loading');el.classList.add('ac-ai-image-ready')}
  catch{setBg(el,fallback);el.classList.remove('ac-ai-image-loading');el.classList.add('ac-ai-image-ready')}
}
function itemFromElement(el){const id=el.dataset.productId||el.closest('[data-product-id]')?.dataset.productId;return (window.AC_BUYER_CATALOG||[]).find(x=>String(x.id)===String(id))||null}
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;io.unobserve(el);const item=itemFromElement(el);if(item)load(el,item)})},{rootMargin:'220px'}):null;
function hydrate(root=document){root.querySelectorAll?.('[data-ai-product-image]').forEach(el=>{if(el.dataset.aiObserved)return;el.dataset.aiObserved='1';const item=itemFromElement(el);if(!item)return;setBg(el,cache[keyFor(item)]||instantPreview(item));if(cache[keyFor(item)])el.dataset.aiImageDone='1';else if(io)io.observe(el);else load(el,item)})}
window.AC_AI_PRODUCT_IMAGES={hydrate,load,fetchImage,instantPreview};
window.addEventListener('ac-browse-rendered',()=>hydrate());window.addEventListener('load',()=>hydrate());
const style=document.createElement('style');style.textContent=`.ac-ai-image-loading{position:relative}.ac-ai-image-loading::after{content:'Generating…';position:absolute;right:10px;bottom:10px;padding:5px 8px;border-radius:999px;background:rgba(74,48,37,.72);color:#fff;font-size:10px;font-weight:800}.ac-ai-image-ready{background-color:#efe2d4}`;document.head.appendChild(style);
