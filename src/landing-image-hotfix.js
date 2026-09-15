const ART_FORMS=[
{name:'Madhubani',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#F5DCA7"/><rect x="18" y="18" width="764" height="394" rx="18" fill="none" stroke="#7A2E22" stroke-width="12"/><path d="M65 62h670M65 368h670" stroke="#D35B39" stroke-width="7" stroke-dasharray="12 10"/><g stroke="#251B18" stroke-width="7" fill="none" stroke-linecap="round"><path d="M180 215c95-95 235-95 330 0-95 95-235 95-330 0Z"/><circle cx="455" cy="205" r="10" fill="#251B18"/><path d="M180 215l-70-58v116Z"/><path d="M250 188q45 55 90 0q45 55 90 0M250 242q45-55 90 0q45-55 90 0"/></g><g fill="#B6402E" stroke="#251B18" stroke-width="5"><circle cx="625" cy="130" r="38"/><circle cx="625" cy="300" r="38"/></g><g stroke="#251B18" stroke-width="5"><path d="M625 78v104M573 130h104M588 93l74 74M662 93l-74 74M625 248v104M573 300h104M588 263l74 74M662 263l-74 74"/></g></svg>`},
{name:'Warli',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#A84E38"/><g stroke="#FFF2D7" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M400 88v205M400 105l-58 55M400 118l64 52M400 156l-78 48M400 168l88 56"/><path d="M330 294h140"/><g transform="translate(210 225)"><circle cy="-55" r="13"/><path d="M0-40l-28 45h56Z M0 5l-28 45h56Z M0 50v55M0 65l-48 35M0 65l48 35"/></g><g transform="translate(590 225)"><circle cy="-55" r="13"/><path d="M0-40l-28 45h56Z M0 5l-28 45h56Z M0 50v55M0 65l-48 35M0 65l48 35"/></g><g transform="translate(300 320) scale(.75)"><circle cy="-55" r="13"/><path d="M0-40l-28 45h56Z M0 5l-28 45h56Z M0 50v55"/></g><g transform="translate(500 320) scale(.75)"><circle cy="-55" r="13"/><path d="M0-40l-28 45h56Z M0 5l-28 45h56Z M0 50v55"/></g><circle cx="400" cy="228" r="150" stroke-dasharray="9 14"/></g></svg>`},
{name:'Pattachitra',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#E9B94E"/><rect x="20" y="20" width="760" height="390" rx="12" fill="#F8E7BB" stroke="#7B1E22" stroke-width="14"/><path d="M40 58h720M40 372h720" stroke="#1F4B43" stroke-width="16" stroke-dasharray="4 12"/><g transform="translate(400 220)" stroke="#51201D" stroke-width="7" stroke-linejoin="round"><path d="M-120 55Q-80-90 30-92Q105-94 135-15Q90-28 55 0Q22 28 12 102Q-75 110-120 55Z" fill="#2E6D5C"/><path d="M23-85Q100-160 166-102Q110-98 75-58Z" fill="#C23D2A"/><circle cx="80" cy="-90" r="8" fill="#111"/><path d="M22 100q-22 38-60 56M8 102q8 45 42 72" fill="none"/><g fill="#D25435"><circle cx="-45" cy="25" r="16"/><circle cx="-3" cy="12" r="13"/><circle cx="38" cy="16" r="11"/></g></g></svg>`},
{name:'Kalamkari',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#EFE4C5"/><g fill="none" stroke="#253D55" stroke-width="9" stroke-linecap="round"><path d="M75 355Q220 300 255 165Q285 65 400 75Q530 84 555 205Q575 298 725 330"/><path d="M254 165q-85-18-112-80q98-8 112 80ZM555 205q92-24 130-92q-114 5-130 92Z"/></g><g fill="#B2432E" stroke="#253D55" stroke-width="6"><path d="M400 92c55 35 76 82 63 132-12 50-36 83-63 114-28-31-51-64-63-114-13-50 8-97 63-132Z"/><circle cx="400" cy="215" r="46" fill="#D9A33A"/></g><g stroke="#253D55" stroke-width="5"><path d="M400 134v160M360 215h80M370 172l60 86M430 172l-60 86"/></g></svg>`},
{name:'Phulkari',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#8D2140"/><g transform="translate(70 35)"><rect width="660" height="360" fill="#B52F4B" stroke="#F2B94B" stroke-width="10"/><g fill="#F7C85E"><path d="M330 25l70 70-70 70-70-70Z"/><path d="M330 195l70 70-70 70-70-70Z"/><path d="M145 110l70 70-70 70-70-70Z"/><path d="M515 110l70 70-70 70-70-70Z"/></g><g fill="#F4E0A1"><path d="M330 58l38 37-38 38-38-38Z"/><path d="M330 228l38 37-38 38-38-38Z"/><path d="M145 143l38 37-38 38-38-38Z"/><path d="M515 143l38 37-38 38-38-38Z"/></g><path d="M0 45h660M0 315h660M45 0v360M615 0v360" stroke="#F2B94B" stroke-width="8" stroke-dasharray="14 10"/></g></svg>`},
{name:'Dhokra',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#3D2A22"/><g transform="translate(400 218)" stroke="#D5A441" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cy="-118" r="28" fill="#D5A441"/><path d="M0-90v145M0-68l-72 70M0-68l75 52M0 55l-55 112M0 55l58 112"/><path d="M-32-105q32-44 64 0M-45 5h90M-57 167h32M25 167h32"/><circle cx="-72" cy="2" r="13"/><circle cx="75" cy="-16" r="13"/></g><g fill="#D5A441"><circle cx="120" cy="90" r="9"/><circle cx="680" cy="95" r="9"/><circle cx="125" cy="335" r="9"/><circle cx="675" cy="335" r="9"/></g></svg>`},
{name:'Pottery',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#E6C8A7"/><g stroke="#63352C" stroke-width="8"><path d="M170 115h125q-32 38-22 80q19 78 8 130q-60 46-98 0q-12-52 7-130q10-42-20-80Z" fill="#B85C38"/><path d="M337 78h145q-40 48-25 102q23 88 8 158q-73 48-111 0q-14-70 8-158q14-54-25-102Z" fill="#2F5B68"/><path d="M520 135h122q-30 38-21 78q18 66 8 112q-54 43-98 0q-9-46 10-112q10-40-21-78Z" fill="#D7A13C"/></g><g stroke="#F3E2C5" stroke-width="7"><path d="M188 210h78M184 246h85M365 185h90M360 225h100M548 228h70M544 260h78"/></g></svg>`},
{name:'Weaving',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#EAD9BC"/><g stroke="#7A392D" stroke-width="7"><path d="M80 45v340M130 45v340M180 45v340M230 45v340M280 45v340M330 45v340M380 45v340M430 45v340M480 45v340M530 45v340M580 45v340M630 45v340M680 45v340M730 45v340"/></g><g stroke="#274E5A" stroke-width="18"><path d="M55 95h690M55 155h690M55 215h690M55 275h690M55 335h690"/></g><g fill="#D49A38"><path d="M205 95l50 60-50 60-50-60Z"/><path d="M400 155l50 60-50 60-50-60Z"/><path d="M595 215l50 60-50 60-50-60Z"/></g></svg>`},
{name:'Woodcraft',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#9C6039"/><path d="M0 80Q180 40 350 85T800 72M0 330Q190 285 360 330T800 315" fill="none" stroke="#704126" stroke-width="13" opacity=".65"/><g transform="translate(400 215)" fill="none" stroke="#F0C88C" stroke-width="8"><circle r="132"/><circle r="82"/><path d="M0-130Q35-72 0-24Q-35-72 0-130ZM0 130Q35 72 0 24Q-35 72 0 130ZM-130 0Q-72 35-24 0Q-72-35-130 0ZM130 0Q72 35 24 0Q72-35 130 0Z"/><path d="M-92-92Q-30-83-17-22Q-78-30-92-92ZM92-92Q83-30 22-17Q30-78 92-92ZM-92 92Q-83 30-22 17Q-30 78-92 92ZM92 92Q30 83 17 22Q78 30 92 92Z"/></g></svg>`},
{name:'Contemporary Art',svg:`<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="430" fill="#F1E6D0"/><path d="M40 340L250 55l135 180L515 75l245 265Z" fill="#A84732"/><circle cx="245" cy="210" r="105" fill="#E2B84C" opacity=".92"/><rect x="425" y="135" width="205" height="170" rx="28" fill="#345966" transform="rotate(-12 527 220)"/><path d="M75 82Q275 170 395 95T735 120" fill="none" stroke="#412B28" stroke-width="20" stroke-linecap="round"/><circle cx="625" cy="315" r="55" fill="#7D3750"/></svg>`}
];

function injectArt(box,art){
  if(!box||box.dataset.inlineArt===art.name)return;
  box.dataset.inlineArt=art.name;
  box.setAttribute('role','img');
  box.setAttribute('aria-label',`${art.name} traditional art form illustration`);
  box.style.removeProperty('background-image');
  box.style.setProperty('background','#eadbc9','important');
  box.style.setProperty('overflow','hidden','important');
  box.innerHTML=art.svg;
  const svg=box.querySelector('svg');
  if(svg){svg.style.width='100%';svg.style.height='100%';svg.style.display='block'}
}

function renderCraftArt(){
  document.querySelectorAll('.craft-grid .craft .craft-img').forEach((box,i)=>{
    const art=ART_FORMS[i%ART_FORMS.length];
    if(art)injectArt(box,art);
  });
}

let queued=false;
function queueRender(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;renderCraftArt()});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queueRender,{once:true});
else queueRender();
window.addEventListener('load',queueRender,{once:true});
new MutationObserver(queueRender).observe(document.body,{childList:true,subtree:true});
setTimeout(queueRender,50);
setTimeout(queueRender,250);
setTimeout(queueRender,1000);
