// Hackathon-ready demo data. This is intentionally synthetic and clearly presented as demo content.
export const demoArtisans=[
  {name:'Meera Devi',craft:'Madhubani',location:'Madhubani, Bihar',rating:'4.9',works:'18',story:'A third-generation painter translating family stories into bold natural-colour compositions.'},
  {name:'Raghav Sahu',craft:'Dhokra',location:'Bastar, Chhattisgarh',rating:'4.8',works:'12',story:'A metal artisan preserving lost-wax traditions while creating contemporary home objects.'},
  {name:'Ananya Rao',craft:'Handloom Weaving',location:'Pochampally, Telangana',rating:'4.9',works:'24',story:'A weaver blending traditional motifs with lighter contemporary textiles for modern spaces.'},
  {name:'Savitri Patnaik',craft:'Pattachitra',location:'Raghurajpur, Odisha',rating:'4.7',works:'15',story:'A storyteller-painter creating detailed mythological and nature-inspired compositions.'},
  {name:'Farida Begum',craft:'Kalamkari',location:'Machilipatnam, Andhra Pradesh',rating:'4.8',works:'21',story:'A textile artist combining hand-drawn motifs with traditional resist and natural-dye practices.'},
  {name:'Harpreet Kaur',craft:'Phulkari',location:'Patiala, Punjab',rating:'4.9',works:'16',story:'An embroidery artist reinterpreting family patterns for contemporary collectors and gifting.'}
];

export const demoProducts=[
  {title:'Monsoon Garden Panel',craft:'Madhubani',price:'₹4,800',artisan:'Meera Devi',location:'Bihar',match:'94%'},
  {title:'Lotus Memory Vessel',craft:'Dhokra',price:'₹3,200',artisan:'Raghav Sahu',location:'Chhattisgarh',match:'91%'},
  {title:'Indigo Geometry Saree',craft:'Handloom',price:'₹6,900',artisan:'Ananya Rao',location:'Telangana',match:'96%'},
  {title:'Birds of the Coast',craft:'Pattachitra',price:'₹5,600',artisan:'Savitri Patnaik',location:'Odisha',match:'89%'},
  {title:'Forest Lines Textile',craft:'Kalamkari',price:'₹7,200',artisan:'Farida Begum',location:'Andhra Pradesh',match:'93%'},
  {title:'Phulkari Sunburst',craft:'Phulkari',price:'₹5,400',artisan:'Harpreet Kaur',location:'Punjab',match:'95%'},
  {title:'Earth & Grain Wall Weave',craft:'Weaving',price:'₹8,900',artisan:'Ananya Rao',location:'Telangana',match:'88%'},
  {title:'Village Stories Triptych',craft:'Warli',price:'₹6,100',artisan:'Demo artisan',location:'Maharashtra',match:'90%'}
];

export const demoOpportunities=[
  {buyer:'Casa Terra Interiors',category:'Home Decor & Interiors',product:'Handmade wall objects',fit:'96%',value:'₹25k–₹60k / order',status:'New'},
  {buyer:'Museum Craft Store',category:'Museum & Cultural Spaces',product:'Story-led Indian craft',fit:'92%',value:'₹15k–₹40k / order',status:'Review'},
  {buyer:'The Curated Edit',category:'Art Collectors',product:'Contemporary craft',fit:'89%',value:'₹20k–₹50k / order',status:'New'},
  {buyer:'Heritage Hotels Collective',category:'Hospitality & Boutique Hotels',product:'Decorative craft objects',fit:'87%',value:'₹30k–₹80k / order',status:'Shortlisted'}
];

export const demoOrders=[
  {id:'AC-DEMO-1042',product:'Monsoon Garden Panel',artisan:'Meera Devi',amount:'₹4,800',status:'Delivered',date:'12 Aug 2026'},
  {id:'AC-DEMO-1031',product:'Lotus Memory Vessel',artisan:'Raghav Sahu',amount:'₹3,200',status:'In transit',date:'28 Aug 2026'},
  {id:'AC-DEMO-1018',product:'Indigo Geometry Saree',artisan:'Ananya Rao',amount:'₹6,900',status:'Confirmed',date:'03 Sep 2026'}
];

export const demoSaved=[
  {title:'Birds of the Coast',artisan:'Savitri Patnaik',price:'₹5,600'},
  {title:'Phulkari Sunburst',artisan:'Harpreet Kaur',price:'₹5,400'},
  {title:'Forest Lines Textile',artisan:'Farida Begum',price:'₹7,200'}
];

export function installHackathonDemo(){
  if(window.__artisanConnectDemoInstalled)return;
  window.__artisanConnectDemoInstalled=true;
  const inject=()=>{
    const path=location.hash;
    const root=document.getElementById('root');
    if(!root)return;
    const existing=document.getElementById('hackathon-demo-badge');
    if(!existing&&!document.querySelector('.dashboard')){
      const badge=document.createElement('div');
      badge.id='hackathon-demo-badge';
      badge.textContent='HACKATHON DEMO · Sample data';
      Object.assign(badge.style,{position:'fixed',bottom:'14px',right:'14px',zIndex:'9999',padding:'8px 12px',borderRadius:'999px',background:'#4A2C22',color:'#FFF9F0',font:'600 11px/1.2 system-ui',letterSpacing:'.08em',boxShadow:'0 8px 24px rgba(36,22,18,.18)'});
      document.body.appendChild(badge);
    }
    const marketplace=document.querySelector('.products');
    if(marketplace&&!marketplace.dataset.demoExpanded){
      marketplace.dataset.demoExpanded='true';
      demoProducts.slice(4,8).forEach((p,i)=>{
        const card=document.createElement('article');
        card.innerHTML=`<div class="product i${i%4}"></div><b>${p.title}</b><small>${p.craft} · ${p.location}</small><strong>${p.price}</strong>`;
        marketplace.appendChild(card);
      });
    }
    const buyers=document.querySelector('.buyer-products');
    if(buyers&&!buyers.dataset.demoExpanded){
      buyers.dataset.demoExpanded='true';
      demoProducts.slice(4).forEach((p,i)=>{
        const card=document.createElement('article');
        card.innerHTML=`<div class="product i${i%4}"></div><div class="buyer-product-info"><small>${p.craft} · ${p.location}</small><b>${p.title}</b><strong>${p.price}</strong><button>View artwork →</button></div>`;
        buyers.appendChild(card);
      });
    }
    const artistList=document.querySelector('.artist-list');
    if(artistList&&!artistList.dataset.demoExpanded){
      artistList.dataset.demoExpanded='true';
      demoArtisans.slice(3).forEach(a=>{
        const card=document.createElement('article');
        card.innerHTML=`<div class="portrait">✦</div><div><b>${a.name}</b><small>${a.craft} · ${a.location.split(',')[1]?.trim()||a.location}</small><p>${a.story}</p><button>View profile →</button></div>`;
        artistList.appendChild(card);
      });
    }
    const empty=document.querySelector('.empty-large');
    if(empty&&/No orders yet/i.test(empty.textContent)&&!empty.dataset.demoExpanded){
      empty.dataset.demoExpanded='true';
      empty.innerHTML=`<div style="display:grid;gap:12px;text-align:left">${demoOrders.map(o=>`<article style="padding:16px;border:1px solid rgba(74,44,34,.12);border-radius:18px;background:#FFF9F0"><small>${o.id} · ${o.date}</small><b style="display:block;margin:6px 0">${o.product}</b><span>${o.artisan} · ${o.amount} · ${o.status}</span></article>`).join('')}</div>`;
    }
  };
  new MutationObserver(()=>requestAnimationFrame(inject)).observe(document.body,{subtree:true,childList:true});
  window.addEventListener('load',inject);
  setTimeout(inject,300);
}

installHackathonDemo();
