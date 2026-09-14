function fixVisuals(root=document){
  root.querySelectorAll?.('.artist-list article .portrait').forEach(box=>{
    box.style.setProperty('display','block','important');
    box.style.setProperty('visibility','visible','important');
    box.style.setProperty('opacity','1','important');
  });
}

const style=document.createElement('style');
style.textContent=`
.artist-list article .portrait{display:block!important;visibility:visible!important;opacity:1!important;width:88px!important;min-width:88px!important;height:88px!important;aspect-ratio:1/1!important;border-radius:18px!important;overflow:hidden!important;background-color:#ead3bd!important;background-repeat:no-repeat!important}
.seller-form .artwork-upload img,.seller-form .artwork-preview img,.seller-card img,.seller-product img,.seller-products img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;background:#f7efe6!important}
.ac-ai-catalog-box{box-shadow:0 10px 30px rgba(80,45,28,.07)}
.ac-ai-catalog-box .ac-ai-ready::before{content:'✦ '}
`;
document.head.appendChild(style);

fixVisuals();
window.addEventListener('load',()=>fixVisuals());
