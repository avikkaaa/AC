function fixVisuals(){
  // Buyer maker/artisan portraits: keep the sprite/photo visible and correctly framed.
  document.querySelectorAll('.artist-list article .portrait').forEach(box=>{
    box.style.setProperty('display','block','important');
    box.style.setProperty('visibility','visible','important');
    box.style.setProperty('opacity','1','important');
    box.style.setProperty('width','88px','important');
    box.style.setProperty('min-width','88px','important');
    box.style.setProperty('height','88px','important');
    box.style.setProperty('aspect-ratio','1 / 1','important');
    box.style.setProperty('border-radius','18px','important');
    box.style.setProperty('overflow','hidden','important');
    box.style.setProperty('background-repeat','no-repeat','important');
  });

  // Product photos in artisan/seller views should never stretch.
  const sellerScope=localStorage.getItem('ac-user-role')==='artisan'||document.querySelector('.seller-form');
  if(sellerScope){
    document.querySelectorAll('.seller-card img,.seller-product img,.seller-products img,.product-card img,.product-image img,.artwork-preview img,.artwork-upload img,.seller-form img').forEach(img=>{
      img.style.setProperty('width','100%','important');
      img.style.setProperty('height','100%','important');
      img.style.setProperty('object-fit','contain','important');
      img.style.setProperty('object-position','center','important');
      img.style.setProperty('background','#f7efe6','important');
    });
    document.querySelectorAll('.seller-card [style*="background-image"],.seller-product [style*="background-image"],.seller-products [style*="background-image"],.product-card [style*="background-image"],.product-image[style*="background-image"],.artwork-preview[style*="background-image"]').forEach(el=>{
      el.style.setProperty('background-size','contain','important');
      el.style.setProperty('background-position','center','important');
      el.style.setProperty('background-repeat','no-repeat','important');
      el.style.setProperty('background-color','#f7efe6','important');
    });
  }
}

const style=document.createElement('style');
style.textContent=`
.artist-list article .portrait{display:block!important;visibility:visible!important;opacity:1!important;width:88px!important;min-width:88px!important;height:88px!important;aspect-ratio:1/1!important;border-radius:18px!important;overflow:hidden!important;background-color:#ead3bd!important}
.seller-form .artwork-upload img,.seller-form .artwork-preview img{object-fit:contain!important;object-position:center!important;background:#f7efe6!important}
.ac-ai-catalog-box{box-shadow:0 10px 30px rgba(80,45,28,.07)}
.ac-ai-catalog-box .ac-ai-ready::before{content:'✦ ';}
`;
document.head.appendChild(style);

fixVisuals();
new MutationObserver(()=>requestAnimationFrame(fixVisuals)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',fixVisuals);
