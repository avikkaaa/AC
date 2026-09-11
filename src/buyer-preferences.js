const buyerCrafts=['Pottery','Weaving','Madhubani','Warli','Pattachitra','Kalamkari','Phulkari','Dhokra','Woodcraft','Metalcraft','Embroidery','Textile Art','Paintings','Sculpture','Contemporary Art','Home Decor','Jewellery','Baskets & Natural Fibre'];

function mountBuyerPreferences(){
  if(!location.hash&&document.querySelector('.dashboard')){
    const content=document.querySelector('.dashboard-content');
    if(content&&!content.querySelector('#buyer-ai-discovery')){
      const box=document.createElement('section');
      box.id='buyer-ai-discovery';
      box.innerHTML=`<style>
        #buyer-ai-discovery{margin-bottom:24px;padding:28px;border-radius:24px;background:var(--ivory);border:1px solid rgba(74,44,34,.1);box-shadow:0 12px 35px rgba(36,22,18,.05)}
        #buyer-ai-discovery .buyer-ai-head h2{margin:8px 0 8px;font-size:clamp(28px,3vw,42px)}
        #buyer-ai-discovery .buyer-ai-head p{margin-top:0}.buyer-multi-note{display:block;margin:14px 0 10px;color:var(--rust);font-size:12px;font-weight:800}
        .buyer-craft-options{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0 18px}.buyer-craft-options button{border:1px solid var(--sand);background:var(--cream);color:var(--brown);padding:10px 14px;border-radius:999px;font-weight:700;transition:.18s}.buyer-craft-options button:hover{border-color:var(--terra);transform:translateY(-1px)}.buyer-craft-options button.selected{background:var(--rust);border-color:var(--rust);color:var(--ivory)}.buyer-craft-options button.selected:before{content:'✓ ';font-weight:900}
        #buyer-ai-request{width:100%;border:1px solid var(--sand);background:var(--cream);border-radius:14px;padding:14px;color:var(--espresso);resize:vertical;outline:none}.buyer-ai-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:14px}#buyer-ai-status{font-size:12px;color:var(--rust);font-weight:700}.buyer-ai-summary{display:grid;gap:4px;margin:24px 0 14px}.buyer-ai-summary span{font-size:13px;color:var(--burg)}.ai-match-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.ai-match-card{position:relative;background:var(--cream);border:1px solid var(--sand);border-radius:18px;padding:18px}.ai-match-card.best{border:2px solid var(--terra)}.ai-match-score{display:flex;align-items:end;gap:7px}.ai-match-score strong{font:600 32px 'Playfair Display';color:var(--rust)}.ai-match-score small,.match-level{font-size:10px}.match-level{display:inline-block;margin:8px 0;padding:5px 8px;border-radius:999px;background:var(--peach);color:var(--rust);font-weight:800}.ai-match-card h3{margin:7px 0}.ai-disclaimer{display:block;margin-top:12px;color:var(--burg)}
      </style><div class="buyer-ai-head"><span class="eyebrow">✦ PERSONALIZED DISCOVERY</span><h2>What type of art would you like to buy?</h2><p>Pick <b>all</b> the art forms you are interested in. We’ll use every selected choice to recommend products that fit you.</p></div><span class="buyer-multi-note">MULTIPLE CHOICES ALLOWED — SELECT ALL THAT APPLY</span><div class="buyer-craft-options">${buyerCrafts.map(c=>`<button type="button" aria-pressed="false" data-craft="${c}">${c}</button>`).join('')}</div><textarea id="buyer-ai-request" rows="3" placeholder="Optional: tell us more — e.g. earthy pieces for my living room, under ₹5,000..."></textarea><div class="buyer-ai-actions"><button id="buyer-ai-match" class="btn primary">Show products for my choices →</button><span id="buyer-ai-status"></span></div><div id="buyer-ai-results"></div>`;
      content.prepend(box);
      box.querySelectorAll('[data-craft]').forEach(btn=>btn.addEventListener('click',()=>{const on=!btn.classList.contains('selected');btn.classList.toggle('selected',on);btn.setAttribute('aria-pressed',String(on));}));
      box.querySelector('#buyer-ai-match').addEventListener('click',async()=>{
        const selected=[...box.querySelectorAll('[data-craft].selected')].map(x=>x.dataset.craft);
        const request=box.querySelector('#buyer-ai-request').value.trim();
        const status=box.querySelector('#buyer-ai-status');
        const results=box.querySelector('#buyer-ai-results');
        if(!selected.length){status.textContent='Choose at least one art type.';return}
        status.textContent=`Finding products for ${selected.length} selected ${selected.length===1?'choice':'choices'}…`;results.innerHTML='';
        try{
          const r=await fetch('/api/buyer-match',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({selectedCrafts:selected,preferences:selected.join(', '),purpose:request})});
          const d=await r.json();
          if(!r.ok)throw Error(d.error||'Matching failed');
          const matches=d.matches||[];
          results.innerHTML=`<div class="buyer-ai-summary"><b>Recommended for: ${selected.join(' · ')}</b><span>${d.intent||'Products ranked using all of your selected art preferences.'}</span></div>${matches.length?`<div class="ai-match-grid">${matches.map((m,i)=>`<article class="ai-match-card ${i===0?'best':''}"><div class="ai-match-score"><strong>${m.match_percentage}%</strong><small>match</small></div><span class="match-level">${m.match_level||'Recommended'}</span><h3>${m.product?.title||'Artwork'}</h3><small>${m.product?.craft||''} · ${m.product?.location||'India'}</small><p>${m.reason||''}</p><b>${m.product?.price||''}</b></article>`).join('')}</div>`:`<p>No products match those choices yet. Try adding another art type.</p>`}<small class="ai-disclaimer">Recommendations use your selected art types and the products currently available in the catalog.</small>`;
          status.textContent='';
        }catch(e){status.textContent=e.message||'Matching failed. Please try again.'}
      });
    }
  }
}
new MutationObserver(()=>requestAnimationFrame(mountBuyerPreferences)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',mountBuyerPreferences);setTimeout(mountBuyerPreferences,400);
