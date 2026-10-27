/* eslint-disable @typescript-eslint/no-namespace -- namespace global PrismaJson diwajibkan prisma-json-types-generator */
export {};

declare global {
	namespace PrismaJson {
		type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

		type LeadActivityMeta = {
			from?: string;
			to?: string;
			[k: string]: JsonValue | undefined;
		};

		type SiteSettingValue = JsonValue;

		type AuditSnapshot = { [key: string]: JsonValue };

		type FunnelProps = { [key: string]: JsonValue };
	}
}
