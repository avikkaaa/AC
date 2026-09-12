export function registerPWA(){
  if(!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async ()=>{
    try{
      const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});
      registration.update().catch(()=>{});
    }catch(error){
      console.warn('PWA service worker registration failed',error);
    }
  },{once:true});
}

registerPWA();
