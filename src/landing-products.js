import {demoProducts} from './demo-data.js';

function renderLandingProducts(){
  const grid=document.querySelector('.marketplace .products');
  if(!grid||!demoProducts?.length)return;
  if(grid.dataset.catalog50==='true')return;
  grid.dataset.catalog50='true';
  grid.innerHTML=demoProducts.map((p,i)=>`<article><div class="product i${i%4}"></div><b>${p.title}</b><small>${p.craft} · ${p.location}</small><strong>${p.price}</strong></article>`).join('');
}

const run=()=>requestAnimationFrame(renderLandingProducts);
window.addEventListener('load',run);
new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
setTimeout(run,250);
