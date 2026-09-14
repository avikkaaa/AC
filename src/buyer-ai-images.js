const memoryCache=new Map();
const pending=new Map();
let active=0;
const queue=[];
const MAX_ACTIVE=1;

const GROUP_SPRITES={dat:'/catalog/attar.webp',dbg:'/catalog/bags.webp',dbs:'/catalog/baskets.webp',dsp:'/catalog/showpieces.webp'};
const PDF_INDEX={dat1:0,dat2:1,dat3:11,dat4:22,dat5:33,dat6:44,dat7:46,dat8:47,dat9:48,dat10:49,dbg1:2,dbg2:3,dbg3:4,dbg4:5,dbg5:6,dbg6:7,dbg7:8,dbg8:9,dbg9:10,dbg10:12,dbs1:13,dbs2:14,dbs3:15,dbs4:16,dbs5:17,dbs6:18,dbs7:19,dbs8:20,dbs9:21,dbs10:23,dsp1:24,dsp2:25,dsp3:26,dsp4:27,dsp5:28,dsp6:29,dsp7:30,dsp8:31,dsp9:32,dsp10:34,dpt1:35,dpt2:36,dpt3:37,dpt4:38,dpt5:39,dpt6:40,dpt7:41,dpt8:42,dpt9:43,dpt10:45};
for(let i=1;i<=50;i++)PDF_INDEX['x'+i]=49+i;

function keyFor(item){return String(item?.id||item?.name||'product')}
function descriptionFor(item){return [item?.name,item?.type,item?.category,item?.description].filter(Boolean).join('. ')}
function escXml(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]))}

function originalVisual(item){
  if(item?.image)return{image:`url("${String(item.image).replace(/"/g,'')}")`,size:'contain',position:'center'};
  const id=String(item?.id||'');
  const m=id.match(/^(dat|dbg|dbs|dsp)(\d+)$/);
  if(m&&GROUP_SPRITES[m[1]]){
    const n=Math.max(0,Math.min(9,Number(m[2])-1)),x=(n%5)*25,y=n<5?0:100;
    return{image:`url('${GROUP_SPRITES[m[1]]}')`,size:'500% 200%',position:`${x}% ${y}%`};
  }
  const n=PDF_INDEX[id];
  if(n==null)return null;
  const col=n%10,row=Math.floor(n/10);
  return{image:`url('/catalog-100-sprite.jpg')`,size:'1000% 1000%',position:`${(col/9)*100}% ${(row/9)*100}%`};
}

function neutralPreview(item){
  const title=escXml((item?.name||'Indian handmade product').slice(0,40));
  const type=escXml((item?.type||item?.category||'Authentic Indian craft').slice(0,48));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5ece2"/><stop offset="1" stop-color="#e4d0bc"/></linearGradient></defs><rect width="600" height="420" fill="url(#bg)"/><rect x="88" y="58" width="424" height="250" rx="20" fill="#fff9f2"/><rect x="110" y="80" width="380" height="206" rx="14" fill="#eadbc9"/><text x="300" y="172" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-weight="700" fill="#6a3e2c">Indian artisan product</text><text x="300" y="204" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#7a6253">Preparing realistic product image…</text><rect x="30" y="342" width="540" height="48" rx="14" fill="#fff" opacity=".9"/><text x="48" y="369" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#4a3025">${title}</text><text x="48" y="388" font-family="Arial,sans-serif" font-size="11" fill="#6f574a">${type}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function applyVisual(el,v){
  if(!el||!v)return;
  if(typeof v==='string'){
    el.style.backgroundImage=`url("${v}")`;
    el.style.backgroundSize='cover';
    el.style.backgroundPosition='center';
  }else{
    el.style.backgroundImage=v.image;
    el.style.backgroundSize=v.size||'cover';
    el.style.backgroundPosition=v.position||'center';
  }
  el.style.backgroundRepeat='no-repeat';
}

function schedule(task){return new Promise((resolve,reject)=>{queue.push({task,resolve,reject});pump()})}
function pump(){while(active<MAX_ACTIVE&&queue.length){const j=queue.shift();active++;Promise.resolve().then(j.task).then(j.resolve,j.reject).finally(()=>{active--;pump()})}}

async function fetchImage(item){
  const key=keyFor(item);if(memoryCache.has(key))return memoryCache.get(key);if(pending.has(key))return pending.get(key);
  const job=schedule(async()=>{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
    try{
      const r=await fetch('/api/product-image',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({name:item?.name||'',type:item?.type||'',category:item?.category||'',description:descriptionFor(item)})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||!d.dataUrl||d.fallback)throw new Error(d.error||'AI image unavailable');
      memoryCache.set(key,d.dataUrl);return d.dataUrl;
    }finally{clearTimeout(timer)}
  }).finally(()=>pending.delete(key));
  pending.set(key,job);return job;
}

async function load(el,item){
  if(!el||el.dataset.aiImageDone==='1')return;
  const original=originalVisual(item);
  if(original){applyVisual(el,original);el.dataset.aiImageDone='1';el.classList.add('ac-real-product-image');return}
  el.dataset.aiImageDone='1';applyVisual(el,neutralPreview(item));el.classList.add('ac-ai-image-loading');
  try{const url=await fetchImage(item);if(el.isConnected){applyVisual(el,url);el.classList.add('ac-ai-image-ready')}}catch{}finally{el.classList.remove('ac-ai-image-loading')}
}

function itemFromElement(el){const id=el.dataset.productId||el.closest('[data-product-id]')?.dataset.productId;return (window.AC_BUYER_CATALOG||[]).find(x=>String(x.id)===String(id))||null}
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;io.unobserve(el);const item=itemFromElement(el);if(item)load(el,item)})},{rootMargin:'120px'}):null;

function hydrate(root=document){
  root.querySelectorAll?.('[data-ai-product-image]').forEach(el=>{
    if(el.dataset.aiObserved)return;el.dataset.aiObserved='1';
    const item=itemFromElement(el);if(!item)return;
    const original=originalVisual(item);
    if(original){applyVisual(el,original);el.dataset.aiImageDone='1';el.classList.add('ac-real-product-image');return}
    const cached=memoryCache.get(keyFor(item));
    if(cached){applyVisual(el,cached);el.dataset.aiImageDone='1';return}
    applyVisual(el,neutralPreview(item));
    if(io)io.observe(el);else load(el,item);
  })
}

window.AC_AI_PRODUCT_IMAGES={hydrate,load,fetchImage,neutralPreview,originalVisual};
window.addEventListener('ac-browse-rendered',()=>hydrate());
window.addEventListener('load',()=>hydrate());
const style=document.createElement('style');style.textContent=`.ac-ai-image-loading{position:relative}.ac-ai-image-loading::after{content:'AI';position:absolute;right:8px;bottom:8px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(74,48,37,.75);color:#fff;font-size:9px;font-weight:900}.ac-real-product-image{background-color:#f1e3d4!important}`;document.head.appendChild(style);
