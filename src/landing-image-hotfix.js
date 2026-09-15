const CRAFT_VISUALS=[
  {
    name:'Madhubani',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Madhubani_painting.jpg/960px-Madhubani_painting.jpg',
    fallback:'/catalog/showpieces.webp',position:'center'
  },
  {
    name:'Warli',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Warli_painting.jpg/960px-Warli_painting.jpg',
    fallback:'/catalog-100-hq.webp',position:'center'
  },
  {
    name:'Pattachitra',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Pattachitra_painting.jpg/960px-Pattachitra_painting.jpg',
    fallback:'/ac-product-sprite.jpg',position:'center 48%'
  },
  {
    name:'Kalamkari',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kalamkari_painting.jpg/960px-Kalamkari_painting.jpg',
    fallback:'/catalog/bags.webp',position:'center'
  },
  {
    name:'Phulkari',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hand_embroidered_phulkari_on_cotton.jpg/960px-Hand_embroidered_phulkari_on_cotton.jpg',
    fallback:'/ai-photo-strip3.jpg',position:'center 42%'
  },
  {
    name:'Dhokra',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Dokra_Art.jpg/960px-Dokra_Art.jpg',
    fallback:'/catalog/showpieces.webp',position:'center'
  },
  {
    name:'Pottery',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Khurja_Pottery.jpg/960px-Khurja_Pottery.jpg',
    fallback:'/catalog-100-sprite.jpg',position:'center'
  },
  {
    name:'Weaving',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Handloom_Weaving.jpg/500px-Handloom_Weaving.jpg',
    fallback:'/catalog/baskets.webp',position:'center 35%'
  },
  {
    name:'Woodcraft',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Indian_Wood_Carving.JPG/960px-Indian_Wood_Carving.JPG',
    fallback:'/ac-product-sprite.jpg',position:'center'
  },
  {
    name:'Contemporary Art',
    remote:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/AK_Raina_abstract_painting_acrylic_on_canvas.png/960px-AK_Raina_abstract_painting_acrylic_on_canvas.png',
    fallback:'/catalog/attar.webp',position:'center'
  }
];

const STORY_BACKGROUNDS=[
  '/ai-photo-strip3.jpg',
  '/catalog/showpieces.webp',
  '/catalog/baskets.webp'
];

function paint(box,url,position='center'){
  box.style.setProperty('background-image',`url("${url}")`,'important');
  box.style.setProperty('background-size','cover','important');
  box.style.setProperty('background-position',position,'important');
  box.style.setProperty('background-repeat','no-repeat','important');
  box.style.setProperty('background-color','#eadbc9','important');
}

function loadArtVisual(box,visual){
  paint(box,visual.fallback,visual.position);
  box.setAttribute('role','img');
  box.setAttribute('aria-label',`${visual.name} art form`);
  box.querySelectorAll('span,img').forEach(el=>el.style.setProperty('display','none','important'));

  if(box.dataset.artVisual===visual.remote)return;
  box.dataset.artVisual=visual.remote;

  const probe=new Image();
  probe.decoding='async';
  probe.referrerPolicy='no-referrer';
  probe.onload=()=>paint(box,visual.remote,visual.position);
  probe.onerror=()=>paint(box,visual.fallback,visual.position);
  probe.src=visual.remote;
}

function forceLandingImages(){
  document.querySelectorAll('.craft-grid .craft .craft-img').forEach((box,i)=>{
    const visual=CRAFT_VISUALS[i%CRAFT_VISUALS.length];
    if(!visual)return;
    loadArtVisual(box,visual);
    box.dataset.landingImageFixed='1';
  });

  document.querySelectorAll('.stories article .portrait').forEach((box,i)=>{
    const src=STORY_BACKGROUNDS[i%STORY_BACKGROUNDS.length];
    paint(box,src,'center');
    box.querySelectorAll('span,img').forEach(el=>el.style.setProperty('display','none','important'));
  });
}

let queued=false;
function queueFix(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;forceLandingImages()});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queueFix,{once:true});
else queueFix();
window.addEventListener('load',queueFix,{once:true});
new MutationObserver(queueFix).observe(document.body,{childList:true,subtree:true});
setTimeout(queueFix,50);
setTimeout(queueFix,250);
setTimeout(queueFix,1000);
