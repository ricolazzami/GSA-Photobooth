const SCREENS=['screen-template','screen-camera','screen-capture','screen-result'];
const STRIP_W=1200, STRIP_H=3600, PHOTO_W=1000, PHOTO_H=750, PHOTO_X=100, PHOTO_Y=[100,920,1740,2560];
let stream=null, shots=[], selectedTpl=1, uploading=false, countdownLock=false;

const $=s=>document.getElementById(s);
const show=id=>{SCREENS.forEach(s=>{const el=$(s); if(el) el.classList.remove('active');}); const t=$(id); if(t) t.classList.add('active'); window.scrollTo(0,0);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function startCamera(){
  try{
    if(stream) stream.getTracks().forEach(t=>t.stop());
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1920},height:{ideal:1080}},audio:false});
    const vp=$('video-preview'); vp.srcObject=stream; await vp.play().catch(()=>{});
    return true;
  }catch(e){
    const err=$('camera-error');
    if(err){err.textContent='Camera unavailable: '+(e.message||e.name)+' \u2014 needs HTTPS & Safari permission.'; err.classList.remove('hidden');}
    return false;
  }
}

function captureFrame(video){
  const vw=video.videoWidth||1280, vh=video.videoHeight||720;
  const c=document.createElement('canvas'); c.width=vw; c.height=vh;
  const ctx=c.getContext('2d'); ctx.translate(vw,0); ctx.scale(-1,1); ctx.drawImage(video,0,0,vw,vh); return c;
}

async function composeStrip(frames){
  const canvas=document.createElement('canvas'); canvas.width=STRIP_W; canvas.height=STRIP_H;
  const ctx=canvas.getContext('2d'); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,STRIP_W,STRIP_H);
  frames.forEach((fc,i)=>{
    const fw=fc.width,fh=fc.height,scale=Math.max(PHOTO_W/fw,PHOTO_H/fh),sw=PHOTO_W/scale,sh=PHOTO_H/scale,sx=(fw-sw)/2,sy=(fh-sh)/2;
    ctx.drawImage(fc,sx,sy,sw,sh,PHOTO_X,PHOTO_Y[i],PHOTO_W,PHOTO_H);
  });
  const img=new Image(); img.crossOrigin='anonymous'; img.src=`template-${selectedTpl===1?'a':'b'}.png`;
  await new Promise(r=>{img.onload=r; img.onerror=r; setTimeout(r,1000);});
  if(img.naturalWidth) ctx.drawImage(img,0,0,STRIP_W,STRIP_H);
  return canvas.toDataURL('image/jpeg',0.92);
}

function generateQRCode(url){
  const el=$('qrcode'); if(!el) return; el.innerHTML='';
  try{ if(typeof QRCode!=='undefined') new QRCode(el,{text:url,width:196,height:196}); }
  catch{ el.innerHTML=`<a href="${url}" target="_blank" class="text-[12px] break-all underline">${url}</a>`; }
}

async function uploadToR2(base64){
  uploading=true; const st=$('upload-status'); if(st) st.textContent='Uploading...';
  try{
    const res=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:base64})});
    const data=await res.json(); if(!res.ok) throw new Error(data.error);
    if(st) st.textContent='Ready to download \u2014 scan QR below';
    generateQRCode(data.url);
    const dl=$('download-link'); if(dl){dl.href=data.url; dl.classList.remove('hidden');}
  }catch(e){
    if(st){
      st.innerHTML='<span class="text-error font-medium">Offline / Upload failed.</span> Long-press image to save directly to iPad Photos.';
    }
    const cardEl=$('qrcode');
    if(cardEl){
      cardEl.innerHTML='<div class="text-[13px] text-on-surface-variant text-center py-4"><span class="material-symbols-outlined text-[32px] text-error mb-1">cloud_off</span><br/>Network unavailable.<br/>Save image above manually.</div>';
    }
  }finally{ uploading=false; }
}

window.selectTemplate=id=>{
  selectedTpl=id;
  document.querySelectorAll('.template-card').forEach(c=>{
    c.classList.remove('selected','border-primary'); c.classList.add('border-outline');
  });
  const card=$(`card-tpl-${id}`);
  if(card){ card.classList.add('selected','border-primary'); card.classList.remove('border-outline'); }
};

$('btn-template-next')?.addEventListener('click', async()=>{
  show('screen-camera'); await startCamera();
});

$('btn-start-capture')?.addEventListener('click', async()=>{
  if(countdownLock) return; countdownLock=true;
  shots=[];
  const vc=$('video-capture'); vc.srcObject=stream; await vc.play().catch(()=>{});
  show('screen-capture');
  const num=$('countdown-num'), flash=$('flash');
  for(let i=0;i<4;i++){
    $('shot-progress').textContent=`Shot ${i+1}/4`;
    for(let c=3;c>=1;c--){if(num) num.textContent=c; await sleep(800);}
    if(num) num.textContent='';
    if(flash){flash.classList.add('show'); await sleep(350); flash.classList.remove('show');}
    shots.push(captureFrame(vc));
    if(i<3) await sleep(1200);
  }
  const strip=await composeStrip(shots);
  $('result-img').src=strip;
  show('screen-result');
  await uploadToR2(strip);
  countdownLock=false;
});

$('btn-start-over')?.addEventListener('click',()=>{
  shots=[];
  $('qrcode').innerHTML=''; $('download-link').classList.add('hidden'); $('upload-status').textContent='';
  show('screen-template');
});