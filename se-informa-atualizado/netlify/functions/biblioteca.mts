import { libraryStore } from '../../lib/library.js';
import { libraryTimeout } from '../../lib/library-timeout.mjs';
export default async (request: Request) => {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  try {
    const editions = await libraryTimeout(libraryStore.listEditions());
    return Response.json({ editions }, { headers: { 'Cache-Control': 'public, max-age=300' } });
  } catch {
    return Response.json({ error: 'O índice digital está temporariamente indisponível. As fichas editoriais continuam acessíveis.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
export const config = { path: '/api/biblioteca' };
