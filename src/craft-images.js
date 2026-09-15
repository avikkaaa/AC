const craftImages=[
  ['Madhubani','/catalog/showpieces.webp','Handmade Indian painted craft'],
  ['Warli','/catalog-100-hq.webp','Indian folk art collection'],
  ['Pattachitra','/ac-product-sprite.jpg','Traditional Indian artwork'],
  ['Kalamkari','/catalog/bags.webp','Handcrafted Indian textile work'],
  ['Phulkari','/ai-photo-strip3.jpg','Indian embroidery and textile craft'],
  ['Dhokra','/catalog/showpieces.webp','Handcrafted Indian decorative object'],
  ['Pottery','/catalog-100-sprite.jpg','Indian handmade craft collection'],
  ['Weaving','/catalog/baskets.webp','Handwoven Indian craft'],
  ['Woodcraft','/ac-product-sprite.jpg','Traditional Indian handmade craft'],
  ['Contemporary Art','/catalog/attar.webp','Indian artisan product']
];

const storyImages=[
  ['Madhubani Artisan','Bihar, India','/ai-photo-strip3.jpg','Madhubani craft story'],
  ['Dokra Artisan','Chhattisgarh, India','/catalog/showpieces.webp','Traditional metal craft story'],
  ['Handloom Weaver','India','/catalog/baskets.webp','Indian handloom and weaving story']
];

const makerImages=[
  ['Meera Devi','https://2.bp.blogspot.com/-VY8ZfqkWGOk/UWTaoVhYpcI/AAAAAAAAAFk/JYOdey3FTbQ/s1600/madhubani%2B00015.jpg','Madhubani artisan'],
  ['Raghav Sahu','https://rcchbengal.com/public/uploads/craft/craft_thumbnail-15.jpg','Dokra artisan'],
  ['Ananya Rao','https://media.fortuneindia.com/fortune-india/import/2023-09/377d00ba-3511-4538-bd3d-881918401776/chanderi_b4.jpg?auto=format%2Ccompress&q=80&w=640','Indian handloom weaver']
];

function addRuntimeStyles(){
  if(document.getElementById('craft-image-runtime-styles'))return;
  const style=document.createElement('style');
  style.id='craft-image-runtime-styles';
  style.textContent=`
    .craft-img,.portrait{position:relative;overflow:hidden;background:#eadbc9}
    .craft-img img,.portrait img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}
    .craft-img:after,.portrait:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(36,22,18,0),rgba(36,22,18,.16));pointer-events:none}
    .craft-img img{transform:scale(1.002);transition:transform .35s ease}
    .craft:hover .craft-img img{transform:scale(1.045)}
    .portrait img{filter:saturate(.92) contrast(1.02)}
    .stories article .portrait{background:#eadbc9}
    .artist-list article .portrait{width:130px;min-width:130px;height:150px;border-radius:0}
    .artist-list article .portrait img{width:100%;height:100%;object-fit:cover}
    .artist-list article{overflow:hidden}
    .artist-list article>div:last-child{padding:18px 20px}
    @media(max-width:1000px){.craft-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:650px){.craft-grid{grid-template-columns:repeat(2,1fr)}.craft-img{height:165px}.artist-list article .portrait{width:105px;min-width:105px;height:130px}}
  `;
  document.head.appendChild(style);
}

function mountImage(box,src,alt,fallback,priority='lazy'){
  if(!box)return;
  box.innerHTML='';
  const img=document.createElement('img');
  img.src=src;
  img.alt=alt||'';
  img.loading=priority;
  img.decoding='async';
  img.referrerPolicy='no-referrer';
  img.onerror=()=>{
    box.dataset.imageAdded='fallback';
    box.innerHTML=fallback;
  };
  box.appendChild(img);
}

function addCraftImages(){
  addRuntimeStyles();
  document.querySelectorAll('.craft-grid .craft').forEach((card,i)=>{
    const image=craftImages[i%craftImages.length];
    const box=card.querySelector('.craft-img');
    if(!image||!box||box.dataset.imageAdded==='true')return;
    box.dataset.imageAdded='true';
    mountImage(box,image[1],image[2],'<span>✦</span>',i<2?'eager':'lazy');
  });
}

function addStoryImages(){
  document.querySelectorAll('.stories article').forEach((card,i)=>{
    const image=storyImages[i%storyImages.length];
    const box=card.querySelector('.portrait');
    if(!image||!box||box.dataset.imageAdded==='true')return;
    box.dataset.imageAdded='true';
    mountImage(box,image[2],image[3],`<span>${['✺','◌','✦'][i]||'✦'}</span>`);
    const title=card.querySelector('b');
    const meta=card.querySelector('small');
    if(title)title.textContent=image[0];
    if(meta)meta.textContent=image[1];
  });
}

function addMakerImages(){
  document.querySelectorAll('.artist-list article').forEach((card,i)=>{
    const image=makerImages[i];
    const box=card.querySelector('.portrait');
    if(!image||!box||box.dataset.makerImageAdded==='true')return;
    box.dataset.makerImageAdded='true';
    mountImage(box,image[1],image[2],'<span>✦</span>');
  });
}

function run(){addCraftImages();addStoryImages();addMakerImages()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
document.addEventListener('click',e=>{if(e.target.closest('.dashboard-sidebar'))requestAnimationFrame(addMakerImages)},true);
