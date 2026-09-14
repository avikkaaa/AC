// Keep buyer navigation responsive even when AI matching is still running.
function findBuyerShopButton(){
  return [...document.querySelectorAll('.dashboard-sidebar button')].find(b=>(b.textContent||'').trim().toLowerCase().startsWith('ai suggestions'));
}

document.addEventListener('click',e=>{
  const btn=e.target.closest('button');
  if(!btn||btn.disabled)return;
  const text=(btn.textContent||'').toLowerCase();
  if(!text.includes('get ai suggestions'))return;

  // React validates the form through the disabled state. Once enabled, switch
  // screens immediately instead of making the buyer wait for the network call.
  requestAnimationFrame(()=>findBuyerShopButton()?.click());
},true);

const style=document.createElement('style');
style.textContent=`
.dashboard-content{content-visibility:auto;contain-intrinsic-size:900px;}
.workspace-panel{animation:acBuyerIn .16s ease-out both;}
.dashboard-sidebar>button,.btn,.ac-catalog-card{transition-duration:.14s!important;}
.buyer-products,.ac-catalog-grid{contain:layout style;}
.buyer-products article,.ac-catalog-card{content-visibility:auto;contain-intrinsic-size:420px;}
@keyframes acBuyerIn{from{opacity:.75;transform:translateY(4px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.workspace-panel{animation:none}}
`;
document.head.appendChild(style);
