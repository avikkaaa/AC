const AUTHENTIC={
  madhubani:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Madhubani_painting.jpg',
  warli:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Warli_painting.jpg',
  pattachitra:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pattachitra_painting.jpg',
  kalamkari:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalamkari.jpg',
  phulkari:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pulkari_embroidery_of_Punjab.jpg',
  dhokra:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dokra_Art.jpg',
  pottery:'https://commons.wikimedia.org/wiki/Special:Redirect/file/India_pottery.jpg',
  weaving:'https://commons.wikimedia.org/wiki/Special:Redirect/file/WeavingIndia.JPG',
  wood:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Wood_Carving.JPG'
};

const POOLS={
  'metal art':[AUTHENTIC.dhokra],
  'showpieces':[AUTHENTIC.dhokra,AUTHENTIC.pattachitra],
  'embroidery & textile':[AUTHENTIC.phulkari,AUTHENTIC.kalamkari,AUTHENTIC.weaving],
  'bags':[AUTHENTIC.phulkari,AUTHENTIC.kalamkari],
  'baskets':[AUTHENTIC.weaving,AUTHENTIC.phulkari],
  'bamboo & cane':[AUTHENTIC.weaving,AUTHENTIC.kalamkari],
  'woodcraft':[AUTHENTIC.wood],
  'ceramics':[AUTHENTIC.pottery],
  'paintings':[AUTHENTIC.madhubani,AUTHENTIC.warli,AUTHENTIC.pattachitra],
  'jewellery':[AUTHENTIC.dhokra,AUTHENTIC.phulkari],
  'attar':[AUTHENTIC.kalamkari],
  'handmade':[AUTHENTIC.madhubani,AUTHENTIC.warli,AUTHENTIC.pattachitra]
};

function hash(v=''){let h=0;for(let i=0;i<v.length;i++)h=(h*31+v.charCodeAt(i))>>>0;return h}
function text(item){return `${item?.name||''} ${item?.type||''} ${item?.category||''}`.toLowerCase()}
function pick(item){
  if(item?.image)return item.image;
  const t=text(item);
  if(t.includes('madhubani'))return AUTHENTIC.madhubani;
  if(t.includes('warli'))return AUTHENTIC.warli;
  if(t.includes('pattachitra'))return AUTHENTIC.pattachitra;
  if(t.includes('kalamkari'))return AUTHENTIC.kalamkari;
  if(t.includes('phulkari')||t.includes('chikankari')||t.includes('embroider'))return AUTHENTIC.phulkari;
  if(t.includes('dhokra')||t.includes('dokra')||t.includes('metal'))return AUTHENTIC.dhokra;
  if(t.includes('pottery')||t.includes('ceramic')||t.includes('terracotta'))return AUTHENTIC.pottery;
  if(t.includes('wood'))return AUTHENTIC.wood;
  if(t.includes('weav')||t.includes('textile')||t.includes('basket')||t.includes('bamboo')||t.includes('cane')||t.includes('rattan'))return AUTHENTIC.weaving;
  const pool=POOLS[String(item?.category||'').toLowerCase()]||[AUTHENTIC.madhubani,AUTHENTIC.warli,AUTHENTIC.pattachitra,AUTHENTIC.kalamkari,AUTHENTIC.phulkari,AUTHENTIC.dhokra,AUTHENTIC.pottery,AUTHENTIC.weaving,AUTHENTIC.wood];
  return pool[hash(String(item?.id||item?.name||''))%pool.length];
}

function apply(el,item){
  if(!el||!item)return;
  const url=pick(item);
  el.style.backgroundImage=`url("${String(url).replace(/"/g,'')}")`;
  el.style.backgroundSize=item?.image?'contain':'cover';
  el.style.backgroundPosition='center';
  el.style.backgroundRepeat='no-repeat';
  el.style.backgroundColor='#eadbc9';
  el.dataset.aiImageDone='1';
}
function itemFromElement(el){
  const id=el.dataset.productId||el.closest('[data-product-id]')?.dataset.productId;
  return (window.AC_BUYER_CATALOG||[]).find(x=>String(x.id)===String(id))||null;
}
function hydrate(root=document){
  root.querySelectorAll?.('[data-ai-product-image]').forEach(el=>{
    const item=itemFromElement(el);if(item)apply(el,item);
  });
}
async function fetchImage(item){return pick(item)}
async function load(el,item){apply(el,item);return pick(item)}

window.AC_AI_PRODUCT_IMAGES={hydrate,load,fetchImage,instantPreview:pick,originalVisual:pick};
window.addEventListener('ac-browse-rendered',()=>hydrate());
window.addEventListener('load',()=>hydrate(),{once:true});
