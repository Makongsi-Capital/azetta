import type { RequestHandler } from './$types';

// Liveness probe untuk container. Sengaja tidak memanggil API/DB: API punya
// healthcheck sendiri, dan restart API tidak boleh membuat admin ikut dianggap mati.
export const GET: RequestHandler = ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store' });
	return Response.json({ status: 'ok', app: 'admin' });
};
