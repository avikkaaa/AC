const PRODUCTS_KEY='ac-artisan-uploaded-products';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function readProducts(){
  try{return JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'[]')}catch{return[]}
}
function writeProducts(items){
  try{localStorage.setItem(PRODUCTS_KEY,JSON.stringify(items.slice(0,20)))}catch{}
}
function money(v){
  const n=Number(String(v??'').replace(/[^0-9.]/g,''));
  return n?`₹${Math.round(n).toLocaleString('en-IN')}`:(String(v||'Price pending'));
}
function formValue(form,name){return form?.elements?.[name]?.value?.trim?.()||''}
function dataUrl(file){
  return new Promise(resolve=>{
    if(!file)return resolve('');
    const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>resolve('');r.readAsDataURL(file);
  });
}

async function captureProduct(form){
  const file=form.querySelector('input[type="file"][accept*="image"]')?.files?.[0];
  const ai=(()=>{try{return JSON.parse(form.dataset.aiCatalog||'{}')}catch{return{}}})();
  const title=formValue(form,'title')||ai.title;
  if(!title&&!file)return;
  const image=await dataUrl(file);
  const product={
    id:`artisan-${Date.now()}`,
    title:title||'Untitled handmade product',
    craft:formValue(form,'craft')||ai.craft||ai.buyer_category||'Handmade',
    materials:formValue(form,'materials')||(Array.isArray(ai.materials)?ai.materials.join(', '):ai.materials)||'',
    description:formValue(form,'description')||ai.description||'AI description pending.',
    price:formValue(form,'price')||ai.recommended_price_inr||'',
    minPrice:ai.estimated_price_min_inr||'',
    maxPrice:ai.estimated_price_max_inr||'',
    confidence:ai.confidence||'',
    pricingConfidence:ai.pricing_confidence||'',
    image,
    status:'Live',
    createdAt:new Date().toISOString()
  };
  const items=readProducts();
  items.unshift(product);writeProducts(items);
  window.dispatchEvent(new CustomEvent('ac-products-updated'));
}

function removeProduct(id){writeProducts(readProducts().filter(x=>x.id!==id));renderProducts()}
function toggleStatus(id){
  const items=readProducts();const p=items.find(x=>x.id===id);if(p)p.status=p.status==='Live'?'Draft':'Live';writeProducts(items);renderProducts();
}

function renderProducts(){
  const host=document.querySelector('.dashboard-content');
  if(!host)return;
  document.querySelectorAll('.dashboard-sidebar button').forEach(x=>x.classList.remove('active'));
  document.querySelector('#ac-uploaded-products-nav')?.classList.add('active');
  const items=readProducts();
  host.innerHTML=`<section class="workspace-panel ac-uploaded-products"><div class="workspace-heading"><div><span class="eyebrow">YOUR CATALOG</span><h1>Uploaded products.</h1><p>Manage products created from your uploaded photos and AI-generated catalog details.</p></div><div class="ac-product-total"><strong>${items.length}</strong><span>products</span></div></div>${items.length?`<div class="ac-artisan-product-grid">${items.map(p=>`<article class="ac-artisan-product-card"><div class="ac-artisan-product-photo">${p.image?`<img src="${p.image}" alt="${esc(p.title)}"/>`:`<div class="ac-photo-placeholder">📷<span>Product photo</span></div>`}<span class="ac-product-status ${p.status==='Live'?'live':'draft'}">${esc(p.status)}</span></div><div class="ac-artisan-product-body"><div class="ac-product-topline"><span>${esc(p.craft)}</span><strong>${money(p.price)}</strong></div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.materials?`<small><b>Materials:</b> ${esc(p.materials)}</small>`:''}${p.minPrice&&p.maxPrice?`<small><b>AI price range:</b> ${money(p.minPrice)} – ${money(p.maxPrice)}</small>`:''}<div class="ac-ai-badges">${p.confidence?`<span>AI match ${esc(p.confidence)}%</span>`:''}${p.pricingConfidence?`<span>Price confidence ${esc(p.pricingConfidence)}%</span>`:''}</div><div class="ac-product-actions"><button type="button" data-toggle="${esc(p.id)}">${p.status==='Live'?'Move to draft':'Publish'}</button><button type="button" class="danger" data-delete="${esc(p.id)}">Remove</button></div></div></article>`).join('')}</div>`:`<div class="ac-empty-products"><div>📦</div><h3>No uploaded products yet</h3><p>Upload a product photo from Add Product. AI will generate the listing and it will appear here.</p></div>`}</section>`;
  host.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>toggleStatus(b.dataset.toggle));
  host.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>removeProduct(b.dataset.delete));
}

function installNav(){
  if(localStorage.getItem('ac-user-role')!=='artisan')return false;
  const side=document.querySelector('.dashboard-sidebar');if(!side)return false;
  if(side.querySelector('#ac-uploaded-products-nav'))return true;
  const logout=side.querySelector('.sidebar-logout');
  const b=document.createElement('button');b.id='ac-uploaded-products-nav';b.innerHTML='Uploaded products <span>→</span>';b.onclick=renderProducts;
  side.insertBefore(b,logout||null);return true;
}

document.addEventListener('submit',e=>{
  const form=e.target;
  if(!(form instanceof HTMLFormElement)||!form.matches('.seller-form'))return;
  if(!form.querySelector('input[type="file"][accept*="image"]'))return;
  setTimeout(()=>captureProduct(form),0);
},true);

// Also support buttons that publish without a native form submit event.
document.addEventListener('click',e=>{
  const btn=e.target.closest('.seller-form button[type="submit"],.seller-form input[type="submit"]');
  if(!btn)return;
  const form=btn.closest('.seller-form');
  if(form) setTimeout(()=>{if(form.dataset.acLastCaptured!==String(Date.now()))captureProduct(form)},120);
},true);

const style=document.createElement('style');
style.textContent=`
.ac-product-total{min-width:96px;padding:12px 16px;border-radius:16px;background:rgba(164,71,46,.08);text-align:center}.ac-product-total strong{display:block;font:700 28px Georgia,serif;color:var(--rust,#a4472e)}.ac-product-total span{font-size:11px;text-transform:uppercase}.ac-artisan-product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:20px}.ac-artisan-product-card{overflow:hidden;border:1px solid rgba(92,53,33,.13);border-radius:20px;background:#fffaf2}.ac-artisan-product-photo{height:240px;position:relative;background:#f2e4d6;display:flex;align-items:center;justify-content:center;overflow:hidden}.ac-artisan-product-photo img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;background:#f2e4d6}.ac-photo-placeholder{display:flex;flex-direction:column;gap:8px;align-items:center;color:#8d6f5d;font-size:30px}.ac-photo-placeholder span{font-size:12px}.ac-product-status{position:absolute;top:12px;right:12px;padding:6px 10px;border-radius:999px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.ac-product-status.live{background:#e6f5ed;color:#216047}.ac-product-status.draft{background:#f1ebe5;color:#745b4c}.ac-artisan-product-body{padding:16px;display:flex;flex-direction:column;gap:9px}.ac-product-topline{display:flex;justify-content:space-between;gap:10px;align-items:center}.ac-product-topline span{font-size:11px;text-transform:uppercase;font-weight:800;color:#8d6f5d}.ac-product-topline strong{font:700 19px Georgia,serif;color:var(--rust,#a4472e)}.ac-artisan-product-body h3{margin:0;font-size:18px}.ac-artisan-product-body p{margin:0;color:#6e584c;line-height:1.45;font-size:13px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.ac-artisan-product-body small{color:#725d51}.ac-ai-badges{display:flex;gap:7px;flex-wrap:wrap}.ac-ai-badges span{font-size:10px;font-weight:800;padding:5px 8px;border-radius:999px;background:rgba(164,71,46,.08);color:#7e4635}.ac-product-actions{display:flex;gap:8px;margin-top:4px}.ac-product-actions button{flex:1;border:1px solid rgba(164,71,46,.28);background:transparent;color:var(--rust,#a4472e);border-radius:10px;padding:9px;font-weight:800;cursor:pointer}.ac-product-actions .danger{color:#8a3c31}.ac-empty-products{min-height:300px;margin-top:20px;border:1px dashed rgba(92,53,33,.22);border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px;color:#725d51}.ac-empty-products>div{font-size:38px}.ac-empty-products h3{margin:10px 0 5px;color:#4e3529}.ac-empty-products p{max-width:440px;margin:0}@media(max-width:760px){.ac-artisan-product-grid{grid-template-columns:1fr}.ac-artisan-product-photo{height:260px}}
`;
document.head.appendChild(style);

installNav();
new MutationObserver(()=>installNav()).observe(document.body,{childList:true,subtree:true});
window.addEventListener('ac-products-updated',()=>{if(document.querySelector('#ac-uploaded-products-nav.active'))renderProducts()});
