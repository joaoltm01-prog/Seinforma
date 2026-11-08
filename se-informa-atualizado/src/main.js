import { fontes, typeLabels, spectrumLabels } from "./corpus.js";
import { politicalLabels } from "./political-profiles.js";
import { libraries, rightsLabels, digitalStatusLabels } from "./digital-library.js";
import { trails } from "./trails.js";
import { abertos } from "./repositorios.js";
for (const a of abertos) if (!fontes.some(f => f.id === a.id)) fontes.push(a);

const stopwords = new Set(["a","o","e","ou","de","do","da","dos","das","em","no","na","nos","nas","um","uma","para","por","com","sem","que","como","é","são","mais","menos","sobre","entre","se","ao","aos","à","às","the","of","and","sao","as","ser","isso","essa","esse","esta","este","qual","quais","pode","pelo","pela","seu","sua","uma"]);

const state = {
  activeTypes: new Set(Object.keys(typeLabels)),
  filterType: "all",
  filterSpectrum: "all",
  sourceSearch: "",
  lastAnswer: "",
  digitalEditions: [],
  libraryStatus: "loading",
  filterDigital: "all"
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (value) => String(value).replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
const norm = (value) => String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const tokens = (value) => norm(value).split(/[^a-z0-9]+/i).filter((t) => t && !stopwords.has(t));

// Each destination keeps its DOM and form state while another page is open.
function showPage(hash = window.location.hash) {
  let destination;
  try { destination = decodeURIComponent(hash.slice(1)); }
  catch { destination = "inicio"; }
  const target = document.getElementById(destination);
  const owner = target?.closest("[data-page]")?.dataset.page;
  const current = $("[data-page]:not([hidden])")?.dataset.page || "inicio";
  const page = owner || (destination === "top" || destination === "conteudo" ? current : "inicio");
  if (destination.startsWith("trilha-")) {
    const trail = document.getElementById(destination);
    if (trail) trail.open = true;
  }
  $$("[data-page]").forEach((panel) => { panel.hidden = panel.dataset.page !== page; });
  $$("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === page) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function navigateTo(page) {
  if (window.location.hash !== `#${page}`) history.pushState(null, "", `#${page}`);
  showPage(`#${page}`);
}

function badge(text, strong = false) {
  return `<span class="badge${strong ? " strong" : ""}">${esc(text)}</span>`;
}

function renderSpectrum() {
  const box = $("#spectrumList");
  const books = fontes.filter(source => source.type === "livro");
  const counts = books.reduce((acc, fonte) => {
    acc[fonte.spectrum] = (acc[fonte.spectrum] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(...Object.values(counts));
  box.innerHTML = `<p class="spectrum-total"><strong>${books.length}</strong> livros · classificação editorial</p>` + Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key, value]) => {
    const pct = max ? Math.round((value / max) * 100) : 0;
    return `<div class="spectrum-row"><b>${esc(spectrumLabels[key])}</b><div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div><span>${value}</span></div>`;
  }).join("") + `<a class="spectrum-link" href="#fontes">Explorar todas as ${Object.keys(politicalLabels).length} categorias →</a>`;
}

function renderToggleChips() {
  const box = $("#typeChips");
  box.innerHTML = Object.entries(typeLabels).map(([key, label]) => {
    const pressed = state.activeTypes.has(key);
    return `<button type="button" class="chip" data-type-toggle="${key}" aria-pressed="${pressed}">${esc(label)}</button>`;
  }).join("");
}

function renderFilterChips() {
  const typeBox = $("#filterType");
  const spectrumBox = $("#filterSpectrum");
  const typeItems = [["all", "Tudo"], ...Object.entries(typeLabels)];
  const spectrumItems = [["all", "Tudo"], ...Object.entries(spectrumLabels)];
  typeBox.innerHTML = typeItems.map(([key, label]) => `<button type="button" class="chip" data-filter-type="${key}" aria-pressed="${state.filterType === key}">${esc(label)}</button>`).join("");
  spectrumBox.innerHTML = spectrumItems.map(([key, label]) => `<button type="button" class="chip" data-filter-spectrum="${key}" aria-pressed="${state.filterSpectrum === key}">${esc(label)} (${key === "all" ? fontes.length : fontes.filter(f => f.spectrum === key).length})</button>`).join("");
}

function digitalFor(source) {
  return state.digitalEditions.find(edition => edition.sourceId === source.id);
}
function digitalStatus(source) {
  return digitalFor(source)?.status || 'bibliography';
}
function editionDetails(edition) {
  return `<div class="digital-receipt"><p><strong>${esc(edition.originalTitle)}</strong> · ${esc(edition.language === 'en' ? 'Inglês' : 'Português')}</p>
    <p>${esc(edition.edition)}</p><p><strong>Tradução:</strong> ${esc(edition.translator || 'Não se aplica / não informada nesta edição')}</p>
    <p><strong>${esc(rightsLabels[edition.rights] || rightsLabels.unconfirmed)}:</strong> ${esc(edition.rightsNote)}</p>
    <p><a href="${esc(edition.originUrl)}" target="_blank" rel="noopener noreferrer">Ver edição em ${esc(edition.institution)} ↗</a>
    · <a href="${esc(edition.rightsUrl)}" target="_blank" rel="noopener noreferrer">Base da verificação de direitos ↗</a>
    ${edition.status === 'indexed' && edition.textUrl ? ` · <a href="${esc(edition.textUrl)}" target="_blank" rel="noopener noreferrer">Texto completo ↗</a>` : ''}</p>
    <p class="meta">${edition.chunkCount} trechos · verificação: ${esc(new Date(edition.checkedAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}. ${edition.status === 'indexed' ? 'Localização por seção e parágrafos do índice; sem paginação editorial.' : 'Texto não importado.'}</p></div>`;
}
function renderRights() {
  const box = $('#rightsSummary');
  if (!box) return;
  const books = fontes.filter(f => f.type === 'livro');
  const dig = state.digitalEditions;
  const by = (r) => dig.filter(e => e.rights === r).map(e => e.title);
  const pd = [...by('public_domain'), ...abertos.map(a => a.title)];
  const only = books.length - dig.length - abertos.length;
  const li = (t, arr) => `<li><strong>${t}</strong> (${arr.length})${arr.length ? ': ' + esc(arr.join('; ')) : ''}</li>`;
  box.innerHTML = `<ul>${li('Domínio público', pd)}${li('Licença aberta', by('open_license'))}${li('Direitos em verificação', by('unconfirmed'))}<li><strong>Só ficha bibliográfica</strong> (${only}): sem texto, com resumo editorial e link para edição legal.</li></ul>${state.libraryStatus === 'error' ? '<p class="meta">Índice digital indisponível: contagem parcial.</p>' : ''}`;
}
function renderLibrary() {
  const indexed = state.digitalEditions.filter(e => e.status === 'indexed');
  const pending = state.digitalEditions.filter(e => e.status === 'pending');
  $('#libraryStatus').textContent = state.libraryStatus === 'loading' ? 'Conferindo o índice digital…' :
    state.libraryStatus === 'error' ? 'O índice digital está indisponível. Não foi possível conferir o status das obras; as fichas continuam disponíveis.' :
    `${indexed.length} obras com texto completo indexado · ${pending.length} com direitos pendentes. As edições do piloto estão em inglês; as respostas permanecem em português.`;
  $('#libraryEditions').innerHTML = state.digitalEditions.map(e => `<details><summary>${esc(e.title)} <span class="badge">${esc(digitalStatusLabels[e.status])}</span></summary>${editionDetails(e)}</details>`).join('');
  renderRights();
  $('#libraryDirectories').innerHTML = libraries.map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.name)} ↗</a><p>${esc(l.focus)}</p></li>`).join('');
  $('#filterDigital').innerHTML = [['all','Todas'],['indexed',digitalStatusLabels.indexed],['pending',digitalStatusLabels.pending],['bibliography',digitalStatusLabels.bibliography]].map(([key,label]) => `<button type="button" class="chip" data-filter-digital="${key}" aria-pressed="${state.filterDigital === key}">${esc(label)}</button>`).join('');
}
async function loadLibrary() {
  try {
    const response = await fetch('/api/biblioteca', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Índice indisponível');
    const data = await response.json();
    if (!Array.isArray(data.editions)) throw new Error('Índice inválido');
    state.digitalEditions = data.editions;
    state.libraryStatus = 'ready';
  } catch { state.libraryStatus = 'error'; }
  renderLibrary();
  renderSources();
}

function sourceMatchesState(fonte) {
  const typeOk = state.filterType === "all" || fonte.type === state.filterType;
  const spectrumOk = state.filterSpectrum === "all" || fonte.spectrum === state.filterSpectrum;
  const hay = norm([fonte.title, fonte.author, fonte.tags.join(" "), fonte.thesis, fonte.evidence, fonte.critique, fonte.political?.tradition || "", digitalFor(fonte)?.originalTitle || "", spectrumLabels[fonte.spectrum]].join(" "));
  const searchOk = !state.sourceSearch || tokens(state.sourceSearch).every((token) => hay.includes(token));
  return typeOk && spectrumOk && searchOk && (state.filterDigital === 'all' || (fonte.type === 'livro' && state.libraryStatus === 'ready' && digitalStatus(fonte) === state.filterDigital));
}

function renderSources() {
  const grid = $("#sourceGrid");
  const filtered = fontes.filter(sourceMatchesState);
  $("#sourceCount").textContent = `${filtered.length} de ${fontes.length} referências · 555 registros do PDF incorporados`;
  if (!filtered.length) {
    grid.innerHTML = `<div class="panel console" style="grid-column:1/-1"><p>Nenhuma fonte encontrada com esses filtros. Ajuste o tipo, o espectro ou a busca.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map((fonte, index) => `
    <article class="source-card${index < 2 ? " featured" : ""}" id="fonte-${fonte.id}" data-source-card="${fonte.id}">
      <div class="source-top">
        <div class="badges">${badge(typeLabels[fonte.type], true)}${badge(spectrumLabels[fonte.spectrum])}${fonte.type === "livro" && state.libraryStatus === "ready" ? badge(digitalStatusLabels[digitalStatus(fonte)]) : ""}</div>
        <span class="meta">${esc(fonte.year)}</span>
      </div>
      <h3>${esc(fonte.title)}</h3>
      <div class="meta">${esc(fonte.author)}</div>
      <p${fonte.bibliographyOnly ? ' class="bibliography-note"' : ""}>${esc(fonte.thesis)}</p>
      ${fonte.political ? `<div class="political-context"><span class="eyebrow">Leitura política · ${esc(fonte.political.version)}</span><p>${esc(fonte.political.tradition)}</p><span class="classification-status">Provisória · ver justificativa em Detalhes</span></div>` : ""}
      <div class="source-detail">
        ${fonte.political ? `<div class="political-receipt"><p><strong>Por que este enquadramento?</strong> ${esc(fonte.political.reason)}</p><p><strong>Ressalva:</strong> ${esc(fonte.political.caveat)}</p><p><strong>Base e limites:</strong> ${esc(fonte.political.basis)}</p><p><strong>Status:</strong> ${esc(fonte.political.status)} · versão ${esc(fonte.political.version)}. Não representa revisão humana independente.</p></div>` : ""}
        ${digitalFor(fonte) ? editionDetails(digitalFor(fonte)) : ""}
        ${fonte.open ? `<p><strong>Domínio público.</strong> Texto no repositório <a href="${esc(fonte.open.url)}" target="_blank" rel="noopener noreferrer">${esc(fonte.open.repo)} ↗</a>. Edição específica ainda não verificada e texto ainda não importado para a consulta.</p>` : ""}
        ${fonte.category ? `<p><strong>Seção no PDF:</strong> ${esc(fonte.category)}</p>` : ""}
        ${fonte.pdfPage ? `<p><strong>Página da lista bibliográfica (não da obra):</strong> ${fonte.pdfPage}</p>` : ""}
        ${fonte.evidence ? `<p><strong>Uso como evidência:</strong> ${esc(fonte.evidence)}</p>` : ""}
        ${fonte.critique ? `<p><strong>Contra-argumento registrado:</strong> ${esc(fonte.critique)}</p>` : ""}
        ${fonte.tags.length ? `<p><strong>Etiquetas:</strong> ${esc(fonte.tags.join(" · "))}</p>` : ""}
      </div>
      <div class="card-actions">
        <button class="btn small" type="button" data-action="toggle" aria-expanded="false">Detalhes</button>
        <button class="btn small" type="button" data-action="ask">Perguntar com esta fonte</button>
        <button class="btn small" type="button" data-action="suggest" data-id="${esc(fonte.id)}">Sugerir correção</button>
      </div>
    </article>
  `).join("");
}

function renderTrails() {
  $("#trailList").innerHTML = trails.map(trail => `
    <details class="trail" id="trilha-${trail.id}">
      <summary><span class="trail-number">${trail.number}</span><span><span class="eyebrow">${esc(trail.theme)}</span><span class="trail-title">${esc(trail.title)}</span></span><span class="trail-count">${trail.steps.length} leituras <span aria-hidden="true">↗</span></span></summary>
      <div class="trail-body">
        <div class="trail-brief"><p>${esc(trail.intro)}</p><h3>Pergunta que guia a trilha</h3><p class="trail-question">${esc(trail.question)}</p><p class="field-note">A ordem propõe mudanças de perspectiva; não é um ranking de autores. As perguntas são roteiros de investigação, não resumos ou citações das obras.</p></div>
        <ol class="trail-steps">${trail.steps.map(step => {
          const source = fontes.find(f => f.title === step.title);
          return `<li><span class="eyebrow">${esc(step.lens)}</span><h3>${esc(source.title)}</h3><p class="meta">${esc(source.author)} · ${esc(source.year)}</p>${badge(spectrumLabels[source.spectrum])}<p class="step-prompt">${esc(step.prompt)}</p><button class="btn small" type="button" data-open-source="${esc(source.id)}">Ver ficha e enquadramento →</button></li>`;
        }).join("")}</ol>
        <div class="trail-synthesis"><span class="eyebrow">Seu exercício de síntese</span><p>${esc(trail.synthesis)}</p><div class="hero-actions"><button class="btn primary" type="button" data-trail-question="${trail.id}">Preparar consulta sobre a trilha</button><button class="btn" type="button" data-copy-trail="${trail.id}">Copiar roteiro com créditos</button><a class="btn" href="#trilha-${trail.id}">Link desta trilha</a></div><p class="field-note" data-trail-status="${trail.id}" role="status"></p></div>
        <p class="trail-credit">Se Informe · Curadoria de trilhas T1 · Enquadramentos P1. Os livros permanecem de seus respectivos autores e titulares.</p>
      </div>
    </details>`).join("");
}

async function copyTrail(id) {
  const trail = trails.find(t => t.id === id);
  if (!trail) return;
  const url = new URL(window.location.href);
  url.hash = `trilha-${id}`;
  const text = [
    `Se Informe — ${trail.title}`, trail.intro, `Pergunta: ${trail.question}`,
    ...trail.steps.map((step, index) => {
      const source = fontes.find(f => f.title === step.title);
      return `${index + 1}. ${source.title} — ${source.author} (${source.year})\nEnquadramento editorial provisório: ${source.political.tradition}\n${step.prompt}`;
    }), `Exercício de síntese: ${trail.synthesis}`,
    'Curadoria: Se Informe · T1. Classificações provisórias P1; não equivalem a análise dos textos integrais. Direitos dos livros pertencem aos respectivos titulares.', url.href
  ].join("\n\n");
  const status = $(`[data-trail-status="${id}"]`);
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Roteiro copiado com autoria e link de origem.";
  } catch {
    status.textContent = "A cópia automática não está disponível. Selecione o roteiro na página ou compartilhe o link desta trilha.";
  }
}

function citeButton(fonte, n, passage = "") {
  return `<button type="button" class="cite" data-cite="${fonte.id}" title="Abrir fonte">${`S${n}${passage ? `:T${passage}` : ""}`} · ${esc(fonte.author)}</button>`;
}

function renderAnswer(data, question) {
  const citedText = (value) => esc(value).replace(/\[S(\d+)(?::T(\d+))?\]/g, (match, n, passage) => {
    const source = data.sources[Number(n) - 1];
    return source ? citeButton(source, Number(n), passage) : "";
  });
  state.lastAnswer = [
    `Pergunta: ${question}`,
    ...data.sections.map(section => `${section.title}\n\n${section.paragraphs.join("\n\n")}`),
    "Referências do acervo:\n" + data.sources.map((source, i) => `[S${i + 1}] ${source.author} — ${source.title} (${source.year})${source.digitalEdition ? ` — ${source.digitalEdition.edition} — ${source.digitalEdition.originUrl}\n` + source.passages.map(p => `${p.reference}: ${p.section}, parágrafos ${p.paragraphStart}–${p.paragraphEnd}: ${p.content}`).join("\n\n") : ""}`).join("\n")
  ].join("\n\n");
  return `<div class="answer-meta"><span>Análise com base no acervo</span><span>${data.sources.length} referências</span></div>
    <h2 id="resposta-title" tabindex="-1">Resposta à sua consulta</h2>
    <p class="answer-question">${esc(question)}</p>
    <div class="notice">${data.sources.some(s => s.passages?.length) ? "Análise gerada por IA com fichas editoriais e trechos recuperados de edições digitais. Marcadores S:T identificam os trechos; as traduções explicativas ao português são geradas pela IA. Confira o texto da edição antes de citar." : "Análise gerada por IA somente com fichas e resumos editoriais; nenhum trecho de obra foi utilizado nesta resposta."} ${data.retrieval === "unavailable" ? "O índice digital está temporariamente indisponível. " : ""}Sem consulta à web em tempo real.</div>
    ${data.sections.map(section => `<div><h3>${esc(section.title)}</h3>${section.paragraphs.map(p => `<p>${citedText(p)}</p>`).join("")}</div>`).join("")}
    <div><h3>Referências do acervo</h3><ul>${data.sources.map((source, i) => `<li>${citeButton(source, i + 1)} <strong>${esc(source.title)}</strong> (${esc(source.year)}) — ${esc(typeLabels[source.type])}, ${esc(spectrumLabels[source.spectrum])}.${source.digitalEdition ? `<details class="answer-passages"><summary>Edição e trechos fornecidos à IA</summary>${editionDetails(source.digitalEdition)}${source.passages.map(p => `<blockquote><strong>[S${i + 1}:${esc(p.reference)}] · ${esc(p.section)}</strong><p class="meta">Parágrafos ${p.paragraphStart}–${p.paragraphEnd} do índice${p.page ? ` · página ${esc(p.page)}` : " · sem página editorial"}</p><p lang="en">${esc(p.content)}</p></blockquote>`).join("")}</details>` : ""}</li>`).join("")}</ul></div>`;
}

let pendingQuery = null;

async function submitQuestion(question) {
  pendingQuery?.abort();
  const controller = new AbortController();
  pendingQuery = controller;
  const answerDoc = $("#answerDoc");
  const answer = $("#answer");
  const submit = $('#queryForm button[type="submit"]');
  state.lastAnswer = "";
  $("#copyBtn").disabled = true;
  answer.hidden = false;
  answerDoc.hidden = false;
  answer.setAttribute("aria-busy", "true");
  answerDoc.innerHTML = `<h2 id="resposta-title">Preparando sua resposta…</h2><p role="status">Relacionando a pergunta às fontes e comparando as interpretações do acervo.</p><div class="answer-skeleton" aria-hidden="true"><span></span><span></span><span></span></div>`;
  submit.disabled = true;
  submit.textContent = "Consultando…";
  answer.scrollIntoView({ behavior: "smooth", block: "start" });
  const timeout = setTimeout(() => controller.abort(), 55000);
  try {
    const response = await fetch("/api/consulta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, types: [...state.activeTypes] }),
      signal: controller.signal
    });
    let data;
    try { data = await response.json(); }
    catch { throw new Error("O serviço de consulta retornou uma resposta inválida. Tente novamente em instantes."); }
    if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "Não foi possível gerar a resposta. Tente novamente.");
    if (!data || !Array.isArray(data.sections) || data.sections.length !== 5 ||
        !data.sections.every(section => section && typeof section.title === "string" && Array.isArray(section.paragraphs) && section.paragraphs.length && section.paragraphs.every(p => typeof p === "string")) ||
        !Array.isArray(data.sources) || !data.sources.length || !data.sources.every(source => source && fontes.some(f => f.id === source.id))) {
      throw new Error("A resposta recebida está incompleta. Tente novamente em instantes.");
    }
    if (pendingQuery !== controller) return;
    answerDoc.innerHTML = renderAnswer(data, question);
    $("#copyBtn").disabled = false;
    if (!$("#consulta").hidden) $("#resposta-title").focus({ preventScroll: true });
  } catch (error) {
    if (pendingQuery !== controller) return;
    const message = error.name === "AbortError" ? "A consulta demorou mais que o esperado. Tente novamente." :
      error instanceof TypeError ? "Não foi possível conectar ao serviço de consulta. Verifique sua conexão e tente novamente." : error.message;
    answerDoc.innerHTML = `<h2 id="resposta-title">Não foi possível concluir a consulta</h2><p role="alert">${esc(message)}</p><button class="btn" type="button" data-retry> Tentar novamente</button>`;
  } finally {
    clearTimeout(timeout);
    if (pendingQuery === controller) {
      answer.setAttribute("aria-busy", "false");
      submit.disabled = false;
      submit.textContent = "Consultar base";
      pendingQuery = null;
    }
  }
}

function openSource(id) {
  navigateTo("fontes");
  state.filterType = "all";
  state.filterSpectrum = "all";
  state.filterDigital = "all";
  renderLibrary();
  state.sourceSearch = "";
  $("#sourceSearch").value = "";
  renderFilterChips();
  renderSources();
  const card = $(`[data-source-card="${id}"]`);
  if (!card) return;
  card.classList.add("open");
  const toggle = $("[data-action='toggle']", card);
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Fechar detalhes";
  }
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function copyAnswer() {
  const btn = $("#copyBtn");
  if (!state.lastAnswer) return;
  let area;
  try {
    try {
      await navigator.clipboard.writeText(state.lastAnswer);
    } catch {
      area = document.createElement("textarea");
      area.value = state.lastAnswer;
      area.setAttribute("aria-label", "Resposta para copiar");
      document.body.appendChild(area);
      area.select();
      if (!document.execCommand?.("copy")) throw new Error("Clipboard unavailable");
    }
    btn.textContent = "Resposta copiada";
  } catch {
    btn.textContent = "Selecione o texto para copiar";
  } finally {
    area?.remove();
    setTimeout(() => { btn.textContent = "Copiar resposta"; }, 1800);
  }
}

function bindEvents() {
  // Reveal the destination before the browser follows an in-page anchor.
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      showPage(link.getAttribute("href"));
    }
  });
  window.addEventListener("hashchange", () => {
    showPage();
    const destination = document.getElementById(window.location.hash.slice(1));
    destination?.scrollIntoView({ block: "start" });
  });
  window.addEventListener("popstate", () => showPage());
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-retry]")) {
      $("#queryForm").requestSubmit();
      return;
    }
    const open = event.target.closest("[data-open-source]");
    if (open) { openSource(open.dataset.openSource); return; }
    const copy = event.target.closest("[data-copy-trail]");
    if (copy) { copyTrail(copy.dataset.copyTrail); return; }
    const prepare = event.target.closest("[data-trail-question]");
    if (prepare) {
      const trail = trails.find(t => t.id === prepare.dataset.trailQuestion);
      if (!trail) return;
      state.activeTypes.add("livro");
      renderToggleChips();
      navigateTo("consulta");
      $("#question").value = `${trail.question} Compare as perspectivas das obras: ${trail.steps.map(step => step.title).join("; ")}. Separe o que as fichas permitem afirmar do que exigiria ler os textos integrais. Que evidência mudaria a conclusão?`;
      $("#question").focus();
      return;
    }
    const typeToggle = event.target.closest("[data-type-toggle]");
    if (typeToggle) {
      const key = typeToggle.dataset.typeToggle;
      if (state.activeTypes.has(key) && state.activeTypes.size > 1) state.activeTypes.delete(key);
      else state.activeTypes.add(key);
      renderToggleChips();
      return;
    }

    const filterType = event.target.closest("[data-filter-type]");
    if (filterType) {
      state.filterType = filterType.dataset.filterType;
      renderFilterChips();
      renderSources();
      return;
    }

    const filterSpectrum = event.target.closest("[data-filter-spectrum]");
    if (filterSpectrum) {
      state.filterSpectrum = filterSpectrum.dataset.filterSpectrum;
      renderFilterChips();
      renderSources();
      return;
    }

    const sample = event.target.closest(".sample");
    if (sample) {
      $("#question").value = sample.dataset.q;
      $("#queryForm").requestSubmit();
      return;
    }

    const cite = event.target.closest("[data-cite]");
    if (cite) {
      openSource(cite.dataset.cite);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const card = actionButton.closest("[data-source-card]");
      const fonte = fontes.find((item) => item.id === card?.dataset.sourceCard);
      if (!fonte) return;
      if (actionButton.dataset.action === "toggle") {
        const isOpen = card.classList.toggle("open");
        actionButton.setAttribute("aria-expanded", String(isOpen));
        actionButton.textContent = isOpen ? "Fechar detalhes" : "Detalhes";
      }
      if (actionButton.dataset.action === "ask") {
        state.activeTypes.add(fonte.type);
        renderToggleChips();
        navigateTo("consulta");
        $("#question").value = `Como ${fonte.title} dialoga com dados oficiais, críticas e outras correntes?`;
        $("#consulta").scrollIntoView({ behavior: "smooth", block: "start" });
        $("#queryForm").requestSubmit();
      }
    }
  });

  $("#queryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const question = $("#question").value.trim();
    if (!question) return;
    submitQuestion(question);
  });

  $("#clearBtn").addEventListener("click", () => {
    pendingQuery?.abort();
    pendingQuery = null;
    $("#answer").hidden = true;
    $("#answer").setAttribute("aria-busy", "false");
    const submit = $('#queryForm button[type="submit"]');
    submit.disabled = false;
    submit.textContent = "Consultar base";
    $("#queryForm").reset();
    state.activeTypes = new Set(Object.keys(typeLabels));
    state.lastAnswer = "";
    renderToggleChips();
    $("#answerDoc").hidden = true;
    $("#answerDoc").innerHTML = "";
    $("#copyBtn").disabled = true;
    $("#question").focus();
  });

  $("#copyBtn").addEventListener("click", copyAnswer);

  $("#sourceSearch").addEventListener("input", (event) => {
    state.sourceSearch = event.target.value;
    renderSources();
  });
}

document.addEventListener('click', event => {
  const filter = event.target.closest('[data-filter-digital]');
  if (filter) { state.filterDigital = filter.dataset.filterDigital; renderLibrary(); renderSources(); }
  if (event.target.closest('[data-library-retry]')) { state.libraryStatus = 'loading'; renderLibrary(); loadLibrary(); }
});

function init() {
  renderTrails();
  renderSpectrum();
  renderToggleChips();
  renderFilterChips();
  renderSources();
  showPage();
  bindEvents();
  renderLibrary();
  loadLibrary();
}

init();

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-action="suggest"]');
  if (!b) return;
  const f = fontes.find(x => x.id === b.dataset.id);
  if (!f) return;
  navigator.clipboard?.writeText(`Sugestão de correção — ${f.title} (${f.author}): `).catch(() => {});
  b.textContent = 'Texto copiado: cole na mensagem';
  window.open('https://ig.me/m/txrmachado', '_blank', 'noopener');
});
