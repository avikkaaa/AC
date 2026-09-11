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
    el.style.pointerEvents='auto';
    el.style.userSelect='text';
    el.style.position='relative';
    el.style.zIndex='2';
    el.style.color='var(--espresso)';
    el.style.caretColor='var(--rust)';
    if(!el.value&&saved[key])el.value=saved[key];
    if(el.dataset.buyerInputFixed==='1')return;
    el.dataset.buyerInputFixed='1';
    const save=()=>{
      let data={};
      try{data=JSON.parse(localStorage.getItem('ac-buyer-details')||'{}')}catch{}
      data[key]=el.value;
      localStorage.setItem('ac-buyer-details',JSON.stringify(data));
    };
    el.addEventListener('input',save);
    el.addEventListener('change',save);
  });

  const next=box.querySelector('#bf-next');
  if(next&&next.dataset.buyerDetailsFixed!=='1'){
    next.dataset.buyerDetailsFixed='1';
    next.addEventListener('click',()=>{
      const data={name:fields.name.value.trim(),phone:fields.phone.value.trim(),address:fields.address.value.trim(),budget:fields.budget.value};
      localStorage.setItem('ac-buyer-details',JSON.stringify(data));
    },true);
  }
}

new MutationObserver(()=>requestAnimationFrame(fixBuyerDetailInputs)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',fixBuyerDetailInputs);
setTimeout(fixBuyerDetailInputs,500);
setTimeout(fixBuyerDetailInputs,1000);
