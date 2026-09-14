const BUYER_ORDERS_KEY='ac-buyer-orders';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function parsePrice(text){
  const nums=String(text||'').match(/\d[\d,]*/g)?.map(n=>Number(n.replace(/,/g,'')))||[];
  if(!nums.length)return 0;
  return nums.length>1?Math.round((nums[0]+nums[1])/2):nums[0];
}
function fmt(n){return `₹${Number(n||0).toLocaleString('en-IN')}`}
function readOrders(){try{return JSON.parse(localStorage.getItem(BUYER_ORDERS_KEY)||'[]')}catch{return[]}}
function saveOrder(order){const orders=readOrders();orders.unshift(order);localStorage.setItem(BUYER_ORDERS_KEY,JSON.stringify(orders.slice(0,25)))}

function findItemFromCard(card){
  const id=card?.dataset?.productId;
  if(id&&window.AC_BUYER_CATALOG){const item=window.AC_BUYER_CATALOG.find(x=>String(x.id)===String(id));if(item)return item}
  return {id:id||`product-${Date.now()}`,name:card?.querySelector('b,h3')?.textContent?.trim()||'Handmade product',type:card?.querySelector('small,p')?.textContent?.trim()||'Handmade',category:'Handmade',price:card?.querySelector('strong')?.textContent?.trim()||'₹0'};
}
function imageStyle(item){
  if(typeof window.AC_BUYER_CATALOG_IMAGE_STYLE==='function')return window.AC_BUYER_CATALOG_IMAGE_STYLE(item);
  if(item?.image)return `background-image:url("${String(item.image).replace(/"/g,'')}");background-size:contain;background-position:center;background-repeat:no-repeat`;
  return '';
}
function openCheckout(item){
  document.querySelector('#ac-checkout-modal')?.remove();
  const price=parsePrice(item.price);
  const modal=document.createElement('div');
  modal.id='ac-checkout-modal';modal.className='modal-backdrop';
  modal.innerHTML=`<div class="login-modal ac-checkout"><button class="modal-close" aria-label="Close">×</button><span class="eyebrow">SECURE DEMO CHECKOUT</span><h2>${esc(item.name||'Handmade product')}</h2><div class="ac-checkout-image" style="${imageStyle(item)}"></div><div class="ac-checkout-row"><span>Product</span><strong>${fmt(price)}</strong></div><div class="ac-checkout-row"><span>Delivery</span><strong>Free</strong></div><div class="ac-checkout-total"><span>Total</span><strong>${fmt(price)}</strong></div><label>Full name<input id="ac-buyer-name" placeholder="Your name"/></label><label>Delivery address<textarea id="ac-buyer-address" placeholder="House no., street, city, state, PIN"></textarea></label><label>Payment method<select id="ac-payment-method"><option>UPI</option><option>Cash on delivery</option><option>Card</option></select></label><button type="button" class="btn primary ac-place-order">Place order →</button><small class="ac-demo-note">Demo checkout — no real payment is processed.</small></div>`;
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').onclick=()=>modal.remove();
  modal.onmousedown=e=>{if(e.target===modal)modal.remove()};
  modal.querySelector('.ac-place-order').onclick=()=>{
    const name=modal.querySelector('#ac-buyer-name').value.trim();
    const address=modal.querySelector('#ac-buyer-address').value.trim();
    if(!name||!address){modal.querySelector('.ac-demo-note').textContent='Please enter your name and delivery address.';return}
    const order={id:`AC-${Date.now()}`,productId:item.id||'',product:item.name||'Handmade product',price,customer:name,address,payment:modal.querySelector('#ac-payment-method').value,status:'Order placed',createdAt:new Date().toISOString()};
    saveOrder(order);
    modal.querySelector('.ac-checkout').innerHTML=`<div class="ac-order-success"><div>✓</div><span class="eyebrow">ORDER CONFIRMED</span><h2>Thank you, ${esc(name)}.</h2><p>Your order for <b>${esc(order.product)}</b> has been placed.</p><strong>${fmt(price)}</strong><small>Order ID: ${esc(order.id)}</small><button type="button" class="btn primary ac-done">Done</button></div>`;
    modal.querySelector('.ac-done').onclick=()=>modal.remove();
  };
}

function enhanceBrowse(){
  if(localStorage.getItem('ac-user-role')!=='buyer')return;
  document.querySelectorAll('.ac-catalog-card').forEach(card=>{
    const actions=card.querySelector('.ac-card-actions');
    if(actions&&!actions.querySelector('.ac-buy-now')){
      const b=document.createElement('button');b.type='button';b.className='primary-mini ac-buy-now';b.textContent='Buy now';b.onclick=e=>{e.stopPropagation();openCheckout(findItemFromCard(card))};actions.appendChild(b)
    }
  });
  const pm=document.querySelector('#ac-product-modal .ac-product-modal');
  if(pm&&!pm.querySelector('.ac-buy-modal')){
    const title=pm.querySelector('h2')?.textContent?.trim();
    const item=(window.AC_BUYER_CATALOG||[]).find(x=>x.name===title)||{name:title,price:pm.querySelector('.ac-modal-price')?.textContent||'₹0'};
    const b=document.createElement('button');b.type='button';b.className='btn primary ac-buy-modal';b.textContent='Buy now →';b.onclick=()=>openCheckout(item);pm.appendChild(b)
  }
}

const style=document.createElement('style');
style.textContent=`
.ac-card-actions{flex-wrap:wrap}.ac-card-actions .ac-buy-now{flex-basis:100%;background:var(--rust,#a4472e)!important;color:#fff!important}
.ac-catalog-art,.ac-product-hero{background-color:#f4e7da!important;background-repeat:no-repeat!important}
.buyer-dashboard img,.dashboard-content img,.artist-list img,.product-card img,.ac-catalog-card img{object-fit:contain!important;object-position:center!important;background:#f4e7da!important}
.ac-checkout{display:flex;flex-direction:column;gap:12px;max-height:90vh;overflow:auto}.ac-checkout-image{height:190px;border-radius:15px;background-color:#f1e2d4;background-repeat:no-repeat;background-position:center;background-size:contain}.ac-checkout-row,.ac-checkout-total{display:flex;justify-content:space-between;align-items:center}.ac-checkout-total{padding-top:10px;border-top:1px solid rgba(92,53,33,.15);font-size:18px}.ac-checkout label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:800;color:#644b3d}.ac-checkout input,.ac-checkout textarea,.ac-checkout select{width:100%;box-sizing:border-box;border:1px solid rgba(92,53,33,.18);border-radius:10px;padding:10px;background:#fffaf4;color:#3f2d24;font:inherit}.ac-checkout textarea{min-height:74px;resize:vertical}.ac-demo-note{color:#84695a}.ac-order-success{text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center;padding:14px}.ac-order-success>div{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#e6f5ed;color:#216047;font-size:28px;font-weight:900}.ac-order-success>strong{font:700 26px Georgia,serif;color:var(--rust,#a4472e)}`;
document.head.appendChild(style);

enhanceBrowse();
window.addEventListener('ac-browse-rendered',enhanceBrowse);
document.addEventListener('click',e=>{if(e.target.closest('[data-view]'))setTimeout(enhanceBrowse,0)},true);
window.addEventListener('load',enhanceBrowse);
