function limitLandingProducts(){
  if(document.querySelector('.dashboard'))return;
  const grid=document.querySelector('.marketplace .products, main > .marketplace .products, .products');
  if(!grid)return;
  const cards=[...grid.querySelectorAll(':scope > article')];
  cards.slice(4).forEach(card=>card.remove());
  grid.dataset.demoExpanded='true';
}
new MutationObserver(()=>requestAnimationFrame(limitLandingProducts)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',limitLandingProducts);
setTimeout(limitLandingProducts,350);
setTimeout(limitLandingProducts,800);
