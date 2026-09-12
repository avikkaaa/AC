const LOCAL_GROUPS={
  dat:'/catalog/attar.webp',
  dbg:'/catalog/bags.webp',
  dbs:'/catalog/baskets.webp',
  dsp:'/catalog/showpieces.webp'
};
const FALLBACK_SPRITE='/catalog-100-sprite.jpg';
const OLD_INDEX={
  dat1:0,dat2:1,dat3:11,dat4:22,dat5:33,dat6:44,dat7:46,dat8:47,dat9:48,dat10:49,
  dbg1:2,dbg2:3,dbg3:4,dbg4:5,dbg5:6,dbg6:7,dbg7:8,dbg8:9,dbg9:10,dbg10:12,
  dbs1:13,dbs2:14,dbs3:15,dbs4:16,dbs5:17,dbs6:18,dbs7:19,dbs8:20,dbs9:21,dbs10:23,
  dsp1:24,dsp2:25,dsp3:26,dsp4:27,dsp5:28,dsp6:29,dsp7:30,dsp8:31,dsp9:32,dsp10:34,
  dpt1:35,dpt2:36,dpt3:37,dpt4:38,dpt5:39,dpt6:40,dpt7:41,dpt8:42,dpt9:43,dpt10:45
};
for(let i=1;i<=50;i++)OLD_INDEX['x'+i]=49+i;
function catalogIdFromCard(card){return card?.dataset?.productId||card?.querySelector('[data-view]')?.dataset.view||card?.querySelector('[data-pref]')?.dataset.pref||card?.querySelector('[data-buy]')?.dataset.buy||null}
function catalogIdFromText(text=''){return(window.AC_BUYER_CATALOG||[]).find(x=>text.includes(x.name))?.id||null}
function imageSpec(id){
 const m=String(id||'').match(/^(dat|dbg|dbs|dsp)(\d+)$/);
 if(m){const index=Math.max(0,Math.min(9,Number(m[2])-1));return{src:LOCAL_GROUPS[m[1]],size:'500% 200%',position:`${(index%5)*25}% ${index<5?'0%':'100%'}`}}
 const index=OLD_INDEX[id];if(index==null)return null;const col=index%10,row=Math.floor(index/10);return{src:FALLBACK_SPRITE,size:'1000% 1000%',position:`${(col/9)*100}% ${(row/9)*100}%`}
}
function paintBox(box,id){
 const spec=imageSpec(id);if(!box||!spec)return;
 box.style.backgroundImage=`url(${spec.src})`;
 box.style.setProperty('background-size',spec.size,'important');
 box.style.backgroundPosition=spec.position;
 box.style.backgroundRepeat='no-repeat';
 box.style.backgroundColor='#ead3bd';
 box.style.imageRendering='auto';
 const img=box.querySelector('img');if(img){img.style.opacity='0';img.style.pointerEvents='none'}
 const fallback=box.querySelector('.ac-image-fallback,.ac-img-fallback');if(fallback)fallback.style.display='none';
}
function applyCatalogImages(root=document){
 root.querySelectorAll?.('.ac-catalog-card').forEach(card=>{const id=catalogIdFromCard(card)||catalogIdFromText(card.textContent||'');paintBox(card.querySelector('.ac-catalog-art'),id)});
 root.querySelectorAll?.('.ac-ai-data-card').forEach(card=>{const id=catalogIdFromCard(card)||catalogIdFromText(card.textContent||'');paintBox(card.querySelector('.ac-ai-data-art'),id)});
 root.querySelectorAll?.('.ac-product-modal').forEach(card=>{const id=card.dataset.productId||catalogIdFromText(card.textContent||'');paintBox(card.querySelector('.ac-product-hero'),id)});
}
window.AC_applyProductImages=applyCatalogImages;
applyCatalogImages();
window.addEventListener('load',()=>applyCatalogImages(),{once:true});
