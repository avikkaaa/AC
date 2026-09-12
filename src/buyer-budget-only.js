const AC_BUDGETS=['Less than ₹500','₹500 – ₹1,000','₹1,000 – ₹2,000','₹2,000 – ₹5,000','₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000+','No fixed budget'];
const AC_ART_TYPES=['Paintings','Pottery & Ceramics','Bags','Baskets','Showpieces','Attar / Perfumes','Woodcraft','Metal Art','Embroidery & Textiles','Jewellery'];

function setReactInput(input,value){
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
  setter?.call(input,value);
  input.dispatchEvent(new Event('input',{bubbles:true}));
  input.dispatchEvent(new Event('change',{bubbles:true}));
}

function removeRepeatedMatchBox(){
  document.querySelectorAll('section,article,div').forEach(el=>{
    const text=el.textContent?.trim()||'';
    if((text.includes('AI BUYER MATCH')||text.includes('Tell us what you are looking for.'))&&el.querySelector('input,select,button')){
      const box=el.closest('section')||el;
      if(!box.classList.contains('workspace-panel'))box.remove();
    }
  });
}

function patchBuyerForm(){
  if(localStorage.getItem('ac-user-role')!=='buyer')return;
  removeRepeatedMatchBox();

  const panel=[...document.querySelectorAll('.workspace-panel')].find(x=>x.textContent.includes('PERSONALIZED DISCOVERY')||x.querySelector('input[placeholder*="Madhubani"]'));
  if(!panel)return;

  const prefInput=[...panel.querySelectorAll('input')].find(i=>i.placeholder?.toLowerCase().includes('madhubani painting'));
  if(prefInput){
    prefInput.closest('label')?.setAttribute('style','display:none');
  }

  panel.querySelector('.buyer-craft-options')?.setAttribute('style','display:none');

  const budgetSelect=[...panel.querySelectorAll('select')].find(s=>s.closest('label')?.textContent?.toLowerCase().includes('budget'));
  if(budgetSelect&&budgetSelect.dataset.acBudgetPatched!=='1'){
    budgetSelect.dataset.acBudgetPatched='1';
    const current=budgetSelect.value;
    budgetSelect.innerHTML='<option value="">Choose your budget</option>'+AC_BUDGETS.map(x=>`<option value="${x}">${x}</option>`).join('');
    if(AC_BUDGETS.includes(current))budgetSelect.value=current;
  }

  let saved={};
  try{saved=JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{}

  let picker=panel.querySelector('#ac-art-type-picker');
  if(!picker){
    picker=document.createElement('div');
    picker.id='ac-art-type-picker';
    picker.innerHTML=`<label class="ac-art-label">Select art type</label><div class="ac-art-options"></div>`;
    const form=panel.querySelector('.seller-form')||panel;
    const next=[...form.querySelectorAll('button')].find(b=>b.textContent.includes('Next'));
    form.insertBefore(picker,next||null);
  }

  const selected=saved.preference||'';
  const options=picker.querySelector('.ac-art-options');
  options.innerHTML=AC_ART_TYPES.map(x=>`<button type="button" class="${selected===x?'selected':''}" data-art="${x}">${selected===x?'✓ ':''}${x}</button>`).join('');
  options.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{
    const art=btn.dataset.art;
    let data={};try{data=JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{}
    data.preference=art;
    localStorage.setItem('ac-buyer-details',JSON.stringify(data));
    if(prefInput)setReactInput(prefInput,art);
    patchBuyerForm();
  });

  if(selected&&prefInput&&prefInput.value!==selected)setReactInput(prefInput,selected);
  const intro=panel.querySelector('.workspace-intro');
  if(intro)intro.textContent='Enter your details, choose your budget and select one art type. AI suggestions come next.';
}

const style=document.createElement('style');
style.textContent=`#ac-art-type-picker{margin-top:18px}.ac-art-label{display:block;font-weight:800;margin-bottom:10px}.ac-art-options{display:flex;flex-wrap:wrap;gap:9px}.ac-art-options button{border:1px solid rgba(92,53,33,.2);background:#fffaf2;color:var(--espresso);padding:9px 13px;border-radius:999px;font-weight:700;cursor:pointer}.ac-art-options button.selected{background:var(--rust);border-color:var(--rust);color:white}`;
document.head.appendChild(style);

new MutationObserver(()=>requestAnimationFrame(patchBuyerForm)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',patchBuyerForm);
setTimeout(patchBuyerForm,250);
setTimeout(patchBuyerForm,800);
