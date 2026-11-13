import type { RequestHandler } from './$types';

// Liveness probe untuk container. Sengaja tidak memanggil API/DB: API punya
// healthcheck sendiri, dan restart API tidak boleh membuat web ikut dianggap mati.
export const GET: RequestHandler = ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store' });
	return Response.json({ status: 'ok', app: 'web' });
};
