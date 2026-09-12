const AC_BUDGETS=['Less than ₹500','₹500 – ₹1,000','₹1,000 – ₹2,000','₹2,000 – ₹5,000','₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000+','No fixed budget'];
const AC_ART_TYPES=['Paintings','Pottery & Ceramics','Bags','Baskets','Showpieces','Attar / Perfumes','Woodcraft','Metal Art','Embroidery & Textiles','Jewellery'];

function setReactValue(el,value){
  if(!el)return;
  const proto=el instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;
  setter?setter.call(el,value):(el.value=value);
  el.dispatchEvent(new Event('input',{bubbles:true}));
  el.dispatchEvent(new Event('change',{bubbles:true}));
}
function getBuyer(){try{return JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{return{}}}
function saveBuyer(patch){const data={...getBuyer(),...patch};localStorage.setItem('ac-buyer-details',JSON.stringify(data));return data}
function removeOldBuyerMatch(){document.querySelectorAll('.ai-buyer-panel').forEach(el=>el.remove())}

function buyerPanel(){return[...document.querySelectorAll('.workspace-panel')].find(el=>el.textContent.includes('PERSONALIZED DISCOVERY')||el.querySelector('input[placeholder*="Madhubani"]'))}
function findFields(panel){
  const labels=[...panel.querySelectorAll('label')];
  const byLabel=text=>labels.find(l=>l.textContent.toLowerCase().includes(text))?.querySelector('input,textarea,select');
  return{
    name:byLabel('your name'),
    phone:byLabel('contact phone'),
    address:byLabel('delivery address'),
    budget:byLabel('budget range'),
    preference:[...panel.querySelectorAll('input')].find(i=>i.placeholder?.toLowerCase().includes('madhubani painting'))
  };
}
function nextButton(panel){return[...panel.querySelectorAll('button')].find(b=>/next|ai suggestions/i.test(b.textContent||''))}
function validBuyer(panel){
  const f=findFields(panel),art=getBuyer().preference||f.preference?.value||'';
  return !!(f.name?.value.trim()&&/^\d{10}$/.test(f.phone?.value||'')&&f.address?.value.trim()&&f.budget?.value&&art.trim());
}
function refreshNext(panel){
  const next=nextButton(panel);if(!next)return;
  const ready=validBuyer(panel);
  if(!next.textContent.includes('Creating'))next.disabled=!ready;
  next.style.opacity=ready?'1':'.55';
  next.style.pointerEvents=ready?'auto':'none';
}
function bridgePreference(panel,art){
  const pref=findFields(panel).preference;
  if(pref&&pref.value!==art)setReactValue(pref,art);
}

function patchBuyerForm(){
  if(localStorage.getItem('ac-user-role')!=='buyer')return;
  removeOldBuyerMatch();
  const panel=buyerPanel();if(!panel)return;
  const f=findFields(panel);

  if(f.preference)f.preference.closest('label')?.setAttribute('style','display:none');
  panel.querySelector('.buyer-craft-options')?.setAttribute('style','display:none');

  if(f.budget&&!f.budget.dataset.acBudgetPatched){
    const saved=getBuyer().budget||f.budget.value;
    f.budget.innerHTML='<option value="">Choose your budget</option>'+AC_BUDGETS.map(x=>`<option value="${x}">${x}</option>`).join('');
    f.budget.dataset.acBudgetPatched='1';
    if(AC_BUDGETS.includes(saved))setReactValue(f.budget,saved);
  }

  let picker=panel.querySelector('#ac-art-type-picker');
  if(!picker){
    picker=document.createElement('div');picker.id='ac-art-type-picker';
    picker.innerHTML='<label class="ac-art-label">Select art type</label><div class="ac-art-options"></div>';
    const form=panel.querySelector('.seller-form')||panel,next=nextButton(panel);
    form.insertBefore(picker,next||null);
    picker.querySelector('.ac-art-options').innerHTML=AC_ART_TYPES.map(x=>`<button type="button" data-art="${x}">${x}</button>`).join('');
    picker.addEventListener('click',e=>{
      const btn=e.target.closest('[data-art]');if(!btn)return;
      const art=btn.dataset.art;saveBuyer({preference:art});bridgePreference(panel,art);
      picker.querySelectorAll('[data-art]').forEach(b=>{const on=b.dataset.art===art;b.classList.toggle('selected',on);b.textContent=(on?'✓ ':'')+b.dataset.art});
      setTimeout(()=>refreshNext(panel),40);
    });
  }

  const selected=getBuyer().preference||'';
  picker.querySelectorAll('[data-art]').forEach(btn=>{const on=btn.dataset.art===selected;btn.classList.toggle('selected',on);btn.textContent=(on?'✓ ':'')+btn.dataset.art});
  if(selected)bridgePreference(panel,selected);

  if(!panel.dataset.acBuyerNextFixed){
    panel.dataset.acBuyerNextFixed='1';
    panel.addEventListener('input',()=>setTimeout(()=>refreshNext(panel),0));
    panel.addEventListener('change',e=>{
      const fields=findFields(panel);
      if(e.target===fields.budget)saveBuyer({budget:fields.budget.value});
      setTimeout(()=>refreshNext(panel),0);
    });
    panel.addEventListener('click',e=>{
      const next=nextButton(panel);if(!next||e.target!==next&&!e.target.closest?.('button')?.isSameNode(next))return;
      const fields=findFields(panel),art=getBuyer().preference||fields.preference?.value||'';
      saveBuyer({name:fields.name?.value.trim()||'',phone:fields.phone?.value||'',address:fields.address?.value.trim()||'',budget:fields.budget?.value||'',preference:art});
      if(!validBuyer(panel)){
        e.preventDefault();e.stopImmediatePropagation();
        refreshNext(panel);return;
      }
      if(fields.preference&&fields.preference.value!==art){
        e.preventDefault();e.stopImmediatePropagation();bridgePreference(panel,art);
        setTimeout(()=>{refreshNext(panel);nextButton(panel)?.click()},90);
      }
    },true);
  }

  const intro=panel.querySelector('.workspace-intro');
  if(intro)intro.textContent='Enter your details, choose your budget and select one art type. AI suggestions come next.';
  refreshNext(panel);
}

if(!document.getElementById('ac-art-type-style')){
  const style=document.createElement('style');style.id='ac-art-type-style';
  style.textContent=`#ac-art-type-picker{margin-top:18px}.ac-art-label{display:block;font-weight:800;margin-bottom:10px}.ac-art-options{display:flex;flex-wrap:wrap;gap:9px}.ac-art-options button{border:1px solid rgba(92,53,33,.2);background:#fffaf2;color:var(--espresso);padding:10px 14px;border-radius:999px;font-weight:700;cursor:pointer}.ac-art-options button.selected{background:var(--rust);border-color:var(--rust);color:white}`;
  document.head.appendChild(style);
}
new MutationObserver(()=>requestAnimationFrame(patchBuyerForm)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',patchBuyerForm);setTimeout(patchBuyerForm,250);setTimeout(patchBuyerForm,800);
