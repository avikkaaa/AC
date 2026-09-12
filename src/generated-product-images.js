function restoreProductImages(root=document){
  root.querySelectorAll?.('.ac-catalog-art,.ac-ai-data-art,.ac-product-hero').forEach(box=>{
    box.style.backgroundImage='none';
    box.style.backgroundSize='cover';
    box.style.backgroundPosition='center';
    box.style.backgroundRepeat='no-repeat';
    box.style.backgroundColor='#ead3bd';
    const img=box.querySelector('img');
    if(img){
      img.style.opacity='1';
      img.style.pointerEvents='auto';
      img.style.width='100%';
      img.style.height='100%';
      img.style.objectFit='cover';
      img.style.objectPosition='center';
      img.style.filter='none';
      img.style.transform='none';
      img.style.display='block';
    }
  });
}

window.AC_applyProductImages=restoreProductImages;
restoreProductImages();
window.addEventListener('load',()=>restoreProductImages(),{once:true});

const obs=new MutationObserver(()=>requestAnimationFrame(()=>restoreProductImages()));
obs.observe(document.body,{childList:true,subtree:true});
