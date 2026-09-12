const AC_BUDGETS=['Less than ₹500','₹500 – ₹1,000','₹1,000 – ₹2,000','₹2,000 – ₹5,000','₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000+','No fixed budget'];

function setReactInput(input,value){
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
  setter?.call(input,value);
  input.dispatchEvent(new Event('input',{bubbles:true}));
  input.dispatchEvent(new Event('change',{bubbles:true}));
}

function patchBuyerForm(){
  if(localStorage.getItem('ac-user-role')!=='buyer')return;
  const panel=document.querySelector('.workspace-panel');
  if(!panel)return;

  const prefInput=[...panel.querySelectorAll('input')].find(i=>i.placeholder?.toLowerCase().includes('madhubani painting'));
  if(prefInput){
    if(!prefInput.value)setReactInput(prefInput,'All products');
    const label=prefInput.closest('label');
    if(label)label.style.display='none';
  }

  const choices=panel.querySelector('.buyer-craft-options');
  if(choices)choices.style.display='none';

  const budgetSelect=[...panel.querySelectorAll('select')].find(s=>s.closest('label')?.textContent?.toLowerCase().includes('budget'));
  if(budgetSelect&&budgetSelect.dataset.acBudgetPatched!=='1'){
    budgetSelect.dataset.acBudgetPatched='1';
    const current=budgetSelect.value;
    budgetSelect.innerHTML='<option value="">Choose your budget</option>'+AC_BUDGETS.map(x=>`<option value="${x}">${x}</option>`).join('');
    if(AC_BUDGETS.includes(current))budgetSelect.value=current;
  }

  const intro=panel.querySelector('.workspace-intro');
  if(intro&&intro.textContent.includes('art preference'))intro.textContent='Enter your details and choose your budget. We’ll show products that fit your price range.';
}

new MutationObserver(()=>requestAnimationFrame(patchBuyerForm)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',patchBuyerForm);
setTimeout(patchBuyerForm,250);
setTimeout(patchBuyerForm,800);
