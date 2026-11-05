'use strict';
/* Habla — comunicador CAA. Todo se guarda en este dispositivo (localStorage).
   La membresía se valida con /api/habla/* (Stripe) y se guarda como un token firmado. */

const API = '/api/habla';
const $ = id => document.getElementById(id);
const DAY = 86400000;

// ---------- Planes ----------
const LIMITS = {
  free: { profiles: 1,  boards: 1,   photos: false, print: false, stats: false, share: false },
  plus: { profiles: 5,  boards: 100, photos: true,  print: false, stats: false, share: false },
  pro:  { profiles: 50, boards: 200, photos: true,  print: true,  stats: true,  share: true  }
};
const PRICES = {
  plus: { m: { id: 'plus_m', p: '$3.99' }, y: { id: 'plus_y', p: '$29', perMonth: '$2.42' } },
  pro:  { m: { id: 'pro_m',  p: '$9.99' }, y: { id: 'pro_y',  p: '$79', perMonth: '$6.58' } }
};

// ---------- Textos de la interfaz ----------
const UI = {
  es: {
    ph: 'Toca los símbolos para armar tu frase…', quick: '⭐ Rápidas', kb: '⌨️ Escribir', edit: '✏️ Editar', editing: '✅ Terminar',
    addBtn: 'Añadir', addBoard: '➕ Tablero', saved: 'Frase guardada', nov: 'Tu dispositivo no tiene voz para este idioma',
    noTts: 'Tu navegador no tiene voz. Prueba con Chrome o Safari.', hist: 'Recientes', typeHere: 'Escribe aquí lo que quieras decir…',
    speak: '🔊 Hablar', savePhrase: '⭐ Guardar como frase rápida', clear: 'Borrar', full: 'No queda espacio en este dispositivo. Borra fotos o tableros.',
    settings: 'Ajustes', profiles: 'Perfiles', lang: 'Idioma', voice: 'Voz', rate: 'Velocidad de la voz', size: 'Tamaño de los botones', theme: 'Tema',
    light: 'Claro', dark: 'Oscuro', contrast: 'Alto contraste', auto: 'Decir cada palabra al tocarla', lock: 'Bloquear edición',
    lockHint: 'Con el bloqueo activo se ocultan los botones de editar y los ajustes se abren manteniendo presionado ⚙️ durante 1 segundo.',
    holdCfg: 'Mantén presionado ⚙️ para abrir los ajustes', membership: 'Membresía', tools: 'Herramientas', backup: 'Respaldo',
    exportAll: '💾 Exportar todo', importFile: '📂 Importar archivo', done: 'Listo', close: 'Cerrar', cancel: 'Cancelar', save: 'Guardar', add: 'Añadir',
    privacyHint: 'Habla no tiene cuentas ni rastreo. Tus tableros, fotos y frases se guardan solo en este dispositivo: haz un respaldo de vez en cuando.',
    privacy: 'Privacidad', terms: 'Términos', refunds: 'Reembolsos', newProfile: 'Nuevo perfil (nombre)', profHint: 'Tu plan permite {n} perfil(es).',
    use: 'Usar', del: 'Borrar', confirmDel: '¿Borrar "{x}" y todo su contenido? No se puede deshacer.', newButton: 'Nuevo botón',
    itemText: 'Lo que dirá', itemEmoji: 'Emoji o símbolo', photo: '📷 Usar una foto', noPhoto: 'Quitar foto', newBoard: 'Nuevo tablero', boardName: 'Nombre del tablero',
    print: '🖨️ Imprimir tablero', stats: '📊 Palabras más usadas', share: '📤 Compartir perfil',
    statsHint: 'Se cuenta solo en este dispositivo y nunca se envía a ningún lado. Útil para terapeutas y familias.', reset: 'Reiniciar', noStats: 'Todavía no hay datos.',
    imported: 'Importado ✔', badFile: 'Archivo no válido', me: 'Yo', mine: 'Mis cosas', needText: 'Escribe lo que dirá el botón',
    // membresía
    plFree: 'Habla Gratis', plPlus: 'Habla Plus', plPro: 'Habla Profesional', yourPlan: 'Tu plan: {p}', monthly: 'Mensual', yearly: 'Anual (ahorra 39%)',
    perMonth: '/mes', perYear: '/año', trial: '7 días gratis, cancela cuando quieras.', choose: 'Probar 7 días gratis',
    plusF: ['Hasta 5 perfiles (hijos, alumnos, pacientes)', 'Fotos reales como botones', 'Tableros propios ilimitados', 'Todo lo de Gratis'],
    proF: ['Hasta 50 perfiles', 'Imprimir tableros (respaldo sin pantalla)', 'Estadísticas de palabras más usadas', 'Compartir perfiles con familias', 'Todo lo de Plus'],
    freeNote: 'Comunicarse siempre será gratis: todas las palabras, la voz, el teclado y las frases rápidas funcionan sin pagar.',
    beca: '¿No puedes pagar? Pide una beca: te damos un código de Plus gratis.', haveCode: '¿Ya pagaste en otro dispositivo? Pega tu código de restauración:',
    restore: 'Restaurar', manage: 'Administrar o cancelar suscripción', copyCode: 'Copiar código de restauración',
    codeHint: 'Guarda este código: sirve para activar tu membresía en otro teléfono o tablet.', copied: 'Copiado',
    offline: 'Necesitas internet para esto.', payErr: 'No se pudo iniciar el pago. Intenta de nuevo.', activating: 'Activando tu membresía…',
    activated: '¡Listo! Tu membresía está activa. Gracias por apoyar Habla 💙', badCode: 'Código no válido o suscripción inactiva.',
    needPlan: 'Esta función es parte de {p}.', renews: 'Válida hasta {d} (se renueva sola mientras la suscripción esté activa).',
    expired: 'Tu membresía terminó. Todo lo que creaste sigue aquí; solo no puedes crear cosas nuevas de pago.'
  },
  en: {
    ph: 'Tap symbols to build your sentence…', quick: '⭐ Quick', kb: '⌨️ Type', edit: '✏️ Edit', editing: '✅ Done',
    addBtn: 'Add', addBoard: '➕ Board', saved: 'Phrase saved', nov: 'Your device has no voice for this language',
    noTts: 'Your browser has no voice. Try Chrome or Safari.', hist: 'Recent', typeHere: 'Type what you want to say…',
    speak: '🔊 Speak', savePhrase: '⭐ Save as quick phrase', clear: 'Clear', full: 'This device is out of space. Remove photos or boards.',
    settings: 'Settings', profiles: 'Profiles', lang: 'Language', voice: 'Voice', rate: 'Voice speed', size: 'Button size', theme: 'Theme',
    light: 'Light', dark: 'Dark', contrast: 'High contrast', auto: 'Speak each word when tapped', lock: 'Lock editing',
    lockHint: 'When locked, edit buttons are hidden and settings open by holding ⚙️ for 1 second.',
    holdCfg: 'Hold ⚙️ to open settings', membership: 'Membership', tools: 'Tools', backup: 'Backup',
    exportAll: '💾 Export all', importFile: '📂 Import file', done: 'Done', close: 'Close', cancel: 'Cancel', save: 'Save', add: 'Add',
    privacyHint: 'Habla has no accounts and no tracking. Your boards, photos and phrases stay on this device only: back them up now and then.',
    privacy: 'Privacy', terms: 'Terms', refunds: 'Refunds', newProfile: 'New profile (name)', profHint: 'Your plan allows {n} profile(s).',
    use: 'Use', del: 'Delete', confirmDel: 'Delete "{x}" and everything in it? This cannot be undone.', newButton: 'New button',
    itemText: 'What it will say', itemEmoji: 'Emoji or symbol', photo: '📷 Use a photo', noPhoto: 'Remove photo', newBoard: 'New board', boardName: 'Board name',
    print: '🖨️ Print board', stats: '📊 Most used words', share: '📤 Share profile',
    statsHint: 'Counted on this device only and never sent anywhere. Useful for therapists and families.', reset: 'Reset', noStats: 'No data yet.',
    imported: 'Imported ✔', badFile: 'Invalid file', me: 'Me', mine: 'Mine', needText: 'Type what the button will say',
    plFree: 'Habla Free', plPlus: 'Habla Plus', plPro: 'Habla Professional', yourPlan: 'Your plan: {p}', monthly: 'Monthly', yearly: 'Yearly (save 39%)',
    perMonth: '/mo', perYear: '/yr', trial: '7 days free, cancel anytime.', choose: 'Try 7 days free',
    plusF: ['Up to 5 profiles (kids, students, patients)', 'Real photos as buttons', 'Unlimited custom boards', 'Everything in Free'],
    proF: ['Up to 50 profiles', 'Print boards (no-tech backup)', 'Most-used word statistics', 'Share profiles with families', 'Everything in Plus'],
    freeNote: 'Communicating will always be free: every word, the voice, the keyboard and quick phrases work without paying.',
    beca: "Can't afford it? Ask for a scholarship: we'll give you a free Plus code.", haveCode: 'Already paid on another device? Paste your restore code:',
    restore: 'Restore', manage: 'Manage or cancel subscription', copyCode: 'Copy restore code',
    codeHint: 'Keep this code: it activates your membership on another phone or tablet.', copied: 'Copied',
    offline: 'You need internet for this.', payErr: 'Could not start the payment. Please try again.', activating: 'Activating your membership…',
    activated: 'Done! Your membership is active. Thanks for supporting Habla 💙', badCode: 'Invalid code or inactive subscription.',
    needPlan: 'This feature is part of {p}.', renews: 'Valid until {d} (renews automatically while the subscription is active).',
    expired: 'Your membership ended. Everything you made is still here; you just can’t create new paid items.'
  }
};

// ---------- Almacenamiento ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem('habla.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('habla.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem('habla.' + k); } catch (e) {} }
};
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const defLang = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

function newProfile(name, lang) {
  return { id: uid(), name, lang, voice: '', rate: 0.9, size: 1, theme: 'light', auto: false,
    boards: [{ id: uid(), name: UI[lang].mine, e: '⭐', items: [] }], phrases: [], hist: [], stats: {} };
}
let DB = store.get('db', null);
if (!DB || !Array.isArray(DB.profiles) || !DB.profiles.length) {
  const p = newProfile(UI[defLang].me, defLang);
  DB = { v: 2, active: p.id, lock: false, profiles: [p] };
}
let LIC = store.get('lic', null); // { token, plan, exp, checked }

const P = () => DB.profiles.find(p => p.id === DB.active) || DB.profiles[0];
const L = () => (UI[P().lang] || UI.es);
const VOC = () => (window.V[P().lang] || window.V.es);
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
function saveDB() { if (!store.set('db', DB)) { toast(L().full); return false; } return true; }
function plan() { return LIC && LIC.exp > Date.now() ? LIC.plan : 'free'; }
const lim = () => LIMITS[plan()] || LIMITS.free;
const planName = p => ({ free: L().plFree, plus: L().plPlus, pro: L().plPro })[p];

// ---------- Estado de la pantalla ----------
const S = { tab: 'core', words: [], edit: false };

// ---------- Voz ----------
let voices = [];
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices();
  const p = P(), sel = $('voice');
  const list = voices.filter(v => v.lang.toLowerCase().startsWith(p.lang));
  sel.innerHTML = '<option value="">Auto</option>';
  list.forEach(v => { const o = document.createElement('option'); o.value = v.voiceURI; o.textContent = `${v.name} (${v.lang})`; sel.append(o); });
  sel.value = list.some(v => v.voiceURI === p.voice) ? p.voice : '';
}
function say(text) {
  text = (text || '').trim(); if (!text) return;
  if (!('speechSynthesis' in window)) { toast(L().noTts); return; }
  const p = P();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = p.lang === 'es' ? 'es-ES' : 'en-US';
  const v = voices.find(v => v.voiceURI === p.voice) || voices.find(v => v.lang.toLowerCase().startsWith(p.lang));
  if (v) { u.voice = v; u.lang = v.lang; } else if (voices.length) toast(L().nov);
  u.rate = p.rate;
  speechSynthesis.speak(u);
  p.hist = [text, ...p.hist.filter(h => h !== text)].slice(0, 12);
  saveDB();
}
function count(t) { const s = P().stats; s[t] = (s[t] || 0) + 1; }
function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); }

// ---------- Frase ----------
function renderSentence() {
  const el = $('sentence'); el.innerHTML = '';
  S.words.forEach(([t, e, img]) => {
    const c = document.createElement('span'); c.className = 'chip';
    if (img) { const i = document.createElement('img'); i.src = img; i.alt = ''; c.append(i); }
    else { const i = document.createElement('i'); i.textContent = e; c.append(i); }
    c.append(t); el.append(c);
  });
  el.scrollTop = el.scrollHeight;
}
const sentenceText = () => S.words.map(w => w[0]).join(' ');
function addWord(t, e, img) { S.words.push([t, e, img]); count(t); saveDB(); renderSentence(); if (P().auto) say(t); }

// ---------- Pestañas y cuadrícula ----------
function renderTabs() {
  const tabs = $('tabs'); tabs.innerHTML = '';
  const p = P(), voc = VOC();
  const items = [['quick', L().quick], ...Object.entries(voc.cats).map(([k, c]) => [k, c.n]),
    ...p.boards.map(b => ['b:' + b.id, `${b.e} ${b.name}`]), ['kb', L().kb]];
  if (S.edit) items.push(['newboard', L().addBoard]);
  items.forEach(([k, n]) => {
    const b = document.createElement('button'); b.textContent = n; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', k === S.tab);
    b.onclick = () => { if (k === 'newboard') return openBoardDlg(); S.tab = k; render(); };
    tabs.append(b);
  });
  if (!DB.lock) {
    const e = document.createElement('button'); e.className = 'edit' + (S.edit ? ' on' : '');
    e.textContent = S.edit ? L().editing : L().edit;
    e.onclick = () => { S.edit = !S.edit; render(); };
    tabs.append(e);
  }
  const sel = tabs.querySelector('[aria-selected=true]'); if (sel) sel.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function tile(t, e, kind, onclick, onremove, img) {
  const b = document.createElement('button'); b.className = 'tile k-' + kind;
  if (img) { const i = document.createElement('img'); i.src = img; i.alt = ''; b.append(i); }
  else { const s = document.createElement('span'); s.className = 'e'; s.textContent = e; b.append(s); }
  const l = document.createElement('span'); l.textContent = t; b.append(l);
  b.onclick = onclick;
  if (onremove && S.edit) {
    const x = document.createElement('span'); x.className = 'x'; x.textContent = '✕'; x.setAttribute('role', 'button'); x.setAttribute('aria-label', L().del);
    x.onclick = ev => { ev.stopPropagation(); onremove(); }; b.append(x);
  }
  return b;
}
function addTile(label, fn) { const a = tile(label, '➕', 'misc', fn); a.classList.add('add'); return a; }
function currentBoard() { return S.tab.startsWith('b:') ? P().boards.find(b => 'b:' + b.id === S.tab) : null; }

function renderGrid() {
  const g = $('grid'), kb = $('kb'), p = P(), voc = VOC();
  if (S.tab.startsWith('b:') && !currentBoard()) S.tab = 'core';
  if (!['quick', 'kb'].includes(S.tab) && !S.tab.startsWith('b:') && !voc.cats[S.tab]) S.tab = 'core';
  const isKb = S.tab === 'kb';
  kb.classList.toggle('on', isKb); g.style.display = isKb ? 'none' : 'grid';
  g.innerHTML = ''; g.classList.toggle('wide', S.tab === 'quick');
  if (isKb) { $('ptitle').textContent = ''; return renderKb(); }

  if (S.tab === 'quick') {
    $('ptitle').textContent = L().quick;
    voc.quick.forEach(t => g.append(tile(t, '💬', 'misc', () => { S.words = [[t, '💬']]; count(t); renderSentence(); say(t); })));
    p.phrases.forEach(t => g.append(tile(t, '⭐', 'misc', () => { S.words = [[t, '⭐']]; count(t); renderSentence(); say(t); },
      () => { p.phrases = p.phrases.filter(x => x !== t); saveDB(); render(); })));
    if (S.edit) g.append(addTile(L().addBtn, () => { S.tab = 'kb'; render(); $('txt').focus(); }));
    return;
  }
  const board = currentBoard();
  if (board) {
    $('ptitle').textContent = `${board.e} ${board.name}`;
    board.items.forEach((w, i) => g.append(tile(w.t, w.e, 'misc', () => addWord(w.t, w.e, w.img),
      () => { board.items.splice(i, 1); saveDB(); render(); }, w.img)));
    if (S.edit || !board.items.length) g.append(addTile(L().addBtn, () => openItemDlg(board)));
    if (S.edit && p.boards.length > 1) {
      const d = document.createElement('button'); d.className = 'big'; d.style.gridColumn = '1/-1';
      d.textContent = `🗑️ ${L().del}: ${board.name}`;
      d.onclick = () => { if (confirm(fmt(L().confirmDel, { x: board.name }))) { p.boards = p.boards.filter(b => b !== board); S.tab = 'core'; saveDB(); render(); } };
      g.append(d);
    }
    return;
  }
  const cat = voc.cats[S.tab];
  $('ptitle').textContent = cat.n;
  cat.w.forEach(([t, e, k]) => g.append(tile(t, e, k, () => addWord(t, e))));
}
function renderKb() {
  const p = P(), h = $('hist'); h.innerHTML = '';
  if (p.hist.length) {
    const t = document.createElement('p'); t.className = 'hint'; t.textContent = L().hist; h.append(t);
    const r = document.createElement('div'); r.className = 'row';
    p.hist.forEach(x => { const b = document.createElement('button'); b.className = 'big'; b.textContent = x; b.onclick = () => { $('txt').value = x; count(x); say(x); }; r.append(b); });
    h.append(r);
  }
  predict();
}
function predict() {
  const v = $('txt').value, m = v.match(/(\S*)$/)[1].toLowerCase(), box = $('pred'); box.innerHTML = '';
  const base = VOC().pred, pool = [...new Set([...P().hist.join(' ').split(/\s+/), ...base])].filter(Boolean);
  const out = (m ? pool.filter(w => w.toLowerCase().startsWith(m) && w.toLowerCase() !== m) : base.slice(0, 8)).slice(0, 8);
  out.forEach(w => { const b = document.createElement('button'); b.textContent = w; b.onclick = () => { $('txt').value = v.slice(0, v.length - m.length) + w + ' '; $('txt').focus(); predict(); }; box.append(b); });
}
function applyTexts() {
  const l = L();
  document.querySelectorAll('[data-t]').forEach(el => { const k = el.dataset.t; if (typeof l[k] === 'string') el.textContent = l[k]; });
  $('sentence').dataset.ph = l.ph; $('txt').placeholder = l.typeHere;
  $('kbSpeak').textContent = l.speak; $('kbSave').textContent = l.savePhrase; $('kbClear').textContent = l.clear;
  const lk = (txt, ok) => txt + (ok ? '' : ' 🔒');
  $('printBoard').textContent = lk(l.print, lim().print);
  $('openStats').textContent = lk(l.stats, lim().stats);
  $('shareProfile').textContent = lk(l.share, lim().share);
  $('pickPhoto').textContent = lk(l.photo, lim().photos);
  $('openPlans').textContent = '💙 ' + fmt(l.yourPlan, { p: planName(plan()) });
}
function render() {
  const p = P(), root = document.documentElement;
  root.dataset.theme = p.theme; root.style.setProperty('--fs', p.size); root.lang = p.lang;
  applyTexts(); renderTabs(); renderGrid(); renderSentence();
}

// ---------- Nuevo botón ----------
let editingBoard = null, photoData = null;
function openItemDlg(board) {
  editingBoard = board; photoData = null;
  $('itemText').value = ''; $('itemEmoji').value = '⭐'; updatePreview();
  $('dlgItem').showModal(); setTimeout(() => $('itemText').focus(), 50);
}
function updatePreview() {
  const pv = $('preview'); pv.innerHTML = '';
  if (photoData) { const i = document.createElement('img'); i.src = photoData; i.alt = ''; pv.append(i); }
  else pv.textContent = $('itemEmoji').value || '⭐';
}
$('itemEmoji').oninput = updatePreview;
$('pickPhoto').onclick = () => { if (!lim().photos) return openPlans('plus'); $('photoInput').click(); };
$('clearPhoto').onclick = () => { photoData = null; updatePreview(); };
$('photoInput').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try { photoData = await shrink(f, 256); updatePreview(); } catch (err) { toast(L().badFile); }
};
function shrink(file, size) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = size;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
    img.src = url;
  });
}
$('saveItem').onclick = () => {
  const t = $('itemText').value.trim(); if (!t) { toast(L().needText); return; }
  const item = { t, e: ($('itemEmoji').value.trim() || '⭐').slice(0, 8) };
  if (photoData) item.img = photoData;
  editingBoard.items.push(item);
  if (!saveDB()) { editingBoard.items.pop(); return; }
  $('dlgItem').close(); render();
};

// ---------- Nuevo tablero ----------
function openBoardDlg() {
  if (P().boards.length >= lim().boards) return openPlans('plus');
  $('boardName').value = ''; $('boardEmoji').value = '📁'; $('dlgBoard').showModal();
}
$('saveBoard').onclick = () => {
  const n = $('boardName').value.trim(); if (!n) return;
  const b = { id: uid(), name: n, e: ($('boardEmoji').value.trim() || '📁').slice(0, 8), items: [] };
  P().boards.push(b); saveDB(); S.tab = 'b:' + b.id; $('dlgBoard').close(); render();
};

// ---------- Perfiles ----------
function renderProfiles() {
  const box = $('profList'); box.innerHTML = '';
  DB.profiles.forEach(p => {
    const it = document.createElement('div'); it.className = 'item' + (p.id === DB.active ? ' cur' : '');
    const n = document.createElement('span'); n.textContent = `${p.name} · ${p.lang.toUpperCase()}`; it.append(n);
    if (p.id !== DB.active) {
      const u = document.createElement('button'); u.className = 'big'; u.textContent = L().use;
      u.onclick = () => { DB.active = p.id; S.words = []; S.tab = 'core'; saveDB(); loadVoices(); renderProfiles(); render(); fillCfg(); };
      const d = document.createElement('button'); d.className = 'big'; d.textContent = '🗑️'; d.setAttribute('aria-label', L().del);
      d.onclick = () => { if (confirm(fmt(L().confirmDel, { x: p.name }))) { DB.profiles = DB.profiles.filter(x => x !== p); saveDB(); renderProfiles(); } };
      it.append(u, d);
    }
    box.append(it);
  });
  $('profHint').textContent = fmt(L().profHint, { n: lim().profiles });
}
$('openProfiles').onclick = () => { renderProfiles(); $('dlgProfiles').showModal(); };
$('addProfile').onclick = () => {
  const n = $('newProfName').value.trim(); if (!n) return;
  if (DB.profiles.length >= lim().profiles) return openPlans(DB.profiles.length >= LIMITS.plus.profiles ? 'pro' : 'plus');
  DB.profiles.push(newProfile(n, P().lang)); $('newProfName').value = ''; saveDB(); renderProfiles();
};

// ---------- Ajustes ----------
function fillCfg() {
  const p = P();
  $('cfgProfile').textContent = '👤 ' + p.name;
  $('lang').value = p.lang; $('rate').value = p.rate; $('size').value = p.size; $('theme').value = p.theme;
  $('auto').checked = p.auto; $('lock').checked = DB.lock; loadVoices(); applyTexts();
}
function openCfg() { fillCfg(); $('dlgCfg').showModal(); }
(() => { // toque corto o largo en ⚙️
  let timer = null, long = false;
  const btn = $('cfg');
  btn.addEventListener('pointerdown', () => { long = false; timer = setTimeout(() => { long = true; openCfg(); }, 900); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => clearTimeout(timer)));
  btn.addEventListener('click', () => { if (long) return; if (DB.lock) toast(L().holdCfg); else openCfg(); });
})();
$('lang').onchange = e => { const p = P(); p.lang = e.target.value; p.voice = ''; S.words = []; S.tab = 'core'; saveDB(); fillCfg(); render(); };
$('voice').onchange = e => { P().voice = e.target.value; saveDB(); };
$('rate').oninput = e => { P().rate = +e.target.value; saveDB(); };
$('rate').onchange = () => say(P().lang === 'es' ? 'Hola' : 'Hello');
$('size').oninput = e => { P().size = +e.target.value; saveDB(); render(); };
$('theme').onchange = e => { P().theme = e.target.value; saveDB(); render(); };
$('auto').onchange = e => { P().auto = e.target.checked; saveDB(); };
$('lock').onchange = e => { DB.lock = e.target.checked; if (DB.lock) S.edit = false; saveDB(); render(); };
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());

// Respaldo
function download(name, data) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const stamp = () => new Date().toISOString().slice(0, 10);
$('export').onclick = () => download(`habla-respaldo-${stamp()}.json`, { app: 'habla', kind: 'backup', v: 2, db: DB });
$('shareProfile').onclick = () => {
  if (!lim().share) return openPlans('pro');
  const p = JSON.parse(JSON.stringify(P())); p.stats = {}; p.hist = [];
  download(`habla-perfil-${p.name.replace(/[^\w-]+/g, '_')}.json`, { app: 'habla', kind: 'profile', v: 2, profile: p });
};
function cleanProfile(p) {
  const str = (x, n) => String(x == null ? '' : x).slice(0, n);
  const okImg = x => typeof x === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(x) && x.length < 300000;
  const lang = p.lang === 'en' ? 'en' : 'es';
  return {
    id: uid(), name: str(p.name || UI[lang].me, 40), lang, voice: '', rate: Math.min(1.5, Math.max(0.5, +p.rate || 0.9)),
    size: Math.min(1.6, Math.max(0.8, +p.size || 1)), theme: ['light', 'dark', 'contrast'].includes(p.theme) ? p.theme : 'light', auto: !!p.auto,
    boards: (Array.isArray(p.boards) ? p.boards : []).slice(0, 200).map(b => ({
      id: uid(), name: str(b.name, 30), e: str(b.e || '📁', 8),
      items: (Array.isArray(b.items) ? b.items : []).slice(0, 500).filter(w => w && w.t).map(w => {
        const o = { t: str(w.t, 80), e: str(w.e || '⭐', 8) }; if (okImg(w.img)) o.img = w.img; return o; })
    })).filter(b => b.name),
    phrases: (Array.isArray(p.phrases) ? p.phrases : []).filter(x => typeof x === 'string').map(x => x.slice(0, 300)).slice(0, 500),
    hist: [], stats: {}
  };
}
$('import').onclick = () => {
  const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json';
  i.onchange = async () => {
    try {
      const d = JSON.parse(await i.files[0].text());
      if (d.app !== 'habla') throw 0;
      let incoming = d.kind === 'backup' && d.db && Array.isArray(d.db.profiles) ? d.db.profiles : d.kind === 'profile' && d.profile ? [d.profile] : null;
      if (!incoming) throw 0;
      incoming = incoming.map(cleanProfile);
      const room = Math.max(0, lim().profiles - DB.profiles.length);
      if (d.kind === 'backup' && DB.profiles.length === 1 && !P().boards.some(b => b.items.length) && !P().phrases.length) {
        DB.profiles = incoming.slice(0, Math.max(1, lim().profiles)); DB.active = DB.profiles[0].id; // dispositivo nuevo: reemplazar
      } else {
        if (!room) return openPlans(DB.profiles.length >= LIMITS.plus.profiles ? 'pro' : 'plus');
        DB.profiles.push(...incoming.slice(0, room)); DB.active = incoming[0].id;
      }
      if (!saveDB()) return;
      S.tab = 'core'; S.words = []; fillCfg(); render(); toast(L().imported);
    } catch (e) { toast(L().badFile); }
  };
  i.click();
};
$('printBoard').onclick = () => {
  if (!lim().print) return openPlans('pro');
  if (S.tab === 'kb') S.tab = 'core';
  const wasEdit = S.edit; S.edit = false; render(); $('dlgCfg').close();
  setTimeout(() => { window.print(); S.edit = wasEdit; render(); }, 150);
};
$('openStats').onclick = () => {
  if (!lim().stats) return openPlans('pro');
  const ul = $('statList'); ul.innerHTML = '';
  const rows = Object.entries(P().stats).sort((a, b) => b[1] - a[1]).slice(0, 30);
  if (!rows.length) { const li = document.createElement('li'); li.textContent = L().noStats; ul.append(li); }
  rows.forEach(([w, n]) => { const li = document.createElement('li'); const a = document.createElement('span'); a.textContent = w; const b = document.createElement('b'); b.textContent = n; li.append(a, b); ul.append(li); });
  $('dlgStats').showModal();
};
$('resetStats').onclick = () => { P().stats = {}; saveDB(); $('openStats').onclick(); };

// ---------- Membresía ----------
let billing = 'y';
function openPlans(needed) {
  const l = L(), cur = plan(), body = $('plBody'); body.innerHTML = '';
  $('plTitle').textContent = '💙 ' + fmt(l.yourPlan, { p: planName(cur) });
  const add = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; body.append(e); return e; };
  if (needed && cur === 'free' || needed === 'pro' && cur === 'plus') add('p', 'ok', fmt(l.needPlan, { p: planName(needed) }));
  if (LIC && LIC.exp <= Date.now()) add('p', 'hint', l.expired);

  if (cur !== 'free') {
    add('p', 'hint', fmt(l.renews, { d: new Date(LIC.exp).toLocaleDateString(P().lang) }));
    const m = add('button', 'big pri full', l.manage); m.onclick = () => portal(m);
    add('p', 'hint', l.codeHint);
    add('div', 'code', LIC.token);
    const c = add('button', 'big full', l.copyCode); c.style.marginTop = '8px';
    c.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(LIC.token).then(() => toast(l.copied)); };
    if (cur === 'pro') { $('dlgPlans').open || $('dlgPlans').showModal(); return; }
  }

  add('p', 'hint', l.freeNote);
  const seg = add('div', 'seg');
  [['m', l.monthly], ['y', l.yearly]].forEach(([k, t]) => {
    const b = document.createElement('button'); b.textContent = t; b.setAttribute('aria-pressed', billing === k);
    b.onclick = () => { billing = k; openPlans(needed); }; seg.append(b);
  });
  const grid = add('div', 'plans');
  [['plus', l.plPlus, l.plusF], ['pro', l.plPro, l.proF]].forEach(([k, name, feats]) => {
    if (cur === 'plus' && k === 'plus') return;
    const pr = PRICES[k][billing];
    const card = document.createElement('div'); card.className = 'plan' + ((needed || 'plus') === k ? ' hl' : '');
    const h = document.createElement('h4'); h.textContent = name;
    const price = document.createElement('div'); price.className = 'price'; price.textContent = pr.p + ' ';
    const sm = document.createElement('small'); sm.textContent = (billing === 'm' ? l.perMonth : l.perYear) + (pr.perMonth ? ` · ${pr.perMonth}${l.perMonth}` : ''); price.append(sm);
    const ul = document.createElement('ul'); feats.forEach(f => { const li = document.createElement('li'); li.textContent = f; ul.append(li); });
    const btn = document.createElement('button'); btn.className = 'big pri'; btn.textContent = l.choose; btn.onclick = () => checkout(pr.id, btn);
    card.append(h, price, ul, btn); grid.append(card);
  });
  add('p', 'hint', l.trial);
  const beca = add('p', 'hint'); const a = document.createElement('a'); a.href = './#becas'; a.textContent = l.beca; beca.append(a);
  if (cur === 'free') {
    add('p', 'hint', l.haveCode);
    const r = add('div', 'row');
    const inp = document.createElement('input'); inp.type = 'text'; inp.style.flex = '1'; inp.autocomplete = 'off';
    const b = document.createElement('button'); b.className = 'big'; b.textContent = l.restore; b.onclick = () => refresh(inp.value.trim(), true);
    r.append(inp, b);
  }
  if (!$('dlgPlans').open) $('dlgPlans').showModal();
}
$('openPlans').onclick = () => { $('dlgCfg').close(); openPlans(); };

async function post(path, body) {
  const r = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  let j = {}; try { j = await r.json(); } catch (e) {}
  if (!r.ok) throw Object.assign(new Error(j.error || 'error'), { status: r.status, data: j });
  return j;
}
async function checkout(id, btn) {
  if (!navigator.onLine) return toast(L().offline);
  btn.disabled = true;
  try { const j = await post('/checkout', { plan: id, lang: P().lang }); location.href = j.url; }
  catch (e) { toast(L().payErr); btn.disabled = false; }
}
async function portal(btn) {
  if (!navigator.onLine) return toast(L().offline);
  btn.disabled = true;
  try { const j = await post('/portal', { token: LIC.token, lang: P().lang }); location.href = j.url; }
  catch (e) { toast(L().payErr); btn.disabled = false; }
}
function setLicense(j) {
  LIC = { token: j.token, plan: j.plan, exp: j.exp, checked: Date.now() };
  store.set('lic', LIC); render();
}
// Revalida la membresía. Si no hay internet se mantiene hasta su fecha de vencimiento.
async function refresh(token, manual) {
  if (!token) return;
  if (!navigator.onLine) { if (manual) toast(L().offline); return; }
  try {
    const j = await post('/status', { token });
    if (j.active) { setLicense(j); if (manual) { toast(L().activated); openPlans(); } }
    else { if (manual) toast(L().badCode); else if (LIC) { LIC.exp = 0; store.set('lic', LIC); render(); } }
  } catch (e) { if (manual) toast(e.status === 400 || e.status === 401 ? L().badCode : L().payErr); }
}
async function activateFromCheckout() {
  const q = new URLSearchParams(location.search), sid = q.get('session_id');
  if (!sid) return;
  history.replaceState(null, '', location.pathname);
  toast(L().activating);
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${API}/activate?session_id=${encodeURIComponent(sid)}`);
      const j = await r.json();
      if (r.ok && j.token) { setLicense(j); toast(L().activated); openPlans(); return; }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 1500));
  }
  toast(L().payErr);
}

// ---------- Eventos de la barra ----------
$('speak').onclick = () => say(sentenceText());
$('sentence').onclick = () => say(sentenceText());
$('sentence').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); say(sentenceText()); } };
$('back').onclick = () => { S.words.pop(); renderSentence(); };
$('clear').onclick = () => { S.words = []; renderSentence(); if ('speechSynthesis' in window) speechSynthesis.cancel(); };
$('txt').oninput = predict;
$('kbSpeak').onclick = () => { const t = $('txt').value; count(t.trim()); say(t); renderKb(); };
$('kbClear').onclick = () => { $('txt').value = ''; predict(); };
$('kbSave').onclick = () => {
  const t = $('txt').value.trim(); if (!t) return; const p = P();
  if (!p.phrases.includes(t)) p.phrases.push(t); if (saveDB()) toast(L().saved);
};

// ---------- Inicio ----------
if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = loadVoices; loadVoices(); }
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
saveDB();
render();
activateFromCheckout();
if (LIC && LIC.token && Date.now() - (LIC.checked || 0) > DAY) refresh(LIC.token, false);
if (location.hash === '#planes') { history.replaceState(null, '', location.pathname); openPlans(); }
