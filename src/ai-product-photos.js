window.AC_AI_PHOTO_STRIP='/ai-photo-strip3.jpg';

// Three AI-generated product photos used in both Browse Products and AI Match.
// The source strip contains 3 equal-width images from left to right.
window.AC_AI_PHOTOS={
  dbg5:0,
  x35:1,
  x20:2
};

window.acAIPhotoStyle=(item)=>{
  const n=window.AC_AI_PHOTOS?.[String(item?.id||'')];
  if(n==null)return'';
  return `background-image:url('${window.AC_AI_PHOTO_STRIP}');background-size:300% 100%;background-position:${n*50}% 50%;background-repeat:no-repeat;background-color:#ead3bd`;
};
