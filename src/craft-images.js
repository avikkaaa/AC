const craftImages=[
  ['Madhubani','https://commons.wikimedia.org/wiki/Special:Redirect/file/Madhubani_painting.jpg','Madhubani painting — Wikimedia Commons'],
  ['Warli','https://commons.wikimedia.org/wiki/Special:Redirect/file/Warli_painting.jpg','Warli painting — Wikimedia Commons'],
  ['Pattachitra','https://commons.wikimedia.org/wiki/Special:Redirect/file/Pattachitra_painting.jpg','Pattachitra painting — Wikimedia Commons'],
  ['Kalamkari','https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalamkari.jpg','Kalamkari textile — Wikimedia Commons'],
  ['Phulkari','https://commons.wikimedia.org/wiki/Special:Redirect/file/Pulkari_embroidery_of_Punjab.jpg','Phulkari embroidery — Wikimedia Commons'],
  ['Dhokra','https://commons.wikimedia.org/wiki/Special:Redirect/file/Dokra_Art.jpg','Dokra art — Wikimedia Commons'],
  ['Pottery','https://commons.wikimedia.org/wiki/Special:Redirect/file/India_pottery.jpg','Indian pottery — Wikimedia Commons'],
  ['Weaving','https://commons.wikimedia.org/wiki/Special:Redirect/file/WeavingIndia.JPG','Indian weaving — Wikimedia Commons'],
  ['Woodcraft','https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Wood_Carving.JPG','Indian wood carving — Wikimedia Commons'],
  ['Contemporary Art','https://commons.wikimedia.org/wiki/Special:Redirect/file/Contemporary_abstract_painting_by_Ib_Benoh_1970s-exhibited_at_Woods_Gerry_gallery_solo_show_in_1980_and_at_the_RISD_museum.jpg','Contemporary abstract painting — Wikimedia Commons']
];

const storyImages=[
  ['Madhubani Artisan','Bihar, India','https://2.bp.blogspot.com/-VY8ZfqkWGOk/UWTaoVhYpcI/AAAAAAAAAFk/JYOdey3FTbQ/s1600/madhubani%2B00015.jpg','Madhubani artist painting in Bihar'],
  ['Dokra Artisan','Bengal, India','https://rcchbengal.com/public/uploads/craft/craft_thumbnail-15.jpg','Dokra artisan working with traditional metal craft'],
  ['Chanderi Weaver','Madhya Pradesh, India','https://media.fortuneindia.com/fortune-india/import/2023-09/377d00ba-3511-4538-bd3d-881918401776/chanderi_b4.jpg?auto=format%2Ccompress&q=80&w=640','Chanderi handloom artisan at work']
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
  style.textContent='.craft-img,.portrait{position:relative;overflow:hidden}.craft-img img,.portrait img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .45s ease,filter .35s ease}.craft:hover .craft-img img,.stories article:hover .portrait img{transform:scale(1.06)}.craft-img:after,.portrait:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(36,22,18,0),rgba(36,22,18,.14));pointer-events:none}.portrait img{filter:saturate(.9) sepia(.05)}.artist-list article .portrait{width:130px;min-width:130px;height:150px;border-radius:0}.artist-list article .portrait img{width:100%;height:100%;object-fit:cover}.artist-list article{overflow:hidden}.artist-list article>div:last-child{padding:18px 20px}@media(max-width:1000px){.craft-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:650px){.craft-grid{grid-template-columns:repeat(2,1fr)}.craft-img{height:165px}.artist-list article .portrait{width:105px;min-width:105px;height:130px}}';
  document.head.appendChild(style);
}

function addCraftImages(){
  addRuntimeStyles();
  document.querySelectorAll('.craft-grid .craft').forEach((card,i)=>{
    const image=craftImages[i],box=card.querySelector('.craft-img');
    if(!image||!box||box.dataset.imageAdded==='true')return;
    box.dataset.imageAdded='true';box.innerHTML='';
    const img=document.createElement('img');img.src=image[1];img.alt=image[2];img.loading='lazy';img.decoding='async';img.onerror=()=>{box.dataset.imageAdded='fallback';box.innerHTML='<span>✦</span>';};box.appendChild(img);
  });
}

function addStoryImages(){
  document.querySelectorAll('.stories article').forEach((card,i)=>{
    const image=storyImages[i],box=card.querySelector('.portrait');
    if(!image||!box||box.dataset.imageAdded==='true')return;
    box.dataset.imageAdded='true';box.innerHTML='';
    const img=document.createElement('img');img.src=image[2];img.alt=image[3];img.loading='lazy';img.decoding='async';img.onerror=()=>{box.dataset.imageAdded='fallback';box.textContent=['✺','◌','✦'][i]||'✦';};box.appendChild(img);
    const title=card.querySelector('b'),meta=card.querySelector('small');if(title)title.textContent=image[0];if(meta)meta.textContent=image[1];
  });
}

function addMakerImages(){
  document.querySelectorAll('.artist-list article').forEach((card,i)=>{
    const image=makerImages[i],box=card.querySelector('.portrait');
    if(!image||!box||box.dataset.makerImageAdded==='true')return;
    box.dataset.makerImageAdded='true';box.innerHTML='';
    const img=document.createElement('img');img.src=image[1];img.alt=image[2];img.loading='lazy';img.decoding='async';img.onerror=()=>{box.dataset.makerImageAdded='fallback';box.textContent='✦';};box.appendChild(img);
  });
}

function run(){addCraftImages();addStoryImages();addMakerImages();}
window.addEventListener('load',()=>requestAnimationFrame(run));
new MutationObserver(()=>requestAnimationFrame(run)).observe(document.body,{childList:true,subtree:true});
setTimeout(run,250);
