const AUTHENTIC_CRAFTS=[
  {name:'Madhubani',src:'https://www.memeraki.com/cdn/shop/files/MU9.2_800x.jpg?v=1708076600',position:'center'},
  {name:'Warli',src:'https://newsmeter.in/h-upload/2022/01/18/313538-warli-painting.webp',position:'center'},
  {name:'Pattachitra',src:'https://premlathasinternational.com/storage/2024/02/odisha_pattachitra.jpeg',position:'center'},
  {name:'Kalamkari',src:'https://images.metmuseum.org/CRDImages/is/original/Rumal%20MMA%201928.159.1.jpg',position:'center'},
  {name:'Phulkari',src:'https://cdn.webshopapp.com/shops/127908/files/416838839/222x124-cm-the-traditional-embroidery-of-punjab-in.jpg',position:'center'},
  {name:'Dhokra',src:'https://vajiramandravi.s3.us-east-1.amazonaws.com/media/2022/12/22/14/28/19/Dokra_Metal_Crafts.jpg',position:'center'},
  {name:'Pottery',src:'https://media.assettype.com/outlooktraveller/import/outlooktraveller/public/uploads/articles/travelnews/shutterstock_1686481294.jpg?auto=format%2Ccompress&enlarge=true&fit=max&h=675&w=1200',position:'center 38%'},
  {name:'Weaving',src:'https://cdn.shopify.com/s/files/1/0537/5557/files/IMG_2571_2048x2048.jpg?v=1694453395',position:'center'},
  {name:'Woodcraft',src:'https://images.prismic.io/pallavinopany/Ztrn9rzzk9ZrXGQ8_forest1.jpg',position:'center'},
  {name:'Contemporary Art',src:'https://serenademagazine.art/content/images/2024/10/Thota-vaikuntam--Untitled--Acrylic-on-canvas--36-x-48-inches--2023.jpg',position:'center'}
];

function applyAuthenticCraftImage(box,craft){
  if(!box||!craft||box.dataset.authenticImage===craft.src)return;
  box.dataset.authenticImage=craft.src;
  box.style.position='relative';

  const img=document.createElement('img');
  img.className='authentic-craft-img';
  img.alt=`Authentic ${craft.name} Indian artwork`;
  img.loading='eager';
  img.decoding='async';
  img.referrerPolicy='no-referrer';
  img.style.cssText=`position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${craft.position};display:none;z-index:2`;
  img.onload=()=>{img.style.display='block'};
  img.onerror=()=>{img.remove();box.dataset.authenticImage='fallback'};
  img.src=craft.src;
  box.appendChild(img);
}

function hydrateAuthenticCrafts(){
  document.querySelectorAll('.craft-grid .craft .craft-img').forEach((box,i)=>{
    applyAuthenticCraftImage(box,AUTHENTIC_CRAFTS[i%AUTHENTIC_CRAFTS.length]);
  });
}

let queued=false;
function queue(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;hydrateAuthenticCrafts()});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});
else queue();
window.addEventListener('load',queue,{once:true});
new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
setTimeout(queue,100);
setTimeout(queue,500);
setTimeout(queue,1500);
