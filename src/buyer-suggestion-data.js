const catalog=()=>window.AC_BUYER_CATALOG||[];
const sellerItems=()=>{try{return JSON.parse(localStorage.getItem('ac-artisan-artworks')||'[]')}catch{return[]}};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const groups={
  woodcraft:['Woodcraft'],pottery:['Ceramics'],ceramic:['Ceramics'],ceramics:['Ceramics'],
  jewellery:['Jewellery'],jewelry:['Jewellery'],'textile art':['Embroidery & Textile'],
  embroidery:['Embroidery & Textile'],bags:['Bags'],bag:['Bags'],basket:['Baskets'],baskets:['Baskets'],
  painting:['Paintings'],paintings:['Paintings'],sculpture:['Showpieces','Metal Art','Woodcraft'],
  'home decor':['Showpieces','Metal Art','Woodcraft','Ceramics'],attar:['Attar'],perfume:['Attar'],
  bamboo:['Bamboo & Cane'],'pottery & ceramics':['Ceramics'],'embroidery & textiles':['Embroidery & Textile'],
  'attar / perfumes':['Attar'],'metal art':['Metal Art'],showpieces:['Showpieces']
};
const SPRITE_URL='/catalog-100-sprite.jpg';
const SPRITE_INDEX={};
for(let i=1;i<=50;i++)SPRITE_INDEX['x'+i]=i-1;
for(let i=1;i<=10;i++)SPRITE_INDEX['dat'+i]=49+i;
for(let i=1;i<=10;i++)SPRITE_INDEX['dba'+i]=59+i;
for(let i=1;i<=10;i++)SPRITE_INDEX['dbg'+i]=59+i;
for(let i=1;i<=10;i++)SPRITE_INDEX['dbs'+i]=69+i;
for(let i=1;i<=10;i++)SPRITE_INDEX['dsp'+i]=79+i;
for(let i=1;i<=10;i++)SPRITE_INDEX['dpt'+i]=89+i;
function imageStyle(item){
  const ai=window.acAIPhotoStyle?.(item);if(ai)return ai;
  const n=SPRITE_INDEX[String(item?.id||'')];
  if(n==null)return '';
  const col=n%10,row=Math.floor(n/10);
  return `background-image:url('${SPRITE_URL}');background-size:1000% 1000%;background-position:${(col/9)*100}% ${(row/9)*100}%;background-repeat:no-repeat;background-color:#ead3bd`;
}
function numToken(s){s=String(s).toLowerCase().replace(/,/g,'');const n=parseFloat(s);return Number.isFinite(n)?n*(s.includes('k')?1000:1):0}
function fixedPrice(range){const vals=(String(range||'').match(/[0-9][0-9,.]*\s*k?/gi)||[]).map(numToken).filter(Boolean);if(!vals.length)return 0;const raw=vals.length>1?(vals[0]+vals[1])/2:vals[0];if(raw<500)return Math.round(raw/10)*10;if(raw<2000)return Math.round(raw/50)*50;return Math.round(raw/100)*100}
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function budgetRange(v){const s=String(v||'').replace(/,/g,'').toLowerCase();if(!s||/no fixed/.test(s))return[0,Infinity];const nums=(s.match(/[0-9]+(?:\.[0-9]+)?/g)||[]).map(Number);if(/less than|under/.test(s))return[0,nums[0]||0];if(/\+$/.test(s))return[nums[0]||0,Infinity];if(nums.length>=2)return[nums[0],nums[1]];return[0,Infinity]}
function getBuyer(){try{return JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{return{}}}
function normalizeSeller(x){return{id:x.id||`seller-${Date.now()}`,name:x.name||x.title,type:x.type||x.craft||'Handmade',category:x.category||x.craft||'Handmade',price:x.price||'₹0',image:x.image||'',artisan:x.artisan||'Local artisan',location:x.location||'India',sellerEntered:true}}
function unique(items){const seen=new Set();return items.filter(x=>{const k=x.id||`${x.name}|${x.type}`;if(seen.has(k))return false;seen.add(k);return true})}
function itemMatches(item,q){
  if(!q)return true;
  const allowed=groups[q];
  if(allowed?.length)return allowed.some(g=>String(item.category||'').toLowerCase()===g.toLowerCase()||String(item.type||'').toLowerCase().includes(g.toLowerCase()));
  const text=`${item.name||''} ${item.type||''} ${item.category||''}`.toLowerCase();
  return text.includes(q);
}
function chooseItems(){
  const seller=sellerItems().map(normalizeSeller),all=[...seller,...catalog()];
  const b=getBuyer(),pref=String(b.preference||b.interests?.[0]||'').trim(),q=pref.toLowerCase(),[min,max]=budgetRange(b.budget);
  const matches=unique(all.filter(x=>itemMatches(x,q)));
  const inBudget=matches.filter(x=>{const p=fixedPrice(x.price);return p>=min&&p<=max});
  const pool=(inBudget.length?inBudget:matches).sort((a,b)=>(b.sellerEntered?1:0)-(a.sellerEntered?1:0));
  return{pref:pref||'handmade craft',items:pool.slice(0,18),budgetRelaxed:!inBudget.length&&matches.length>0};
}
function reason(item,pref,budgetRelaxed){if(item.sellerEntered)return`New seller listing matching your ${pref} choice.`;return budgetRelaxed?`Matches your ${pref} preference. Showing the closest available catalog options.`:`Matches your ${pref} preference and selected budget.`}
function visual(item){if(item.sellerEntered&&item.image)return `<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" decoding="async">`;return `<div class="ac-sprite-image" style="${imageStyle(item)}" role="img" aria-label="${esc(item.name)}"></div>`}
function checkout(item){document.querySelector('#ac-data-checkout')?.remove();const b=getBuyer(),price=money(fixedPrice(item.price)),m=document.createElement('div');m.id='ac-data-checkout';m.className='modal-backdrop';m.innerHTML=`<div class="login-modal"><button class="modal-close">×</button><span class="eyebrow">CHECKOUT</span><h2>${esc(item.name)}</h2><p><b>${price}</b> · fixed demo price</p><p><b>Deliver to</b><br>${esc(b.name||'Buyer')}<br>${esc(b.phone||'')}<br>${esc(b.address||'')}</p><label>Choose payment method<select id="ac-data-pay"><option>UPI</option><option>Card</option><option>Cash on Delivery</option></select></label><button class="modal-submit" id="ac-data-place">Place demo order →</button></div>`;document.body.appendChild(m);m.querySelector('.modal-close').onclick=()=>m.remove();m.onmousedown=e=>{if(e.target===m)m.remove()};m.querySelector('#ac-data-place').onclick=()=>{const order={id:Date.now(),title:item.name,craft:item.type,price,payment:m.querySelector('#ac-data-pay').value,buyer:b,status:'New'};let list=[];try{list=JSON.parse(localStorage.getItem('ac-demo-orders')||'[]')}catch{}list.push(order);localStorage.setItem('ac-demo-orders',JSON.stringify(list));m.querySelector('.login-modal').innerHTML=`<span class="eyebrow">ORDER CONFIRMED</span><h2>Order placed successfully!</h2><p>${esc(item.name)} · <b>${price}</b></p><p>This is a hackathon demo checkout. No real payment was charged.</p><button class="btn primary" id="ac-data-done">Continue shopping</button>`;m.querySelector('#ac-data-done').onclick=()=>m.remove()}}
function render(){
  if(localStorage.getItem('ac-user-role')!=='buyer')return;
  const grid=document.querySelector('.buyer-products');if(!grid)return;
  const{items,pref,budgetRelaxed}=chooseItems();if(!items.length)return;
  const sig=pref+'|'+getBuyer().budget+'|'+items.map(x=>x.id).join(',');if(grid.dataset.catalogSig===sig&&grid.querySelector('.ac-ai-data-card'))return;
  grid.dataset.catalogSig=sig;
  grid.innerHTML=items.map((x,i)=>`<article class="ac-ai-data-card" data-product-id="${esc(x.id)}"><div class="ac-ai-data-art">${visual(x)}</div><div class="buyer-product-info"><small>${esc(x.type)} · ${esc(x.location||'India')}</small><b>${esc(x.name)}</b><strong>${money(fixedPrice(x.price))}</strong><small>${Math.max(72,98-i*2)}% match</small><p>${esc(reason(x,pref,budgetRelaxed))}</p><div class="ac-fixed-tag">${x.sellerEntered?`New seller listing · ${esc(x.artisan)}`:`Fixed price · ${window.AC_AI_PHOTOS?.[x.id]!=null?'AI photo':'uploaded catalog'}`}</div><button class="btn primary" data-buy="${esc(x.id)}">Buy now →</button></div></article>`).join('');
  grid.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>checkout(items.find(x=>x.id===b.dataset.buy)));
}
const style=document.createElement('style');style.textContent=`.ac-ai-data-card{overflow:hidden}.ac-ai-data-art{height:190px;position:relative;background:#ead3bd;overflow:hidden}.ac-ai-data-art>img,.ac-sprite-image{width:100%;height:100%;object-fit:cover;display:block}.ac-sprite-image{background-color:#ead3bd;background-position:center;background-size:cover}.ac-fixed-tag{display:inline-flex;align-self:flex-start;padding:5px 8px;border-radius:999px;background:rgba(188,82,43,.09);color:var(--rust);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}.ac-ai-data-card .buyer-product-info{height:auto}.ac-ai-data-card .buyer-product-info p{min-height:44px}@media(max-width:560px){.ac-ai-data-art{height:165px}}`;
document.head.appendChild(style);
window.addEventListener('storage',render);
window.addEventListener('load',()=>setTimeout(render,250),{once:true});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const t=(b.textContent||'').toLowerCase();if(t.includes('ai suggestions')||b.closest('.ac-art-options')||t.includes('next')){setTimeout(render,60);setTimeout(render,250)}},true);
function watchBuyerContent(){const host=document.querySelector('.dashboard-content');if(!host)return false;let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}).observe(host,{childList:true,subtree:true});return true}
if(!watchBuyerContent()){const boot=new MutationObserver(()=>{if(watchBuyerContent())boot.disconnect()});boot.observe(document.body,{childList:true,subtree:true})}
