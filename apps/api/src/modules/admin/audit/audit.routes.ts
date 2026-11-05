import { Elysia } from 'elysia';
import { requireStaff } from '../../../lib/guard';
import { listAuditLogs } from './audit.service';

export const auditRoutes = new Elysia({ prefix: '/admin/audit-logs' }).get(
	'/',
	async ({ request, query }) => {
		await requireStaff(request.headers);
		return listAuditLogs(query);
	}
);
