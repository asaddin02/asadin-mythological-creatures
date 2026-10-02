import { bi, escapeHtml as esc, icon, editorialArt } from '../ui.js';
import { resolveLocalized } from '../i18n.js';

export function artwork(creature) {
  const art = editorialArt(creature.slug), source = creature.images?.[0];
  return {
    src: art || source?.url || source?.preview_url || source?.thumbnail_url || '',
    name: resolveLocalized(creature.display_name, creature.canonical_name),
    slug: creature.slug,
    credit: art ? bi('Interpretasi artistik AI · Mythics', 'AI artistic interpretation · Mythics') : [source?.author, source?.license].filter(Boolean).join(' · '),
  };
}
export function previewAttributes(data) {
  return data.src ? `data-preview-src="${esc(data.src)}" data-preview-name="${esc(data.name)}" data-preview-slug="${esc(data.slug)}" data-preview-credit="${esc(data.credit)}" aria-label="${esc(bi(`Lihat ilustrasi ${data.name}`, `View illustration of ${data.name}`))}"` : 'disabled';
}
export function downloadAttributes(data) {
  return data.src ? `data-download-src="${esc(data.src)}" data-download-slug="${esc(data.slug)}" aria-label="${esc(bi(`Unduh ilustrasi ${data.name}`, `Download illustration of ${data.name}`))}"` : 'disabled';
}
async function saveArtwork(src, slug, isCurrent = () => true) {
  const response = await fetch(src, {credentials:'same-origin'});
  if (!response.ok) throw new Error('Download failed');
  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('Invalid image');
  if (!isCurrent()) return false;
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  const ext = ({'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','image/avif':'avif'})[blob.type] || 'img';
  link.href = url; link.download = `mythics-${(slug || 'illustration').replace(/[^a-z0-9-]/gi,'-')}.${ext}`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
export function initImageViewer() {
  let dialog, generation = 0, cleanupViewer = () => {};
  const close = () => {
    if (!dialog?.open) return;
    dialog.close();
    cleanupViewer();
  };
  document.addEventListener('click', async event => {
    if (!event.target.closest('.detail-view')) return;
    const download = event.target.closest('[data-download-src]');
    if (download) {
      event.preventDefault();
      const note = download.closest('figure').querySelector('.detail-download-status');
      download.disabled = true;
      note.textContent = bi('Menyiapkan unduhan…','Preparing download…');
      try {
        if (!await saveArtwork(download.dataset.downloadSrc, download.dataset.downloadSlug, () => download.isConnected)) return;
        note.textContent = bi('Unduhan dimulai.','Download started.');
      } catch {
        note.textContent = bi('Unduhan langsung belum berhasil. ', 'Direct download was unsuccessful. ');
        const link = document.createElement('a');
        link.href = download.dataset.downloadSrc; link.target = '_blank'; link.rel = 'noopener';
        link.textContent = bi('Buka gambar asli ↗','Open original image ↗'); note.append(link);
      } finally { download.disabled = false; }
      return;
    }
    const trigger = event.target.closest('[data-preview-src]');
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  });
  window.addEventListener('hashchange', close);
  window.addEventListener('mythics:lang-change', close);

  function open(trigger) {
    if (dialog?.open) close();
    dialog?.remove();
    const token = ++generation;
    const data = trigger.dataset;
    const previousFocus = trigger;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let zoom = 1, x = 0, y = 0, fitWidth = 0, fitHeight = 0, loaded = false;
    const pointers = new Map();
    let gesture;
    dialog = document.createElement('dialog');
    dialog.className = 'art-viewer';
    dialog.setAttribute('aria-labelledby', 'art-viewer-title');
    dialog.innerHTML = `<header class="viewer-header"><div><small>${bi('GALERI ILUSTRASI', 'ILLUSTRATION GALLERY')}</small><h2 id="art-viewer-title">${esc(data.previewName)}</h2></div><button class="viewer-close" type="button" aria-label="${bi('Tutup preview', 'Close preview')}">×</button></header>
      <div class="viewer-stage" tabindex="0" aria-label="${bi('Gambar: perbesar lalu geser untuk melihat detail', 'Image: zoom in then drag to see details')}"><img class="viewer-image" alt="${esc(data.previewName)}" draggable="false"><p class="viewer-status" role="status">${bi('Memuat ilustrasi…', 'Loading illustration…')}</p></div>
      <div class="viewer-toolbar"><div class="viewer-zoom"><button type="button" data-zoom="out" aria-label="${bi('Perkecil', 'Zoom out')}">−</button><output aria-live="polite">100%</output><button type="button" data-zoom="in" aria-label="${bi('Perbesar', 'Zoom in')}">+</button><button type="button" data-zoom="reset">${bi('Pas layar', 'Fit')}</button></div><button class="btn btn-primary viewer-download" type="button">${icon('download',18)} ${bi('Unduh gambar', 'Download image')}</button></div>
      <footer class="viewer-footer"><span>${esc(data.previewCredit)}</span><span>${bi('Cubit / gulir untuk zoom · Geser untuk menjelajah', 'Pinch / scroll to zoom · Drag to explore')}</span><p class="download-status" role="status"></p><a class="download-source" href="${esc(data.previewSrc)}" target="_blank" rel="noopener" hidden>${bi('Buka gambar asli untuk menyimpan ↗', 'Open original image to save ↗')}</a></footer>`;
    document.body.append(dialog);
    const current = dialog, stage = current.querySelector('.viewer-stage'), img = current.querySelector('.viewer-image');
    const status = current.querySelector('.viewer-status');
    const zoomButtons = current.querySelectorAll('[data-zoom]');
    zoomButtons.forEach(b=>b.disabled=true);
    current.querySelector('.viewer-download').disabled=true;
    const update = () => {
      x = Math.max(-(fitWidth*(zoom-1))/2,Math.min((fitWidth*(zoom-1))/2,x));
      y = Math.max(-(fitHeight*(zoom-1))/2,Math.min((fitHeight*(zoom-1))/2,y));
      img.style.transform=`translate(${x}px,${y}px) scale(${zoom})`;
      current.querySelector('output').value=`${Math.round(zoom*100)}%`;
      current.querySelector('[data-zoom="out"]').disabled=zoom<=1;
      current.querySelector('[data-zoom="in"]').disabled=zoom>=4;
      stage.classList.toggle('is-zoomed',zoom>1);
    };
    const changeZoom = value => { if (!loaded) return; zoom=Math.max(1,Math.min(4,value)); update(); };
    const fit = () => {
      if(!img.naturalWidth) return;
      const ratio=Math.min((stage.clientWidth-24)/img.naturalWidth,(stage.clientHeight-24)/img.naturalHeight);
      fitWidth=img.naturalWidth*ratio; fitHeight=img.naturalHeight*ratio;
      img.style.width=`${fitWidth}px`; img.style.height=`${fitHeight}px`; update();
    };
    const observer=new ResizeObserver(fit); observer.observe(stage);
    img.onload=()=>{
      loaded=true;
      status.hidden=true; img.classList.add('is-loaded');
      zoomButtons.forEach(b=>b.disabled=false); current.querySelector('.viewer-download').disabled=false; fit();
    };
    img.onerror=()=>{status.textContent=bi('Gambar tidak dapat dimuat. Tutup dan coba lagi.', 'Unable to load this image. Close and try again.');};
    img.src=data.previewSrc;
    current.querySelector('.viewer-close').onclick=close;
    zoomButtons.forEach(button=>button.onclick=()=>changeZoom(button.dataset.zoom==='reset'?1:zoom+(button.dataset.zoom==='in'?.5:-.5)));
    stage.addEventListener('wheel',e=>{e.preventDefault(); if(img.naturalWidth) changeZoom(zoom+(e.deltaY<0?.15:-.15));},{passive:false});
    stage.ondblclick=()=>changeZoom(zoom===1?2:1);
    const startGesture=()=>{
      const p=[...pointers.values()];
      gesture=p.length>1?{distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),zoom}:{pointer:p[0],x,y};
    };
    stage.onpointerdown=e=>{if(e.button>0 || !loaded)return; pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); stage.setPointerCapture(e.pointerId); startGesture();};
    stage.onpointermove=e=>{
      if(!pointers.has(e.pointerId))return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      const p=[...pointers.values()];
      if(p.length>1 && gesture.distance) changeZoom(gesture.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/gesture.distance);
      else if(gesture.pointer){x=gesture.x+e.clientX-gesture.pointer.x;y=gesture.y+e.clientY-gesture.pointer.y;update();}
    };
    stage.onpointerup=stage.onpointercancel=stage.onlostpointercapture=e=>{pointers.delete(e.pointerId); if(pointers.size)startGesture();};
    current.onkeydown=e=>{
      if(e.key==='+'||e.key==='='){e.preventDefault();changeZoom(zoom+.5);}
      if(e.key==='-'){e.preventDefault();changeZoom(zoom-.5);}
      if(e.key==='0'){e.preventDefault();changeZoom(1);}
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&zoom>1){e.preventDefault();x+=e.key==='ArrowLeft'?45:e.key==='ArrowRight'?-45:0;y+=e.key==='ArrowUp'?45:e.key==='ArrowDown'?-45:0;update();}
    };
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      observer.disconnect(); pointers.clear();
      if (dialog !== current) return;
      generation++;
      document.body.style.overflow=previousOverflow;
      if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    };
    cleanupViewer = cleanup;
    current.addEventListener('close', cleanup, {once:true});
    current.addEventListener('cancel', event => { event.preventDefault(); close(); });
    current.querySelector('.viewer-download').onclick=async e=>{
      const button=e.currentTarget, note=current.querySelector('.download-status');
      button.disabled=true; note.textContent=bi('Menyiapkan unduhan…','Preparing download…');
      try{
        if (!await saveArtwork(data.previewSrc, data.previewSlug, () => generation===token)) return;
        note.textContent=bi('Unduhan dimulai.','Download started.');
      }catch{
        note.textContent=bi('Unduhan langsung belum berhasil. Buka gambar asli untuk menyimpannya.','Direct download was unsuccessful. Open the original image to save it.');
        current.querySelector('.download-source').hidden=false;
      }finally{button.disabled=false;}
    };
    current.showModal();current.querySelector('.viewer-close').focus();
  }
}
