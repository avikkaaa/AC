let deferredInstallPrompt=null;

function isStandalone(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
}

function removeInstallButton(){
  document.querySelector('#ac-pwa-install')?.remove();
}

function showInstallButton(){
  if(!deferredInstallPrompt || isStandalone() || document.querySelector('#ac-pwa-install')) return;
  const button=document.createElement('button');
  button.id='ac-pwa-install';
  button.type='button';
  button.textContent='Install Artisan Connect';
  button.style.cssText='position:fixed;right:16px;bottom:16px;z-index:9999;border:0;border-radius:999px;padding:12px 16px;background:#A4472E;color:#fff;font:700 14px system-ui;box-shadow:0 10px 28px rgba(61,35,22,.25);cursor:pointer';
  button.addEventListener('click',async()=>{
    if(!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try{await deferredInstallPrompt.userChoice;}catch{}
    deferredInstallPrompt=null;
    removeInstallButton();
  });
  document.body.appendChild(button);
}

window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  deferredInstallPrompt=event;
  showInstallButton();
});

window.addEventListener('appinstalled',()=>{
  deferredInstallPrompt=null;
  removeInstallButton();
});

if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});
      registration.update().catch(()=>{});
    }catch(error){
      console.warn('PWA service worker registration failed',error);
    }
  },{once:true});
}
