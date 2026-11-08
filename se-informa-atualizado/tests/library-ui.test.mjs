import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseHTML } from 'linkedom';

test('interface filtra disponibilidade e expõe a edição e o trecho citado sem executar HTML', async t => {
  const { window, document } = parseHTML(await readFile(new URL('../index.html', import.meta.url), 'utf8'));
  const location = { hash: '#fontes', href: 'https://example.test/#fontes' };
  window.location = location;
  const edition = { id:'pg-3300', sourceId:'smith', title:'A Riqueza das Nações', originalTitle:'The Wealth of Nations', language:'en',
    translator:null, edition:'Original inglês de 1776', institution:'Project Gutenberg', originUrl:'https://www.gutenberg.org/ebooks/3300', textUrl:'https://www.gutenberg.org/ebooks/3300.txt.utf-8', rights:'public_domain', rightsNote:'Prazo encerrado no Brasil.', rightsUrl:'https://www.planalto.gov.br/ccivil_03/leis/l9610.htm',status:'indexed',chunkCount:1324,checkedAt:'2026-11-04T00:55:00Z' };
  globalThis.window=window;
  globalThis.document=document;
  globalThis.history={ pushState(_a,_b,hash){location.hash=hash;} };
  t.after(()=>{ delete globalThis.window; delete globalThis.document; delete globalThis.history; });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.focus = () => {};
  let fail = false;
  t.mock.method(globalThis,'fetch',async url => {
    if (url === '/api/biblioteca') return Response.json({ editions:[edition,{ ...edition,id:'pending',sourceId:'o-manifesto-comunista',title:'O Manifesto Comunista',rights:'unconfirmed',status:'pending',chunkCount:0,textUrl:null }] }, {status:fail?503:200});
    return Response.json({ sections:Array.from({length:5},(_,i)=>({title:`Seção ${i}`,paragraphs:['A passagem descreve trabalho [S1:T1].']})),
      sources:[{ id:'smith',title:'A Riqueza das Nações',author:'Adam Smith',year:'1776',type:'livro',spectrum:'liberal',digitalEdition:edition,
        passages:[{reference:'T1',section:'BOOK I',paragraphStart:4,paragraphEnd:5,page:null,content:'Original <img src=x onerror=alert(1)> labour.'}]}],retrieval:'searched' });
  });
  await import('../src/main.js');
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.match(document.querySelector('#libraryStatus').textContent,/1 obras com texto completo indexado/);
  assert.equal(document.querySelectorAll('#libraryDirectories a').length,6);
  document.querySelector('[data-filter-digital="indexed"]').click();
  assert.equal(document.querySelectorAll('[data-source-card]').length,1);
  assert.equal(document.querySelector('[data-source-card]').dataset.sourceCard,'smith');
  document.querySelector('[data-filter-digital="pending"]').click();
  assert.equal(document.querySelector('[data-source-card]').dataset.sourceCard,'o-manifesto-comunista');
  document.querySelector('#question').value='Como Smith explica o trabalho?';
  document.querySelector('#queryForm').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.match(document.querySelector('#answerDoc').textContent,/S1:T1/);
  assert.match(document.querySelector('#answerDoc').textContent,/Parágrafos 4–5/);
  assert.equal(document.querySelector('#answerDoc img'),null);
  assert.match(document.querySelector('#answerDoc blockquote').textContent,/<img/);
  document.querySelector('#answerDoc [data-cite]').click();
  assert(document.querySelector('[data-source-card="smith"]'));
  assert.equal(document.querySelector('[data-filter-digital="all"]').getAttribute('aria-pressed'),'true');
  fail=true;
  document.querySelector('[data-library-retry]').click();
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.match(document.querySelector('#libraryStatus').textContent,/indisponível/);
});
