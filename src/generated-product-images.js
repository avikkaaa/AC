const AC_PRODUCT_SPRITE='/catalog-100-hq.webp';
const AC_COLS=10,AC_ROWS=10;
const PDF_INDEX={};
for(let i=1;i<=10;i++)PDF_INDEX['dat'+i]=i-1;
for(let i=1;i<=10;i++)PDF_INDEX['dbg'+i]=10+i-1;
for(let i=1;i<=10;i++)PDF_INDEX['dbs'+i]=20+i-1;
for(let i=1;i<=10;i++)PDF_INDEX['dsp'+i]=30+i-1;
for(let i=1;i<=10;i++)PDF_INDEX['dpt'+i]=40+i-1;
for(let i=1;i<=50;i++)PDF_INDEX['x'+i]=50+i-1;

function spritePos(index){
  const col=index%AC_COLS,row=Math.floor(index/AC_COLS);
  return `${(col/(AC_COLS-1))*100}% ${(row/(AC_ROWS-1))*100}%`;
}
function catalogIdFromCard(card){
  return card?.dataset?.productId||card?.querySelector('[data-view]')?.dataset.view||card?.querySelector('[data-pref]')?.dataset.pref||card?.querySelector('[data-buy]')?.dataset.buy||null;
}
function catalogIdFromText(text=''){
  const hit=(window.AC_BUYER_CATALOG||[]).find(x=>text.includes(x.name));
  return hit?.id||null;
}
function paintBox(box,index){
  if(!box||index==null)return;
  box.style.backgroundImage=`url(${AC_PRODUCT_SPRITE})`;
  box.style.backgroundSize='1000% 1000%';
  box.style.backgroundPosition=spritePos(index);
  box.style.backgroundRepeat='no-repeat';
  box.style.backgroundColor='#ead3bd';
  box.style.imageRendering='auto';
  const img=box.querySelector('img');
  if(img){img.style.opacity='0';img.style.pointerEvents='none'}
  const fallback=box.querySelector('.ac-image-fallback,.ac-img-fallback');
  if(fallback)fallback.style.display='none';
}
function applyCatalogImages(root=document){
  root.querySelectorAll?.('.ac-catalog-card').forEach(card=>{
    const id=catalogIdFromCard(card)||catalogIdFromText(card.textContent||'');
    if(id&&PDF_INDEX[id]!=null)paintBox(card.querySelector('.ac-catalog-art'),PDF_INDEX[id]);
  });
  root.querySelectorAll?.('.ac-ai-data-card').forEach(card=>{
    const id=catalogIdFromCard(card)||catalogIdFromText(card.textContent||'');
    if(id&&PDF_INDEX[id]!=null)paintBox(card.querySelector('.ac-ai-data-art'),PDF_INDEX[id]);
  });
  root.querySelectorAll?.('.ac-product-modal').forEach(card=>{
    const id=card.dataset.productId||catalogIdFromText(card.textContent||'');
    if(id&&PDF_INDEX[id]!=null)paintBox(card.querySelector('.ac-product-hero'),PDF_INDEX[id]);
  });
}
window.AC_applyProductImages=applyCatalogImages;
applyCatalogImages();
window.addEventListener('load',()=>applyCatalogImages(),{once:true});
