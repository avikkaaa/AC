const AC_PRODUCT_SPRITE='/catalog-100-sprite.jpg';
const AC_COLS=10,AC_ROWS=10;

const PDF_INDEX={
  dat1:0,dat2:1,dat3:11,dat4:22,dat5:33,dat6:44,dat7:46,dat8:47,dat9:48,dat10:49,
  dbg1:2,dbg2:3,dbg3:4,dbg4:5,dbg5:6,dbg6:7,dbg7:8,dbg8:9,dbg9:10,dbg10:12,
  dbs1:13,dbs2:14,dbs3:15,dbs4:16,dbs5:17,dbs6:18,dbs7:19,dbs8:20,dbs9:21,dbs10:23,
  dsp1:24,dsp2:25,dsp3:26,dsp4:27,dsp5:28,dsp6:29,dsp7:30,dsp8:31,dsp9:32,dsp10:34,
  dpt1:35,dpt2:36,dpt3:37,dpt4:38,dpt5:39,dpt6:40,dpt7:41,dpt8:42,dpt9:43,dpt10:45
};
for(let i=1;i<=50;i++)PDF_INDEX['x'+i]=49+i;

function spritePos(index){
 const col=index%AC_COLS,row=Math.floor(index/AC_COLS);
 return `${(col/(AC_COLS-1))*100}% ${(row/(AC_ROWS-1))*100}%`;
}
function catalogIdFromCard(card){
 return card.querySelector('[data-view]')?.dataset.view||card.querySelector('[data-pref]')?.dataset.pref||card.querySelector('[data-buy]')?.dataset.buy||null;
}
function catalogIdFromText(text=''){
 const list=window.AC_BUYER_CATALOG||[];
 const hit=list.find(x=>text.includes(x.name));
 return hit?.id||null;
}
function paintBox(box,index){
 if(!box||index==null)return;
 box.style.backgroundImage=`url(${AC_PRODUCT_SPRITE})`;
 box.style.backgroundSize='1000% 1000%';
 box.style.backgroundPosition=spritePos(index);
 box.style.backgroundRepeat='no-repeat';
 box.style.backgroundColor='#ead3bd';
 const img=box.querySelector('img');
 if(img){img.style.opacity='0';img.style.pointerEvents='none'}
 const fallback=box.querySelector('.ac-image-fallback,.ac-img-fallback');
 if(fallback)fallback.style.display='none';
}
function applyCatalogImages(){
 document.querySelectorAll('.ac-catalog-card').forEach(card=>{
  const id=catalogIdFromCard(card)||catalogIdFromText(card.textContent||'');
  if(id&&PDF_INDEX[id]!=null)paintBox(card.querySelector('.ac-catalog-art'),PDF_INDEX[id]);
 });
 document.querySelectorAll('.ac-ai-data-card').forEach(card=>{
  const id=catalogIdFromCard(card)||catalogIdFromText(card.textContent||'');
  if(id&&PDF_INDEX[id]!=null)paintBox(card.querySelector('.ac-ai-data-art'),PDF_INDEX[id]);
 });
 document.querySelectorAll('.ac-product-modal').forEach(card=>{
  const id=catalogIdFromText(card.textContent||'');
  if(id&&PDF_INDEX[id]!=null)paintBox(card.querySelector('.ac-product-hero'),PDF_INDEX[id]);
 });
}
const s=document.createElement('style');
s.textContent=`.ac-catalog-art,.ac-ai-data-art,.ac-product-hero{background-color:#ead3bd;background-repeat:no-repeat}.ac-catalog-art>img,.ac-ai-data-art>img,.ac-product-hero>img{transition:opacity .15s ease}`;
document.head.appendChild(s);
new MutationObserver(()=>requestAnimationFrame(applyCatalogImages)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',applyCatalogImages);
setTimeout(applyCatalogImages,250);
setTimeout(applyCatalogImages,900);
