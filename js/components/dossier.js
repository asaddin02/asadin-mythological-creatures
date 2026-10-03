import { bi, icon } from '../ui.js';

// Recompose the existing entry sections without changing their content.
// Each section has one explicit topic so none is lost when switching tabs.
export function mountDossier(container, slug) {
  const shell = container.querySelector('.detail-view > .container');
  const header = shell.querySelector('.detail-header-content');
  const figure = shell.querySelector('.detail-illustration');
  const content = shell.querySelector('.detail-reading-content');
  const workspace = document.createElement('div');
  workspace.className = 'dossier-workspace';
  workspace.innerHTML = `<aside class="dossier-art"></aside><div class="dossier-body"><header class="dossier-header"></header><nav class="dossier-tabs" role="tablist" aria-label="${bi('Bagian profil karakter','Character profile sections')}"></nav><div class="dossier-panels detail-reading-content"></div></div>`;
  const art = workspace.querySelector('.dossier-art');
  art.append(figure);
  const credits = figure.querySelector('figcaption');
  const creditDetails = document.createElement('details');
  creditDetails.className = 'art-credit';
  creditDetails.innerHTML = `<summary>${bi('Tentang ilustrasi','About this artwork')} <span>+</span></summary>`;
  credits.before(creditDetails);
  creditDetails.append(credits);
  const actions = header.querySelector('.detail-header-actions');
  actions.querySelector('[data-scroll="detail-lore"]').remove();

  const intro = workspace.querySelector('.dossier-header');
  for (const selector of ['.detail-overline','.detail-canonical-name','.detail-original-script','.scale-badges']) {
    const node = header.querySelector(selector);
    if (node) intro.append(node);
  }
  intro.append(actions);
  const tabs = [
    ['overview',bi('Ringkasan','Overview'),'compass'],
    ['lore',bi('Kisah','Story'),'book'],
    ['power',bi('Kekuatan','Powers'),'spark'],
    ['culture',bi('Budaya','Culture'),'globe'],
    ['relations',bi('Relasi','Relations'),'sun'],
    ['sources',bi('Sumber','Sources'),'bookmark'],
  ];
  const nav = workspace.querySelector('.dossier-tabs');
  const panels = workspace.querySelector('.dossier-panels');
  const sections = [...content.children];
  const depth = shell.querySelector('.detail-curation-note');
  if (depth) { depth.className = 'dossier-depth'; content.querySelector('.detail-summary-section h2')?.append(depth); }
  for (const [id,label,mark] of tabs) {
    const button = document.createElement('button');
    button.type = 'button'; button.id = `tab-${id}`; button.dataset.tab = id;
    button.setAttribute('role','tab'); button.setAttribute('aria-controls',`panel-${id}`);
    button.innerHTML = `${icon(mark,16)}<span>${label}</span>`;
    nav.append(button);
    const panel = document.createElement('section');
    panel.className = 'dossier-panel'; panel.id = `panel-${id}`; panel.dataset.panel = id;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',button.id); panel.tabIndex = 0;
    if (id === 'overview') {
      const desc = header.querySelector('.detail-short-summary');
      const facts = header.querySelector('.detail-facts');
      panel.append(desc, facts);
    }
    for (const section of sections.filter(node => (node.dataset.topic || 'lore') === id)) {
      // One topic at a time; secondary subsections open on demand.
      if (id !== 'overview' && panel.children.length > 0 && section.querySelector('h2')) {
        const fold = document.createElement('details');
        fold.className = 'dossier-fold';
        const heading = section.querySelector('h2');
        const summary = document.createElement('summary');
        summary.innerHTML = `<span>${heading.innerHTML}</span><span class="fold-plus" aria-hidden="true">+</span>`;
        heading.remove(); fold.append(summary, section); panel.append(fold);
      } else panel.append(section);
    }
    if (!panel.children.length) panel.innerHTML = `<p class="dossier-empty">${bi('Belum ada catatan pada bagian ini.','There are no notes in this section yet.')}</p>`;
    panels.append(panel);
  }
  // The reader can inspect an axis rationale without opening a long stack of cards.
  for (const article of workspace.querySelectorAll('.assessment-grid > article')) {
    const disclosure = document.createElement('details');
    disclosure.className = 'axis-assessment';
    const summary = document.createElement('summary');
    summary.append(article.querySelector('.assessment-symbol'), article.querySelector('.eyebrow'), article.querySelector('h3'));
    const plus = document.createElement('span'); plus.className = 'fold-plus'; plus.textContent = '+'; plus.setAttribute('aria-hidden','true');
    summary.append(plus); article.before(disclosure); disclosure.append(summary, article);
  }
  shell.querySelector('.detail-hero-grid').remove();
  shell.querySelector('.detail-reading-layout').remove();
  shell.append(workspace);

  const buttons = [...nav.querySelectorAll('[role="tab"]')];
  function activate(id, {save=true, focus=false} = {}) {
    if (!tabs.some(tab => tab[0] === id)) id = 'overview';
    for (const button of buttons) {
      const active = button.dataset.tab === id;
      button.setAttribute('aria-selected',String(active)); button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus({preventScroll:true});
    }
    panels.querySelectorAll('.dossier-panel').forEach(panel => { panel.hidden = panel.dataset.panel !== id; });
    // The page stays in place. Only the newly selected reading pane resets.
    panels.scrollTop = 0;
    if (save && matchMedia('(max-width:760px)').matches) {
      const chromeHeight = document.querySelector('.site-header').offsetHeight;
      const start = panels.getBoundingClientRect().top + scrollY - chromeHeight - nav.offsetHeight;
      if (scrollY > start) window.scrollTo({top:Math.max(0,start),behavior:'instant'});
    }
    if (save) history.replaceState(null,'',`#/creature/${encodeURIComponent(slug)}${id==='overview'?'':`?tab=${id}`}`);
  }
  nav.addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (button) activate(button.dataset.tab);
  });
  nav.addEventListener('keydown', event => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    const next = event.key==='ArrowRight' ? (index+1)%buttons.length : event.key==='ArrowLeft' ? (index+buttons.length-1)%buttons.length : event.key==='Home' ? 0 : event.key==='End' ? buttons.length-1 : -1;
    if (next < 0) return;
    event.preventDefault(); activate(buttons[next].dataset.tab,{focus:true});
  });
  container.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => {
    const target = container.querySelector('#'+button.dataset.scroll);
    if (!target) return;
    const panel = target.closest('.dossier-panel');
    if (!panel) return;
    activate(panel.dataset.panel);
    const fold = target.closest('details'); if (fold) fold.open = true;
    target.setAttribute('tabindex','-1'); target.focus({preventScroll:true});
    panels.scrollTop = target.offsetTop - panel.offsetTop;
  }));
  activate(new URLSearchParams(location.hash.split('?')[1] || '').get('tab'),{save:false});
}
