function tidyLanding(){
  if(document.querySelector('.dashboard'))return;
  const marketplace=document.querySelector('.marketplace');
  if(marketplace)marketplace.remove();
  document.querySelectorAll('.text-link').forEach(link=>{
    if(link.textContent.includes('See how AI helps'))link.textContent='See how AI helps →';
  });
  document.querySelectorAll('.journey i').forEach(arrow=>arrow.textContent='→');
}
new MutationObserver(()=>requestAnimationFrame(tidyLanding)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',tidyLanding);
setTimeout(tidyLanding,250);
setTimeout(tidyLanding,700);
