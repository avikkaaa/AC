// Fast logout: avoid the expensive dashboard React re-render and MutationObserver cascade.
document.addEventListener('click',e=>{
  const button=e.target.closest?.('.logout,.sidebar-logout');
  if(!button)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  localStorage.removeItem('ac-user-role');

  // Give instant visual feedback while the landing page reloads.
  button.disabled=true;
  button.textContent='…';
  document.body.style.cursor='progress';

  // Hard navigation is much faster here than rebuilding the whole page in-place,
  // because this project has several DOM observers for demo enhancements/i18n.
  window.location.replace(window.location.origin+window.location.pathname);
},true);
