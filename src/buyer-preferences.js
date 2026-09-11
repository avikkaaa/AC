const buyerCrafts=['Pottery','Weaving','Madhubani','Warli','Pattachitra','Kalamkari','Phulkari','Dhokra','Woodcraft','Metalcraft','Embroidery','Textile Art','Paintings','Sculpture','Contemporary Art','Home Decor','Jewellery','Baskets & Natural Fibre'];

function mountBuyerPreferences(){
  if(!location.hash&&document.querySelector('.dashboard')){
    const content=document.querySelector('.dashboard-content');
    if(content&&!content.querySelector('#buyer-ai-discovery')){
      const box=document.createElement('section');
      box.id='buyer-ai-discovery';
      box.innerHTML=`<div class="buyer-ai-head"><span class="eyebrow">✦ AI DISCOVERY</span><h2>What kind of art are you looking for?</h2><p>Choose one or more craft forms. You can also describe the style, purpose or budget you have in mind. AI will categorize your preferences and rank the closest artworks.</p></div><div class="buyer-craft-options">${buyerCrafts.map(c=>`<button type="button" data-craft="${c}">${c}</button>`).join('')}</div><textarea id="buyer-ai-request" rows="3" placeholder="Tell us more — e.g. earthy pottery for my living room, under ₹5,000..."></textarea><div class="buyer-ai-actions"><button id="buyer-ai-match" class="btn primary">✦ Find my AI matches</button><span id="buyer-ai-status"></span></div><div id="buyer-ai-results"></div>`;
      content.prepend(box);
      box.querySelectorAll('[data-craft]').forEach(btn=>btn.addEventListener('click',()=>btn.classList.toggle('selected')));
      box.querySelector('#buyer-ai-match').addEventListener('click',async()=>{
        const selected=[...box.querySelectorAll('[data-craft].selected')].map(x=>x.dataset.craft);
        const request=box.querySelector('#buyer-ai-request').value.trim();
        const status=box.querySelector('#buyer-ai-status');
        const results=box.querySelector('#buyer-ai-results');
        if(!selected.length&&!request){status.textContent='Select a craft or describe what you want.';return}
        status.textContent='AI is understanding your preferences…';results.innerHTML='';
        try{
          const r=await fetch('/api/buyer-match',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({preferences:[...selected,request].filter(Boolean).join(', '),purpose:request})});
          const d=await r.json();
          if(!r.ok)throw Error(d.error||'Matching failed');
          results.innerHTML=`<div class="buyer-ai-summary"><b>${d.category||'AI-curated craft discovery'}</b><span>${d.intent||'Matched to your selected craft preferences.'}</span></div><div class="ai-match-grid">${(d.matches||[]).map((m,i)=>`<article class="ai-match-card ${i===0?'best':''}"><div class="ai-match-score"><strong>${m.match_percentage}%</strong><small>AI match</small></div><span class="match-level">${m.match_level||'Similar option'}</span><h3>${m.product?.title||'Artwork'}</h3><small>${m.product?.craft||''} · ${m.product?.location||'India'}</small><p>${m.reason||''}</p><b>${m.product?.price||''}</b></article>`).join('')}</div><small class="ai-disclaimer">AI recommendations are based on the buyer's stated preferences and available catalog data.</small>`;
          status.textContent='';
        }catch(e){status.textContent=e.message||'AI matching failed. Please try again.'}
      });
    }
  }
}
new MutationObserver(()=>requestAnimationFrame(mountBuyerPreferences)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',mountBuyerPreferences);setTimeout(mountBuyerPreferences,400);
