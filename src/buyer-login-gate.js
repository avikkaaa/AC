function gateBuyerMarketplace(){
  const content=document.querySelector('.dashboard-content');
  if(!content)return;
  const products=content.querySelector('.buyer-products');
  const ask=content.querySelector('#buyer-ai-discovery');
  const duplicate=content.querySelector('.ai-buyer-panel');
  if(duplicate)duplicate.remove();
  if(!products){if(ask)ask.remove();return;}
  const marketplace=products.closest('.workspace-panel');
  if(marketplace)marketplace.style.display='none';
}
new MutationObserver(()=>requestAnimationFrame(gateBuyerMarketplace)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',gateBuyerMarketplace);
setTimeout(gateBuyerMarketplace,350);
setTimeout(gateBuyerMarketplace,800);
