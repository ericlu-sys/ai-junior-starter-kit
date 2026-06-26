#!/usr/bin/env node
/**
 * Render a wport personal-website website.json to a standalone, multi-section HTML page.
 *
 * Two themes share one JSON schema:
 *   - cute     — soft pastel, rounded, playful
 *   - terminal — dark bash/terminal shell, monospace
 *
 * Both render a full site: sticky header nav, hero, and separate
 * sections (關於我 / 技能 / 作品 / 經歷 / 聯絡) — not a one-pager card stack.
 *
 * Usage:
 *   node templates/website/render.mjs <input.json> [output.html] --theme=cute
 *   node templates/website/render.mjs <input.json> [output.html] --theme=terminal
 *
 * Schema: see templates/website/README.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wportFaviconLink } from '../shared/wport-brand.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = __dirname;

const DEFAULT_ACCENT = '#56C7BB';
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700;900&family=Quicksand:wght@500;600;700&display=swap';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeUrl(url) {
  const raw = url?.trim();
  if (!raw) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) return raw;
  return `https://${raw}`;
}

/** about may be a string or an array of paragraph strings. */
function asParagraphs(about) {
  if (Array.isArray(about)) return about.filter((p) => p && p.trim());
  if (typeof about === 'string' && about.trim()) {
    return about.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }
  return [];
}

function readCss(theme) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, `${theme}.css`), 'utf8');
}

// Section registry — order matters; `has` decides visibility & nav entry.
const SECTIONS = [
  { id: 'about', zh: '關於我', en: 'about', cmd: 'cat about.md', has: (d) => asParagraphs(d.about).length > 0 || (d.highlights?.length ?? 0) > 0 },
  { id: 'skills', zh: '技能', en: 'skills', cmd: 'skills --list', has: (d) => (d.skills?.length ?? 0) > 0 },
  { id: 'projects', zh: '作品', en: 'projects', cmd: 'ls projects/', has: (d) => (d.projects?.length ?? 0) > 0 },
  { id: 'experience', zh: '經歷', en: 'work', cmd: 'cat work.log', has: (d) => (d.experience?.length ?? 0) > 0 },
  { id: 'contact', zh: '聯絡', en: 'contact', cmd: 'cat contact.txt', has: (d) => (d.links?.length ?? 0) > 0 },
];

const presentSections = (data) => SECTIONS.filter((s) => s.has(data));

function pageShell({ title, accent, css, bodyClass, body }) {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${wportFaviconLink()}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${FONTS_HREF}">
  <style>:root{--accent:${accent};}${css}</style>
</head>
<body class="${bodyClass}">
${body}
</body>
</html>
`;
}

// ─── Cute theme ──────────────────────────────────────────────────────────────

function cuteSection(sec, data, accent) {
  switch (sec.id) {
    case 'about': {
      const paras = asParagraphs(data.about);
      const stats = (data.highlights?.length ?? 0)
        ? `<div class="stats">${data.highlights
            .map((h) => `<div class="stat"><div class="stat-v">${escapeHtml(h.value || '')}</div><div class="stat-l">${escapeHtml(h.label || '')}</div></div>`)
            .join('')}</div>`
        : '';
      return `${paras.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n        ')}\n        ${stats}`;
    }
    case 'skills':
      return `<div class="pills">${data.skills.map((s) => `<span class="pill">${escapeHtml(s)}</span>`).join('')}</div>`;
    case 'projects':
      return `<div class="proj-grid">${data.projects
        .map((p) => {
          const href = normalizeUrl(p.url);
          const tags = (p.tags ?? []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
          const inner = `<div class="proj-emoji">${escapeHtml(p.emoji || '🌟')}</div><div class="proj-name">${escapeHtml(p.name || '')}</div><p class="proj-desc">${escapeHtml(p.description || '')}</p><div class="tags">${tags}</div>`;
          return href
            ? `<a class="proj" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
            : `<div class="proj">${inner}</div>`;
        })
        .join('')}</div>`;
    case 'experience':
      return `<ul class="exp">${data.experience
        .map(
          (e) => `<li><div class="exp-dot"></div><div><div class="exp-role">${escapeHtml(e.role || '')}</div><div class="exp-meta">${escapeHtml([e.company, e.period].filter(Boolean).join(' · '))}</div>${e.summary ? `<p class="exp-sum">${escapeHtml(e.summary)}</p>` : ''}</div></li>`
        )
        .join('')}</ul>`;
    case 'contact':
      return `<p class="cta-line">想聊聊、合作，或只是打聲招呼都歡迎 👋</p><div class="links">${data.links
        .map((l) => `<a class="link-btn" href="${escapeHtml(normalizeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label || l.url || '')}</a>`)
        .join('')}</div>`;
    default:
      return '';
  }
}

function renderCute(data) {
  const accent = data.accent || DEFAULT_ACCENT;
  const name = escapeHtml(data.name || '我的名字');
  const tagline = escapeHtml(data.tagline || '');
  const location = escapeHtml(data.location || '');
  const secs = presentSections(data);

  const nav = secs.map((s) => `<a href="#${s.id}">${s.zh}</a>`).join('');

  const avatar = data.avatar_url
    ? `<img class="avatar" src="${escapeHtml(data.avatar_url)}" alt="${name}">`
    : `<div class="avatar avatar--blank">${name.slice(0, 1)}</div>`;

  const heroBtns = [];
  if (secs.some((s) => s.id === 'projects')) heroBtns.push(`<a class="btn btn-primary" href="#projects">看我的作品</a>`);
  if (secs.some((s) => s.id === 'contact')) heroBtns.push(`<a class="btn btn-ghost" href="#contact">聯絡我</a>`);

  const sectionsHtml = secs
    .map(
      (s, i) => `<section id="${s.id}" class="sec ${i % 2 ? 'sec--tint' : ''}">
      <div class="inner">
        <div class="sec-head"><span class="kicker">${s.en.toUpperCase()}</span><h2>${s.zh}</h2></div>
        ${cuteSection(s, data, accent)}
      </div>
    </section>`
    )
    .join('\n    ');

  const body = `<header class="nav">
    <a class="brand" href="#top">${name}</a>
    <nav class="nav-links">${nav}</nav>
  </header>
  <main>
    <section id="top" class="hero">
      <div class="hero-inner">
        ${avatar}
        <h1>${name} <span class="wave">👋</span></h1>
        ${tagline ? `<p class="bubble">${tagline}</p>` : ''}
        ${location ? `<p class="loc">📍 ${location}</p>` : ''}
        ${heroBtns.length ? `<div class="hero-btns">${heroBtns.join('')}</div>` : ''}
      </div>
      <a class="scroll-hint" href="#${secs[0]?.id || 'top'}" aria-label="往下看">⌄</a>
    </section>
    ${sectionsHtml}
  </main>
  <footer class="foot">made with <span class="spark">💛</span> · <a href="https://wport.me" target="_blank" rel="noopener noreferrer">wport</a></footer>`;

  return pageShell({ title: `${name} · 個人網站`, accent, css: readCss('cute'), bodyClass: 'cute', body });
}

// ─── Terminal theme ──────────────────────────────────────────────────────────

function terminalSection(sec, data) {
  switch (sec.id) {
    case 'about': {
      const paras = asParagraphs(data.about);
      const stats = (data.highlights?.length ?? 0)
        ? `<div class="stats">${data.highlights
            .map((h) => `<div class="stat"><span class="stat-v">${escapeHtml(h.value || '')}</span> <span class="dim">${escapeHtml(h.label || '')}</span></div>`)
            .join('')}</div>`
        : '';
      return `${paras.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}${stats}`;
    }
    case 'skills':
      return `<div class="chips">${data.skills.map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join('')}</div>`;
    case 'projects':
      return `<div class="ls">${data.projects
        .map((p) => {
          const href = normalizeUrl(p.url);
          const nameCell = href
            ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.name || '')}/</a>`
            : `${escapeHtml(p.name || '')}/`;
          const tags = (p.tags ?? []).length ? `  <span class="dim"># ${escapeHtml(p.tags.join(' '))}</span>` : '';
          return `<div class="ls-row"><span class="ls-name">${nameCell}</span><span class="ls-desc">${escapeHtml(p.description || '')}</span>${tags}</div>`;
        })
        .join('')}</div>`;
    case 'experience':
      return data.experience
        .map(
          (e) => `<div class="log-row"><span class="dim">[${escapeHtml(e.period || '')}]</span> <span class="ok">${escapeHtml(e.role || '')}</span> @ ${escapeHtml(e.company || '')}${e.summary ? `<div class="log-sum">${escapeHtml(e.summary)}</div>` : ''}</div>`
        )
        .join('');
    case 'contact':
      return `<div class="links">${data.links
        .map((l) => `<div class="link-row"><span class="dim">→</span> <span class="lbl">${escapeHtml(l.label || '')}</span> <a href="${escapeHtml(normalizeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.url || '')}</a></div>`)
        .join('')}</div>`;
    default:
      return '';
  }
}

function renderTerminal(data) {
  const accent = data.accent || DEFAULT_ACCENT;
  const name = data.name || 'me';
  const handle = (data.handle || name).toString().toLowerCase().replace(/\s+/g, '');
  const prompt = `<span class="usr">${escapeHtml(handle)}</span><span class="at">@</span><span class="host">wport</span><span class="path">:~$</span>`;
  const secs = presentSections(data);

  const nav = secs.map((s) => `<a href="#${s.id}">./${s.en}</a>`).join('');

  const heroLinks = secs
    .filter((s) => s.id === 'projects' || s.id === 'contact')
    .map((s) => `<a href="#${s.id}">${s.en}</a>`)
    .join(' <span class="dim">|</span> ');

  const panes = secs
    .map(
      (s) => `<section id="${s.id}" class="pane">
        <div class="pane-head"><span class="pr">${prompt}</span> <span class="cmd">${escapeHtml(s.cmd)}</span></div>
        <div class="pane-body">${terminalSection(s, data)}</div>
      </section>`
    )
    .join('\n      ');

  const body = `<header class="termnav">
    <span class="brand"><span class="usr">${escapeHtml(handle)}</span>@wport</span>
    <nav>${nav}</nav>
  </header>
  <main class="screen-wrap">
    <section id="top" class="window hero">
      <div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="tt">${escapeHtml(handle)}@wport: ~/portfolio</span></div>
      <div class="screen">
        <div class="line"><span class="pr">${prompt}</span> <span class="cmd">whoami</span></div>
        <div class="name-out">${escapeHtml(name)}</div>
        ${data.tagline ? `<div class="tagline">${escapeHtml(data.tagline)}</div>` : ''}
        ${data.location ? `<div class="out"><span class="dim">📍</span> ${escapeHtml(data.location)}</div>` : ''}
        ${heroLinks ? `<div class="line"><span class="pr">${prompt}</span> <span class="cmd">./explore</span></div><div class="out hero-links">${heroLinks}</div>` : ''}
        <div class="line"><span class="pr">${prompt}</span> <span class="cursor">█</span></div>
      </div>
    </section>
    ${panes}
    <footer class="foot"><span class="pr">${prompt}</span> <span class="dim">exit · made with</span> <span class="ok">&lt;3</span> <span class="dim">·</span> <a href="https://wport.me" target="_blank" rel="noopener noreferrer">wport</a></footer>
  </main>`;

  return pageShell({ title: `${escapeHtml(name)} · ~/portfolio`, accent, css: readCss('terminal'), bodyClass: 'terminal', body });
}

const THEMES = { cute: renderCute, terminal: renderTerminal };

export function renderWebsiteHtml(data, theme = 'cute') {
  const fn = THEMES[theme];
  if (!fn) throw new Error(`Unknown theme "${theme}". Use: ${Object.keys(THEMES).join(', ')}`);
  return fn(data);
}

function main() {
  const args = process.argv.slice(2);
  let theme = 'cute';
  const positional = [];
  for (const a of args) {
    const m = a.match(/^--theme(?:=(.+))?$/);
    if (m) theme = m[1] || 'cute';
    else positional.push(a);
  }
  const [input, output] = positional;

  if (!input) {
    console.error('Usage: node templates/website/render.mjs <input.json> [output.html] --theme=cute|terminal');
    process.exit(2);
  }

  const data = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), input), 'utf8'));
  const html = renderWebsiteHtml(data, theme);

  if (output) {
    const outputPath = path.resolve(process.cwd(), output);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Wrote ${outputPath} (${theme})`);
  } else {
    process.stdout.write(html);
  }
}

function isEntryScript() {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntryScript()) {
  main();
}
