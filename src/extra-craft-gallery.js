const EXTRA_CRAFTS=[
  {name:'Gond',region:'Madhya Pradesh',src:'https://www.lasociedadgeografica.com/blog/uploads/gond-painting-durgabai-vyamjpg.jpg',position:'center'},
  {name:'Tanjore',region:'Tamil Nadu',src:'https://museumsofindia.gov.in/repository/file/nat_del/nat_del-75-355-117280/nat_del-75-355-117280_01_h.jpg',position:'center top'},
  {name:'Cheriyal',region:'Telangana',src:'https://tvami.com/cdn/shop/products/TSCH-25_1200x1200.jpg?v=1623405895',position:'center'},
  {name:'Blue Pottery',region:'Rajasthan',src:'https://www.alphonsostories.com/AlphonSoStoriesImages/downloads/Knowing_blue_pottery.jpg',position:'center'},
  {name:'Chikankari',region:'Uttar Pradesh',src:'https://www.hunarcourses.com/blog/wp-content/uploads/2019/12/TI-6.jpg',position:'center'},
  {name:'Kutch Embroidery',region:'Gujarat',src:'https://media.assettype.com/outlooktraveller/2024-07/36a13e5d-7d76-48b3-b3c5-ace91f82e0df/shutterstock_634625696-kutch.jpg?auto=format%2Ccompress&fit=max&w=1024',position:'center'},
  {name:'Bidriware',region:'Karnataka',src:'https://theindiacrafthouse.com/cdn/shop/products/BidriCraftCurio-Royalty-C3801A3.jpg?v=1631355056',position:'center'},
  {name:'Kashmiri Papier-Mâché',region:'Jammu & Kashmir',src:'https://www.sahapedia.org/sites/default/files/styles/sp_inline_images/public/inline-images/DSC_1997%20%281%29.jpg?itok=NOpq00F7',position:'center'}
];

function makeFallback(name){
  const initials=name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return `<div class="extra-craft-fallback"><span>✦</span><b>${initials}</b></div>`;
}

function ensureImage(box,craft){
  if(box.querySelector('.extra-authentic-img'))return;
  const img=document.createElement('img');
  img.className='extra-authentic-img';
  img.alt=`Authentic ${craft.name} Indian craft`;
  img.loading='lazy';
  img.decoding='async';
  img.referrerPolicy='no-referrer';
  img.style.cssText=`position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${craft.position};z-index:12;display:none`;
  img.onload=()=>{img.style.display='block'};
  img.onerror=()=>img.remove();
  img.src=craft.src;
  box.appendChild(img);
}

function addCards(){
  const grid=document.querySelector('.craft-grid');
  if(!grid)return;

  EXTRA_CRAFTS.forEach(craft=>{
    let card=[...grid.querySelectorAll('.craft')].find(x=>x.dataset.extraCraft===craft.name);
    if(!card){
      card=document.createElement('article');
      card.className='craft extra-craft';
      card.dataset.extraCraft=craft.name;
      card.innerHTML=`<div class="craft-img">${makeFallback(craft.name)}</div><div><b>${craft.name}</b><small>${craft.region}</small></div>`;
      grid.appendChild(card);
    }
    const box=card.querySelector('.craft-img');
    if(box){
      box.style.position='relative';
      box.style.overflow='hidden';
      ensureImage(box,craft);
    }
  });
}

const style=document.createElement('style');
style.textContent=`
.extra-craft-fallback{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(135deg,#d7b998,#eadbc9);color:#93442e}
.extra-craft-fallback span{font-size:54px;opacity:.45}
.extra-craft-fallback b{position:absolute;bottom:16px;right:18px;font:800 12px/1 system-ui;letter-spacing:2px;opacity:.5}
@media(min-width:1001px){.craft-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
`;
document.head.appendChild(style);

let queued=false;
function queue(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;addCards()});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});
else queue();
window.addEventListener('load',queue,{once:true});
new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
setTimeout(queue,120);
setTimeout(queue,650);
