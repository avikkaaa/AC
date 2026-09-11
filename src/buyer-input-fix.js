// Buyer details input fix v2 — keep fields editable and preserve values across DOM/i18n rerenders.
function fixBuyerDetailInputs(){
  const box=document.querySelector('#buyer-ai-discovery');
  if(!box)return;
  const fields={
    name:box.querySelector('#bf-name'),
    phone:box.querySelector('#bf-phone'),
    address:box.querySelector('#bf-address'),
    budget:box.querySelector('#bf-budget')
  };
  if(!fields.name||!fields.phone||!fields.address||!fields.budget)return;

  let saved={};
  try{saved=JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{}

  Object.entries(fields).forEach(([key,el])=>{
    el.disabled=false;
    el.readOnly=false;
    el.removeAttribute('readonly');
    el.removeAttribute('disabled');
    el.style.pointerEvents='auto';
    el.style.userSelect='text';
    el.style.position='relative';
    el.style.zIndex='5';
    el.style.color='var(--espresso)';
    el.style.caretColor='var(--rust)';
    el.tabIndex=0;
    if(!el.value&&saved[key])el.value=saved[key];

    if(el.dataset.buyerInputFixed==='2')return;
    el.dataset.buyerInputFixed='2';
    const save=()=>{
      let data={};
      try{data=JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{}
      data[key]=el.value;
      localStorage.setItem('ac-buyer-details',JSON.stringify(data));
    };
    el.addEventListener('input',save);
    el.addEventListener('change',save);
    el.addEventListener('blur',save);
  });

  const next=box.querySelector('#bf-next');
  if(next&&next.dataset.buyerDetailsFixed!=='2'){
    next.dataset.buyerDetailsFixed='2';
    next.addEventListener('click',()=>{
      const data={
        name:fields.name.value.trim(),
        phone:fields.phone.value.trim(),
        address:fields.address.value.trim(),
        budget:fields.budget.value
      };
      localStorage.setItem('ac-buyer-details',JSON.stringify(data));
    },true);
  }
}

new MutationObserver(()=>requestAnimationFrame(fixBuyerDetailInputs)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','readonly']});
window.addEventListener('load',fixBuyerDetailInputs);
document.addEventListener('focusin',e=>{if(e.target?.closest?.('#buyer-ai-discovery'))fixBuyerDetailInputs()});
setTimeout(fixBuyerDetailInputs,250);
setTimeout(fixBuyerDetailInputs,600);
setTimeout(fixBuyerDetailInputs,1200);
