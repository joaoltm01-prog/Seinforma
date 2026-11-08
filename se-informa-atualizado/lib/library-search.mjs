const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const stop = new Set('a o os as e ou um uma de do da dos das em no na nos nas ao aos com sem por para que qual quais como sobre explique compare segundo tratado governo livro obra autor diz dizer this that the of and in on to is what how'.split(' '));
// Auditable lexical expansion for the English pilot, not a translation of the books.
const bilingual = {
  republica: 'republic justice', leviata: 'leviathan commonwealth',
  liberdade: 'liberty freedom', livre: 'free liberty', pensamento: 'thought opinion', expressao: 'expression opinion discussion',
  censura: 'silencing opinion', dano: 'harm injury', danos: 'harm injury', individuo: 'individual', individual: 'individual',
  sociedade: 'society', estado: 'state commonwealth', soberania: 'sovereign sovereignty', soberano: 'sovereign',
  contrato: 'covenant contract', social: 'society covenant', natureza: 'nature natural', natural: 'natural nature',
  guerra: 'warre war', paz: 'peace', medo: 'fear feare', poder: 'power', poderes: 'power', autoridade: 'authority',
  propriedade: 'property', trabalho: 'labour labor', divisao: 'division', produtividade: 'productive productivity',
  riqueza: 'wealth', mercado: 'market', comercio: 'trade commerce', troca: 'exchange', preco: 'price', precos: 'price',
  salario: 'wages', salarios: 'wages', dinheiro: 'money', moeda: 'money', capital: 'stock capital', imposto: 'tax',
  impostos: 'taxes taxation', renda: 'rent revenue', desigualdade: 'inequality', pobreza: 'poverty poor',
  governo: 'government', consentimento: 'consent', direitos: 'rights', direito: 'right', resistencia: 'resistance',
  tirania: 'tyranny', democracia: 'democracy', justica: 'justice', justo: 'just justice', educacao: 'education',
  caverna: 'cave', filosofos: 'philosophers', filosofo: 'philosopher', virtude: 'virtue', alma: 'soul',
  mulheres: 'women', religiao: 'religion', maioria: 'majority', minorias: 'minority',
};
export function searchTerms(question) {
  const tokens = [...new Set(normalize(question).match(/[a-z]{3,}/g) || [])].slice(0, 60);
  return [...new Set(tokens.filter(t => !stop.has(t) || bilingual[t]).flatMap(t => bilingual[t]?.split(' ') || [t]))].slice(0, 60);
}
export function namedSources(question, sources) {
  const q = ` ${normalize(question).replace(/[^a-z0-9]+/g, ' ')} `;
  return sources.filter(source => {
    const title = normalize(source.title).replace(/[^a-z0-9]+/g, ' ');
    const surname = normalize(source.author).split(' ').at(-1);
    return q.includes(` ${title} `) || (surname.length > 3 && q.includes(` ${surname} `));
  }).map(source => source.id);
}
export function attachPassages(sources, rows, catalog) {
  const result = sources.map(source => ({ ...source, material: 'editorial' }));
  for (const row of rows) {
    let source = result.find(s => s.id === row.sourceId);
    if (!source) {
      const original = catalog.find(s => s.id === row.sourceId);
      if (!original) continue;
      source = { ...original, material: 'editorial' };
      result.push(source);
    }
    source.material = 'original_and_editorial';
    source.digitalEdition = row.edition;
    source.passages ??= [];
    source.passages.push({ reference: `T${source.passages.length + 1}`, id: row.id, section: row.section,
      paragraphStart: row.paragraphStart, paragraphEnd: row.paragraphEnd, page: row.page, content: row.content });
  }
  return result;
}
