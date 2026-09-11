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
  ['Contemporary Art','https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_contemporary_artist.jpg','Indian contemporary art — Wikimedia Commons']
];

function addCraftImages(){
  document.querySelectorAll('.craft-grid .craft').forEach((card,i)=>{
    const image=craftImages[i];
    const box=card.querySelector('.craft-img');
    if(!image||!box||box.dataset.imageAdded==='true')return;
    box.dataset.imageAdded='true';
    box.innerHTML='';
    const img=document.createElement('img');
    img.src=image[1];
    img.alt=image[2];
    img.loading='lazy';
    img.decoding='async';
    box.appendChild(img);
  });
}

const run=()=>requestAnimationFrame(addCraftImages);
window.addEventListener('load',run);
new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
setTimeout(run,200);
