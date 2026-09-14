const CACHE_KEY='ac-buyer-ai-image-cache-v1';
let cache={};
try{cache=JSON.parse(sessionStorage.getItem(CACHE_KEY)||'{}')}catch{}
const pending=new Map();

function keyFor(item){return String(item?.id||item?.name||'product')}
function descriptionFor(item){
  return [item?.name,item?.type,item?.category,item?.description].filter(Boolean).join('. ')
}
function save(){try{sessionStorage.setItem(CACHE_KEY,JSON.stringify(cache))}catch{}}
async function fetchImage(item){
  const key=keyFor(item);
  if(cache[key])return cache[key];
  if(pending.has(key))return pending.get(key);
  const job=(async()=>{
    const r=await fetch('/api/product-image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:item?.name||'',type:item?.type||'',category:item?.category||'',description:descriptionFor(item)})});
    const d=await r.json();
    if(!r.ok||!d.dataUrl)throw new Error(d.error||'Image generation failed');
    cache[key]=d.dataUrl;save();return d.dataUrl;
  })().finally(()=>pending.delete(key));
  pending.set(key,job);return job;
}
function placeholder(el){
  el.classList.add('ac-ai-image-loading');
  el.style.backgroundImage='none';
}
async function load(el,item){
  if(!el||el.dataset.aiImageDone==='1')return;
  el.dataset.aiImageDone='1';placeholder(el);
  try{
    const url=await fetchImage(item);
    el.style.backgroundImage=`url("${url}")`;
    el.style.backgroundSize='cover';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat';
    el.classList.remove('ac-ai-image-loading');el.classList.add('ac-ai-image-ready');
  }catch{
    el.classList.remove('ac-ai-image-loading');el.classList.add('ac-ai-image-error');
  }
}
function itemFromElement(el){
  const id=el.dataset.productId||el.closest('[data-product-id]')?.dataset.productId;
  return (window.AC_BUYER_CATALOG||[]).find(x=>String(x.id)===String(id))||null;
}
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;io.unobserve(el);const item=itemFromElement(el);if(item)load(el,item)})
},{rootMargin:'250px'}):null;
function hydrate(root=document){
  root.querySelectorAll?.('[data-ai-product-image]').forEach(el=>{
    if(el.dataset.aiObserved)return;el.dataset.aiObserved='1';
    const item=itemFromElement(el);if(!item)return;
    if(cache[keyFor(item)])load(el,item);else if(io)io.observe(el);else load(el,item)
  })
}
window.AC_AI_PRODUCT_IMAGES={hydrate,load,fetchImage};
window.addEventListener('ac-browse-rendered',()=>hydrate());
window.addEventListener('load',()=>hydrate());

const style=document.createElement('style');
style.textContent=`.ac-ai-image-loading{position:relative;background:#efe2d4!important}.ac-ai-image-loading::after{content:'Generating AI image…';position:absolute;inset:0;display:grid;place-items:center;padding:16px;text-align:center;font-size:12px;font-weight:800;color:#8a6a58;background:linear-gradient(110deg,#efe2d4 20%,#f7eee6 40%,#efe2d4 60%);background-size:200% 100%;animation:acImageShimmer 1.4s linear infinite}.ac-ai-image-error{background:#efe2d4!important;position:relative}.ac-ai-image-error::after{content:'AI image unavailable';position:absolute;inset:0;display:grid;place-items:center;font-size:12px;font-weight:800;color:#8a6a58}@keyframes acImageShimmer{to{background-position:-200% 0}}`;
document.head.appendChild(style);
