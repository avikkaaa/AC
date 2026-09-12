const catalog=()=>window.AC_BUYER_CATALOG||[];
const sellerItems=()=>{try{return JSON.parse(localStorage.getItem('ac-artisan-artworks')||'[]')}catch{return[]}};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const icons={'Metal Art':'◈','Embroidery & Textile':'✺','Bamboo & Cane':'⌁','Ceramics':'◌','Woodcraft':'✦','Attar':'♨','Bags':'▱','Baskets':'◡','Showpieces':'◇','Paintings':'▣','Handmade':'✧'};
const groups={woodcraft:['Woodcraft'],pottery:['Ceramics'],ceramic:['Ceramics'],ceramics:['Ceramics'],jewellery:['Embroidery & Textile'],jewelry:['Embroidery & Textile'],'textile art':['Embroidery & Textile'],embroidery:['Embroidery & Textile'],bags:['Bags','Embroidery & Textile'],bag:['Bags','Embroidery & Textile'],basket:['Baskets','Bamboo & Cane'],baskets:['Baskets','Bamboo & Cane'],painting:['Paintings'],paintings:['Paintings'],sculpture:['Metal Art','Woodcraft','Showpieces'],'home decor':['Metal Art','Woodcraft','Ceramics','Showpieces'],attar:['Attar'],perfume:['Attar'],bamboo:['Bamboo & Cane'],'pottery & ceramics':['Ceramics'],'embroidery & textiles':['Embroidery & Textile'],'attar / perfumes':['Attar']};

const fallbackImages={
  'Woodcraft':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Wood_Carving.JPG',
  'Ceramics':'https://commons.wikimedia.org/wiki/Special:Redirect/file/India_pottery.jpg',
  'Paintings':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Madhubani_painting.jpg',
  'Metal Art':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dokra_Art.jpg',
  'Embroidery & Textile':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pulkari_embroidery_of_Punjab.jpg',
  'Bamboo & Cane':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bamboo_basket_weaving.jpg',
  'Baskets':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bamboo_basket_weaving.jpg',
  'Bags':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Embroidery_bag_India.jpg',
  'Showpieces':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dokra_Art.jpg',
  'Attar':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Perfume_bottles.jpg',
  'Handmade':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Handicrafts_of_India.jpg'
};

function numToken(s){s=String(s).toLowerCase().replace(/,/g,'');const n=parseFloat(s);return Number.isFinite(n)?n*(s.includes('k')?1000:1):0}
function fixedPrice(range){const tokens=String(range||'').match(/[0-9][0-9,.]*\s*k?/gi)||[];const vals=tokens.map(numToken).filter(Boolean);if(!vals.length)return 0;const raw=vals.length>1?(vals[0]+vals[1])/2:vals[0];if(raw<500)return Math.round(raw/10)*10;if(raw<2000)return Math.round(raw/50)*50;return Math.round(raw/100)*100}
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function budgetRange(v){const s=String(v||'').replace(/,/g,'').toLowerCase();if(!s||/no fixed/.test(s))return[0,Infinity];const nums=(s.match(/[0-9]+(?:\.[0-9]+)?/g)||[]).map(Number);if(/less than|under/.test(s))return[0,nums[0]||0];if(/\+$/.test(s))return[nums[0]||0,Infinity];if(nums.length>=2)return[nums[0],nums[1]];return[0,Infinity]}
function getBuyer(){try{return JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{return{}}}
function normalizeSeller(x){return{id:x.id,name:x.name||x.title,type:x.type||x.craft||'Handmade',category:x.category||x.craft||'Handmade',price:x.price||'₹0',image:x.image||'',artisan:x.artisan||'Local artisan',location:x.location||'India',sellerEntered:true,description:x.description||'',materials:x.materials||''}}
function chooseItems(){
  const seller=sellerItems().map(normalizeSeller);
  const all=[...seller,...catalog()];
  const b=getBuyer(),pref=String(b.preference||b.interests?.[0]||'').trim(),q=pref.toLowerCase();
  let pool=all.filter(x=>`${x.name} ${x.type} ${x.category}`.toLowerCase().includes(q));
  if(!pool.length&&groups[q])pool=all.filter(x=>groups[q].some(g=>String(x.category).toLowerCase().includes(g.toLowerCase())));
  if(!pool.length){const words=q.split(/\s+/).filter(x=>x.length>2);pool=all.filter(x=>words.some(w=>`${x.name} ${x.type} ${x.category}`.toLowerCase().includes(w)))}
  if(!pool.length)pool=all;
  const[min,max]=budgetRange(b.budget);
  const inBudget=pool.filter(x=>{const p=fixedPrice(x.price);return p>=min&&p<=max});
  if(inBudget.length)pool=inBudget;
  pool.sort((a,b)=>(b.sellerEntered?1:0)-(a.sellerEntered?1:0));
  return{buyer:b,pref:pref||'handmade craft',items:pool.slice(0,9)}
}
function reason(item,pref){return item.sellerEntered?`New seller listing matching your ${pref} choice.`:`Matches your ${pref} preference with a fixed catalog price.`}
function imageFor(item){
  if(item.image)return item.image;
  if(fallbackImages[item.category])return fallbackImages[item.category];
  const text=`${item.type||''} ${item.name||''}`.toLowerCase();
  if(/wood/.test(text))return fallbackImages['Woodcraft'];
  if(/ceramic|pottery|clay/.test(text))return fallbackImages['Ceramics'];
  if(/paint|artwork|wall art/.test(text))return fallbackImages['Paintings'];
  if(/metal|dhokra|sculpture/.test(text))return fallbackImages['Metal Art'];
  if(/embroider|textile|fabric|kurta/.test(text))return fallbackImages['Embroidery & Textile'];
  if(/bamboo|cane|rattan|basket/.test(text))return fallbackImages['Bamboo & Cane'];
  return fallbackImages['Handmade'];
}
function visual(item){const src=imageFor(item),ic=icons[item.category]||'✦';return `<img src="${esc(src)}" alt="${esc(item.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="ac-img-fallback" style="display:none"><span>${ic}</span><b>${esc(item.category)}</b><small>${esc(item.type)}</small></div>`}

function checkout(item){document.querySelector('#ac-data-checkout')?.remove();const b=getBuyer(),price=money(fixedPrice(item.price));const m=document.createElement('div');m.id='ac-data-checkout';m.className='modal-backdrop';m.innerHTML=`<div class="login-modal"><button class="modal-close">×</button><span class="eyebrow">CHECKOUT</span><h2>${esc(item.name)}</h2><p><b>${price}</b> · fixed demo price</p><p><b>Deliver to</b><br>${esc(b.name||'Buyer')}<br>${esc(b.phone||'')}<br>${esc(b.address||'')}</p><label>Choose payment method<select id="ac-data-pay"><option>UPI</option><option>Card</option><option>Cash on Delivery</option></select></label><button class="modal-submit" id="ac-data-place">Place demo order →</button></div>`;document.body.appendChild(m);m.querySelector('.modal-close').onclick=()=>m.remove();m.onmousedown=e=>{if(e.target===m)m.remove()};m.querySelector('#ac-data-place').onclick=()=>{const order={id:Date.now(),title:item.name,craft:item.type,price,payment:m.querySelector('#ac-data-pay').value,buyer:b,status:'New'};let list=[];try{list=JSON.parse(localStorage.getItem('ac-demo-orders')||'[]')}catch{}list.push(order);localStorage.setItem('ac-demo-orders',JSON.stringify(list));m.querySelector('.login-modal').innerHTML=`<span class="eyebrow">ORDER CONFIRMED</span><h2>Order placed successfully!</h2><p>${esc(item.name)} · <b>${price}</b></p><p>This is a hackathon demo checkout. No real payment was charged.</p><button class="btn primary" id="ac-data-done">Continue shopping</button>`;m.querySelector('#ac-data-done').onclick=()=>m.remove()}}

function render(){if(localStorage.getItem('ac-user-role')!=='buyer')return;const grid=document.querySelector('.buyer-products');if(!grid)return;const{items,pref}=chooseItems();if(!items.length)return;const sig=pref+'|'+items.map(x=>x.id).join(',');if(grid.dataset.catalogSig===sig)return;grid.dataset.catalogSig=sig;grid.innerHTML=items.map((x,i)=>{const p=fixedPrice(x.price),match=Math.max(78,98-i*3);return `<article class="ac-ai-data-card"><div class="ac-ai-data-art ac-cat-${i%5}">${visual(x)}</div><div class="buyer-product-info"><small>${esc(x.type)} · ${esc(x.location||'India')}</small><b>${esc(x.name)}</b><strong>${money(p)}</strong><small>${match}% match</small><p>${esc(reason(x,pref))}</p>${x.sellerEntered?`<div class="ac-fixed-tag">New seller listing · ${esc(x.artisan)}</div>`:`<div class="ac-fixed-tag">Fixed price · uploaded catalog</div>`}<button class="btn primary" data-buy="${esc(x.id)}">Buy now →</button></div></article>`}).join('');grid.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>checkout(items.find(x=>x.id===b.dataset.buy)))}

const style=document.createElement('style');style.textContent=`.ac-ai-data-card{overflow:hidden}.ac-ai-data-art{height:230px;display:flex;align-items:center;justify-content:center;position:relative;background:#ead3bd;overflow:hidden}.ac-ai-data-art>img{width:100%;height:100%;object-fit:cover;display:block}.ac-img-fallback{position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;padding:20px;color:#7e321e;background:linear-gradient(145deg,#ecd3bc,#f7e8d8)}.ac-img-fallback span{font-size:58px;line-height:1}.ac-img-fallback b{font:700 17px Georgia,serif}.ac-img-fallback small{font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:800}.ac-fixed-tag{display:inline-flex;align-self:flex-start;padding:5px 8px;border-radius:999px;background:rgba(188,82,43,.09);color:var(--rust);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}.ac-ai-data-card .buyer-product-info{height:auto}.ac-ai-data-card .buyer-product-info p{min-height:44px}`;document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(render)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('storage',render);window.addEventListener('load',render);setTimeout(render,300);setTimeout(render,900);
