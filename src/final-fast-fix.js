const AC_LOGOUT_RE=/^(log\s*out|logout|लॉग आउट|লগ আউট|लॉग आउट|લૉગ આઉટ|வெளியேறு|లాగ్ అవుట్|ಲಾಗ್ ಔಟ್|ലോഗ് ഔട്ട്|ଲଗ୍ ଆଉଟ୍|ਲੌਗ ਆਉਟ|লগ আউট)$/i;

function isLogoutControl(el){
  if(!el)return false;
  if(el.classList?.contains('sidebar-logout'))return true;
  if(el.id==='logout'||el.dataset?.action==='logout')return true;
  return AC_LOGOUT_RE.test((el.textContent||'').trim());
}

document.addEventListener('click',e=>{
  const control=e.target.closest('button,a');
  if(!isLogoutControl(control))return;
  e.preventDefault();
  e.stopImmediatePropagation();
  localStorage.removeItem('ac-user-role');
  localStorage.removeItem('ac-auth');
  localStorage.removeItem('ac-session');
  sessionStorage.clear();
  location.replace(location.origin+location.pathname);
},true);

const PHONE_WORDS=/phone|mobile|contact\s*phone|फोन|ফোন|ફોન|தொலைபேசி|ఫోన్|ದೂರವಾಣಿ|ഫോൺ|ଫୋନ|ਫੋਨ/i;
function enforceArtisanPhone(root=document){
  if(localStorage.getItem('ac-user-role')!=='artisan')return;
  root.querySelectorAll('input').forEach(input=>{
    const label=input.closest('label');
    const marker=`${input.name||''} ${input.id||''} ${input.placeholder||''} ${label?.textContent||''}`;
    if(!PHONE_WORDS.test(marker))return;
    input.type='tel';
    input.inputMode='numeric';
    input.maxLength=10;
    input.pattern='[0-9]{10}';
    if(input.dataset.acPhoneFixed)return;
    input.dataset.acPhoneFixed='1';
    input.addEventListener('input',()=>{
      const clean=input.value.replace(/\D/g,'').slice(0,10);
      if(input.value!==clean){
        const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
        setter?.call(input,clean);
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
    });
  });
}

enforceArtisanPhone();
new MutationObserver(()=>enforceArtisanPhone()).observe(document.body,{childList:true,subtree:true});
