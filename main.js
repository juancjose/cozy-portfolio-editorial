(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // menú móvil
  const t = $('.mast__toggle'), nav = $('#menu');
  t.addEventListener('click', () => {
    const o = t.getAttribute('aria-expanded') === 'true';
    t.setAttribute('aria-expanded', String(!o)); nav.classList.toggle('is-open', !o);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { t.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }));

  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // contadores
  const fmt = n => n.toLocaleString('es-AR');
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(), d = 1400;
    const step = now => { const p = Math.min(1, (now - t0) / d); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // video mochila
  const v = $('#reel-video');
  if (v) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          v.dataset.loaded = 1;
          [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([k, type]) => { const s = document.createElement('source'); s.src = v.dataset[k]; s.type = type; v.appendChild(s); });
          v.load();
        }
        if (!reduce) v.play().then(() => v.classList.add('is-playing')).catch(() => {});
      } else v.pause();
    }), { threshold: .35 });
    vio.observe(v);
  }

  // timeline
  const tl = $('#timeline');
  $$('.tl-btn').forEach(b => b.addEventListener('click', () => {
    const w = $('.tl', tl).getBoundingClientRect().width;
    tl.scrollBy({ left: w * +b.dataset.dir, behavior: reduce ? 'auto' : 'smooth' });
  }));

  // filtros
  const items = $$('#list li');
  $$('.filter').forEach(b => b.addEventListener('click', () => {
    $$('.filter').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    const f = b.dataset.f;
    items.forEach(li => li.classList.toggle('is-hidden', f !== 'all' && li.dataset.f !== f));
  }));

  // vista previa al pasar el cursor
  const peek = $('#peek'), pimg = $('img', peek);
  if (matchMedia('(hover: hover) and (min-width: 901px)').matches) {
    let x = 0, y = 0, cx = 0, cy = 0, raf;
    const loop = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; peek.style.transform = `translate(${cx + 40}px, ${cy - 160}px)`; raf = requestAnimationFrame(loop); };
    items.forEach(li => {
      li.addEventListener('mouseenter', () => { pimg.src = li.dataset.img; peek.classList.add('is-on'); if (!raf) raf = requestAnimationFrame(loop); });
      li.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
    });
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
  }

  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
