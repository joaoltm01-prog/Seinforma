import { fontes, typeLabels } from "./corpus.js";

const stopwords = new Set(["a","o","e","ou","de","do","da","dos","das","em","no","na","nos","nas","um","uma","para","por","com","sem","que","como","é","são","mais","menos","sobre","entre","se","ao","aos","à","às","the","of","and","sao","as","ser","isso","essa","esse","esta","este","qual","quais","pode","pelo","pela","seu","sua","uma","outras","outros","correntes","dialoga","compare","comparar","criticas"]);

const norm = (value) => String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const tokens = (value) => norm(value).split(/[^a-z0-9]+/i).filter((t) => t && !stopwords.has(t));

function scoreFonte(fonte, queryTokens) {
  const fields = [
    [fonte.title, 4],
    [fonte.author, 2],
    [fonte.tags.join(" "), fonte.bibliographyOnly ? 1 : 5],
    [fonte.bibliographyOnly ? "" : fonte.thesis, 3],
    [fonte.bibliographyOnly ? "" : fonte.evidence, 2],
    [fonte.bibliographyOnly ? "" : fonte.critique, 1]
  ];
  let score = 0;
  for (const token of queryTokens) {
    for (const [field, weight] of fields) {
      if (norm(field).includes(token)) score += weight;
    }
  }
  if (queryTokens.some((t) => ["brasil", "brasileiro", "brasileira"].includes(t)) && fonte.spectrum === "brasil") score += 2;
  if (queryTokens.some((t) => ["dado", "dados", "oficial", "estatistica", "estatística"].includes(t)) && fonte.type === "oficial") score += 3;
  if (queryTokens.some((t) => ["checar", "checagem", "fake", "desinformacao", "desinformação"].includes(t)) && fonte.type === "checagem") score += 3;
  if (queryTokens.some((t) => ["noticia", "notícia", "atual", "recente"].includes(t)) && fonte.type === "noticia") score += 3;
  return score;
}

function diversify(list, maxPerSpectrum = 2) {
  const seen = {};
  const out = [];
  for (const item of list) {
    const key = item.spectrum;
    seen[key] = seen[key] || 0;
    if (seen[key] < maxPerSpectrum) {
      out.push(item);
      seen[key] += 1;
    }
  }
  return out;
}

export function selectSources(question, activeTypes = Object.keys(typeLabels)) {
  const queryTokens = tokens(question);
  const phrase = value => norm(value).replace(/[^a-z0-9]+/g, " ").trim();
  const queryPhrase = ` ${phrase(question)} `;
  const explicitlyNamed = fonte => queryPhrase.includes(` ${phrase(fonte.title)} `);
  const pool = fontes
    .filter((fonte) => activeTypes.includes(fonte.type))
    .map((fonte) => ({ ...fonte, named: explicitlyNamed(fonte), score: scoreFonte(fonte, queryTokens) + (explicitlyNamed(fonte) ? 50 : 0) }));
  const positive = pool.filter((fonte) => fonte.score > 0).sort((a, b) => b.score - a.score);
  const bookPool = positive.filter(f => f.type === "livro");
  const namedBooks = bookPool.filter(f => f.named).slice(0, 6);
  const books = [...namedBooks, ...diversify(bookPool.filter(f => !f.named), 2)].slice(0, 6);
  const official = positive.filter((f) => f.type === "oficial").slice(0, 4);
  const news = positive.filter((f) => f.type === "noticia").slice(0, 2);
  const checks = positive.filter((f) => f.type === "checagem").slice(0, 2);
  const selected = [...official, ...books, ...news, ...checks];
  const unique = [...new Map(selected.map((f) => [f.id, f])).values()];
  return unique;
}

