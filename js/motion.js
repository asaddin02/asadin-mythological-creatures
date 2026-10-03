// Two observers share a lifetime with the app. No per-card listeners or render loop.
export function initMotion(root) {
  if (!root || !('IntersectionObserver' in window)) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet(), pending = new Set(), art = new Set();
  const selectors = '.home-section,.scale-intro,.nusantara-feature,.learning-banner,.scale-level,.comparison-heading,.culture-portal';
  let frame;
  const reveal = new IntersectionObserver(entries => {
    for (const {target,isIntersecting} of entries) {
      if (!isIntersecting) continue;
      target.classList.add('motion-visible'); target.classList.remove('motion-pending');
      pending.delete(target); reveal.unobserve(target);
    }
  }, {threshold:0,rootMargin:'0px 0px -24px 0px'});
  const motion = new IntersectionObserver(entries => {
    for (const {target,isIntersecting} of entries) {
      target.dataset.visible = String(isIntersecting);
      target.classList.toggle('is-in-view',isIntersecting && !document.hidden && !preference.matches);
    }
  }, {threshold:0.1});
  function syncPlayback() {
    for (const target of art) target.classList.toggle('is-in-view',target.dataset.visible==='true' && !document.hidden && !preference.matches);
  }
  const scan = () => {
    frame = undefined;
    for (const target of pending) {
      if (!target.isConnected || preference.matches) {
        target.classList.remove('motion-pending');pending.delete(target);reveal.unobserve(target);
      }
    }
    for (const target of art) if (!target.isConnected) { art.delete(target);motion.unobserve(target); }
    for (const target of root.querySelectorAll('.royal-slide,.dossier-art .detail-preview,.nusantara-art')) {
      if (art.has(target)) continue;
      art.add(target);target.classList.add('ambient-art');motion.observe(target);
    }
    syncPlayback();
    if (preference.matches) return;
    for (const target of root.querySelectorAll(selectors)) {
      if (seen.has(target) || target.closest('[hidden]')) continue;
      seen.add(target);
      if (target.getBoundingClientRect().top < innerHeight) continue;
      target.classList.add('motion-pending');pending.add(target);reveal.observe(target);
    }
  };
  const schedule = () => { frame ??= requestAnimationFrame(scan); };
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  preference.addEventListener('change',schedule);
  document.addEventListener('visibilitychange',syncPlayback);
  root.addEventListener('focusin',event => {
    const target=event.target.closest('.motion-pending');
    if (target) { target.classList.remove('motion-pending');pending.delete(target);reveal.unobserve(target); }
  });
  schedule();
}
