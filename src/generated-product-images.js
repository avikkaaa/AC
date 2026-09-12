const AC_PRODUCT_SPRITE='/ac-product-sprite.jpg';
const AC_POS={clock:'0% 0%',motorcycle:'25% 0%',mirror:'50% 0%',tote:'75% 0%',baskets:'100% 0%',wolf:'0% 100%',ceramics:'25% 100%',attar:'50% 100%',folk:'75% 100%',painting:'100% 100%'};

function pickImage(text=''){
 const t=text.toLowerCase();
 if(/clock|ginkgo/.test(t))return'clock';
 if(/motorcycle|bike/.test(t))return'motorcycle';
 if(/mirror|sunburst/.test(t))return'mirror';
 if(/tote|bag|clutch|pouch|embroider/.test(t))return'tote';
 if(/basket|bamboo|cane|rattan/.test(t))return'baskets';
 if(/wolf|intarsia|wood|woodcraft|wooden/.test(t))return'wolf';
 if(/ceramic|pottery|mug|bowl|vase|plate|pitcher/.test(t))return'ceramics';
 if(/attar|perfume|oud|musk|sandalwood/.test(t))return'attar';
 if(/dhokra|folk|metal sculpture|showpiece|sculpture/.test(t))return'folk';
 if(/madhubani|painting|pattachitra|warli|artwork/.test(t))return'painting';
 return null;
}

function paintBox(box,key){
 if(!box||!key)return;
 box.style.backgroundImage=`url(${AC_PRODUCT_SPRITE})`;
 box.style.backgroundSize='500% 200%';
 box.style.backgroundPosition=AC_POS[key];
 box.style.backgroundRepeat='no-repeat';
 box.style.backgroundColor='#ead3bd';
 const img=box.querySelector('img');
 if(img){img.style.opacity='0';img.style.pointerEvents='none'}
 const fallback=box.querySelector('.ac-image-fallback,.ac-img-fallback');
 if(fallback)fallback.style.display='none';
}

function applyGeneratedImages(){
 document.querySelectorAll('.ac-catalog-card').forEach(card=>{
  const key=pickImage(card.textContent||'');
  paintBox(card.querySelector('.ac-catalog-art'),key);
 });
 document.querySelectorAll('.ac-ai-data-card').forEach(card=>{
  const key=pickImage(card.textContent||'');
  paintBox(card.querySelector('.ac-ai-data-art'),key);
 });
 document.querySelectorAll('.ac-product-modal').forEach(card=>{
  const key=pickImage(card.textContent||'');
  paintBox(card.querySelector('.ac-product-hero'),key);
 });
 document.querySelectorAll('.buyer-products article').forEach(card=>{
  if(card.classList.contains('ac-ai-data-card'))return;
  const key=pickImage(card.textContent||'');
  const box=card.querySelector('.product');
  if(box)paintBox(box,key||'painting');
 });
}

const s=document.createElement('style');
s.textContent=`.ac-catalog-art,.ac-ai-data-art,.ac-product-hero,.buyer-products .product{background-color:#ead3bd;background-position:center;background-repeat:no-repeat}.ac-catalog-art>img,.ac-ai-data-art>img,.ac-product-hero>img{transition:opacity .15s ease}`;
document.head.appendChild(s);
new MutationObserver(()=>requestAnimationFrame(applyGeneratedImages)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',applyGeneratedImages);
setTimeout(applyGeneratedImages,250);
setTimeout(applyGeneratedImages,900);
