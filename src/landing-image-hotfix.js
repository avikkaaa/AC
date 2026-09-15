const CRAFT_BACKGROUNDS=[
  '/catalog/showpieces.webp',
  '/catalog-100-hq.webp',
  '/ac-product-sprite.jpg',
  '/catalog/bags.webp',
  '/ai-photo-strip3.jpg',
  '/catalog/showpieces.webp',
  '/catalog-100-sprite.jpg',
  '/catalog/baskets.webp',
  '/ac-product-sprite.jpg',
  '/catalog/attar.webp'
];

const STORY_BACKGROUNDS=[
  '/ai-photo-strip3.jpg',
  '/catalog/showpieces.webp',
  '/catalog/baskets.webp'
];

function forceLandingImages(){
  document.querySelectorAll('.craft-grid .craft .craft-img').forEach((box,i)=>{
    const src=CRAFT_BACKGROUNDS[i%CRAFT_BACKGROUNDS.length];
    box.style.setProperty('background-image',`url("${src}")`,'important');
    box.style.setProperty('background-size','cover','important');
    box.style.setProperty('background-position','center','important');
    box.style.setProperty('background-repeat','no-repeat','important');
    box.style.setProperty('background-color','#eadbc9','important');
    box.querySelectorAll('span,img').forEach(el=>el.style.setProperty('display','none','important'));
    box.dataset.landingImageFixed='1';
  });

  document.querySelectorAll('.stories article .portrait').forEach((box,i)=>{
    const src=STORY_BACKGROUNDS[i%STORY_BACKGROUNDS.length];
    box.style.setProperty('background-image',`url("${src}")`,'important');
    box.style.setProperty('background-size','cover','important');
    box.style.setProperty('background-position','center','important');
    box.style.setProperty('background-repeat','no-repeat','important');
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
