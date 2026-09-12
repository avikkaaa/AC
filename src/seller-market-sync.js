const ARTWORK_KEY='ac-artisan-artworks';

function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}}

function imageData(file){
  return new Promise(resolve=>{
    if(!file){resolve('');return}
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=900,scale=Math.min(1,max/Math.max(img.width,img.height));
        const canvas=document.createElement('canvas');
        canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL('image/jpeg',.72));
      };
      img.onerror=()=>resolve(String(reader.result||''));
      img.src=String(reader.result||'');
    };
    reader.onerror=()=>resolve('');
    reader.readAsDataURL(file);
  });
}

async function saveArtwork(form){
  const file=form.querySelector('input[type="file"]')?.files?.[0];
  const data=new FormData(form);
  const title=String(data.get('title')||'').trim();
  const price=String(data.get('price')||'').trim();
  if(!title||!price)return;

  const profile=readJSON('ac-artisan-profile',{});
  const artwork={
    id:'seller-'+Date.now(),
    name:title,
    title,
    type:String(data.get('craft')||profile.craft||'Handmade').trim()||'Handmade',
    craft:String(data.get('craft')||profile.craft||'Handmade').trim()||'Handmade',
    category:String(data.get('craft')||profile.craft||'Handmade').trim()||'Handmade',
    materials:String(data.get('materials')||profile.materials||'').trim(),
    description:String(data.get('description')||'').trim(),
    price,
    image:await imageData(file),
    artisan:profile.name||'Local artisan',
    location:profile.location||'India',
    sellerEntered:true,
    createdAt:new Date().toISOString()
  };

  const list=readJSON(ARTWORK_KEY,[]);
  const next=[artwork,...list].slice(0,12);
  try{localStorage.setItem(ARTWORK_KEY,JSON.stringify(next))}
  catch{
    artwork.image='';
    localStorage.setItem(ARTWORK_KEY,JSON.stringify([artwork,...list].slice(0,12)));
  }
}

document.addEventListener('submit',e=>{
  if(localStorage.getItem('ac-user-role')!=='artisan')return;
  const form=e.target;
  if(!(form instanceof HTMLFormElement))return;
  if(!form.querySelector('.artwork-upload'))return;
  saveArtwork(form);
},true);
