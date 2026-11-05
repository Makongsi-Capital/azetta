import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '../env';

interface ObjectStorageConfig {
	client: S3Client;
	bucket: string;
	publicUrl: string;
}

let cachedConfig: ObjectStorageConfig | undefined;

function getConfig(): ObjectStorageConfig {
	if (cachedConfig) return cachedConfig;

	const env = getEnv();
	cachedConfig = {
		client: new S3Client({
			region: env.OBJECT_STORAGE_REGION?.trim() || 'auto',
			endpoint: env.OBJECT_STORAGE_ENDPOINT?.trim() || 'https://is3.cloudhost.id',
			credentials: {
				accessKeyId: env.OBJECT_STORAGE_ACCESS_KEY_ID,
				secretAccessKey: env.OBJECT_STORAGE_SECRET_ACCESS_KEY
			},
			forcePathStyle: true
		}),
		bucket: env.OBJECT_STORAGE_BUCKET,
		publicUrl: env.OBJECT_STORAGE_PUBLIC_URL.replace(/\/+$/, '')
	};

	return cachedConfig;
}

interface PutObjectInput {
	key: string;
	body: Uint8Array;
	contentType: string;
}

export async function putObject({ key, body, contentType }: PutObjectInput): Promise<void> {
	const { client, bucket } = getConfig();
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: body,
			ContentType: contentType,
			ACL: 'public-read'
		})
	);
}

export async function deleteObject(key: string): Promise<void> {
	const { client, bucket } = getConfig();
	await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** URL publik stabil untuk sebuah objek, mis. `https://media.azetta.id/units/2026/11/abc.webp`. */
export function buildPublicUrl(key: string): string {
	return `${getConfig().publicUrl}/${key}`;
}

/** Kembalikan key objek dari URL publik; URL luar dibiarkan apa adanya. */
export function objectKeyFromUrl(url: string): string {
	const { publicUrl } = getConfig();
	return url.startsWith(`${publicUrl}/`) ? url.slice(publicUrl.length + 1) : url;
}
