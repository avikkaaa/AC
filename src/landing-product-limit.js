function removeLandingMarketplace(){
  if(document.querySelector('.dashboard'))return;
  const marketplace=document.querySelector('.marketplace');
  if(marketplace)marketplace.remove();
}
new MutationObserver(()=>requestAnimationFrame(removeLandingMarketplace)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',removeLandingMarketplace);
setTimeout(removeLandingMarketplace,250);
setTimeout(removeLandingMarketplace,700);
