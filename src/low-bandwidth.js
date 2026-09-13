const KEY='ac-low-bandwidth';
const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
let enabled=localStorage.getItem(KEY)==='1'||(localStorage.getItem(KEY)==null&&Boolean(conn&&(conn.saveData||['slow-2g','2g','3g'].includes(conn.effectiveType))));

function optimizeImages(root=document){
  root.querySelectorAll?.('img').forEach((img,i)=>{
    img.loading=i<2?'eager':'lazy';
    img.decoding='async';
    if(enabled)img.fetchPriority=i<2?'high':'low';
  });
  root.querySelectorAll?.('video').forEach(v=>{
    if(enabled){v.pause();v.preload='none';v.removeAttribute('autoplay')}
  });
}

function apply(){
  document.documentElement.classList.toggle('ac-low-bandwidth',enabled);
  document.documentElement.dataset.lowBandwidth=enabled?'1':'0';
  optimizeImages(document);
  const b=document.querySelector('#ac-low-data-toggle');
  if(b){
    b.classList.toggle('active',enabled);
    b.setAttribute('aria-pressed',String(enabled));
    const label=b.querySelector('span');
    const next=enabled?'Low data ON':'Low data';
    if(label&&label.textContent!==next)label.textContent=next;
  }
}

function toggle(){
  enabled=!enabled;
  localStorage.setItem(KEY,enabled?'1':'0');
  apply();
}

function findLoginButton(){
  const nodes=[...document.querySelectorAll('header button,header a,nav button,nav a,.nav button,.nav a,.navbar button,.navbar a')];
  return nodes.find(el=>/^(log\s*in|login|sign\s*in)$/i.test((el.textContent||'').trim()))||
    [...document.querySelectorAll('button,a')].find(el=>/^(log\s*in|login|sign\s*in)$/i.test((el.textContent||'').trim()));
}

function placeBesideLogin(){
  const b=document.querySelector('#ac-low-data-toggle');
  if(!b)return false;
  const login=findLoginButton();
  if(!login?.parentElement)return false;
  if(b.parentElement!==login.parentElement||b.nextElementSibling!==login){
    login.parentElement.insertBefore(b,login);
  }
  b.classList.add('ac-low-data-nav');
  return true;
}

function install(){
  let b=document.querySelector('#ac-low-data-toggle');
  if(!b){
    b=document.createElement('button');
    b.id='ac-low-data-toggle';
    b.type='button';
    b.setAttribute('aria-label','Toggle low bandwidth mode');
    b.innerHTML='<i>◔</i><span>Low data</span>';
    b.addEventListener('click',toggle);
    document.body.appendChild(b);
  }
  placeBesideLogin();
  apply();
}

const style=document.createElement('style');
style.textContent=`#ac-low-data-toggle{z-index:9998;border:1px solid rgba(92,53,33,.18);background:#fffaf2;color:#5c3521;padding:9px 12px;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:7px;font:800 11px/1 system-ui;box-shadow:0 4px 14px rgba(61,35,22,.10);cursor:pointer;white-space:nowrap}#ac-low-data-toggle:not(.ac-low-data-nav){position:fixed;left:14px;bottom:14px}#ac-low-data-toggle.ac-low-data-nav{position:static!important;left:auto!important;bottom:auto!important;margin:0 8px 0 0;min-height:38px}#ac-low-data-toggle.active{background:#a4472e;color:#fff;border-color:#a4472e}#ac-low-data-toggle i{font-style:normal;font-size:14px}.ac-low-bandwidth *{scroll-behavior:auto!important}.ac-low-bandwidth *, .ac-low-bandwidth *::before,.ac-low-bandwidth *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.ac-low-bandwidth video,.ac-low-bandwidth .hero-video,.ac-low-bandwidth [class*="parallax"]{display:none!important}.ac-low-bandwidth .ac-catalog-grid,.ac-low-bandwidth .buyer-products{gap:10px!important}.ac-low-bandwidth .ac-catalog-card:nth-child(n+9),.ac-low-bandwidth .ac-ai-data-card:nth-child(n+7){content-visibility:auto;contain-intrinsic-size:300px 460px}@media(max-width:680px){#ac-low-data-toggle.ac-low-data-nav{padding:8px 9px;margin-right:5px;font-size:10px}#ac-low-data-toggle.ac-low-data-nav i{display:none}}`;
document.head.appendChild(style);

window.AC_LOW_BANDWIDTH={get enabled(){return enabled},set(v){enabled=Boolean(v);localStorage.setItem(KEY,enabled?'1':'0');apply()},toggle};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();

let queued=false;
const observer=new MutationObserver(records=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{
    queued=false;
    placeBesideLogin();
    for(const record of records){
      record.addedNodes.forEach(node=>{
        if(node.nodeType!==1)return;
        if(node.matches?.('img,video'))optimizeImages(node.parentElement||document);
        else if(node.querySelector?.('img,video'))optimizeImages(node);
      });
    }
  });
});
observer.observe(document.body,{childList:true,subtree:true});

conn?.addEventListener?.('change',()=>{
  if(localStorage.getItem(KEY)==null){
    enabled=Boolean(conn.saveData||['slow-2g','2g','3g'].includes(conn.effectiveType));
    apply();
  }
});
