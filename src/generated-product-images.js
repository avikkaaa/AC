// The old 10x10 catalog sprite made product photos blurry on phones.
// Keep the real <img> elements rendered by buyer browse/suggestions visible instead.
function restoreProductImages(){
  document.querySelectorAll('.ac-catalog-art,.ac-ai-data-art,.ac-product-hero').forEach(box=>{
    box.style.backgroundImage='none';
    box.style.backgroundSize='auto';
    box.style.backgroundPosition='center';
    const img=box.querySelector('img');
    if(img){
      img.style.opacity='1';
      img.style.pointerEvents='auto';
      img.style.width='100%';
      img.style.height='100%';
      img.style.objectFit='cover';
      img.style.filter='none';
      img.style.transform='none';
    }
  });
}

new MutationObserver(()=>requestAnimationFrame(restoreProductImages)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',restoreProductImages);
setTimeout(restoreProductImages,250);
setTimeout(restoreProductImages,900);
