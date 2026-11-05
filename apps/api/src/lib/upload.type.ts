export interface MediaItem {
	id: string;
	key: string;
	url: string;
	mime: string;
	size: number;
	folder: string;
	original_name: string | null;
	uploaded_by: string | null;
	created_at: Date;
}

export interface UploadFileInput {
	file: File;
	folder: string;
	uploadedBy: string | null;
	/** Batas ukuran khusus (mis. lampiran publik 5 MB); default dari env. */
	maxBytes?: number;
}

export interface ListMediaInput {
	folder?: string;
	page: number;
	pageSize: number;
}

export interface ListMediaResult {
	items: MediaItem[];
	total: number;
	page: number;
	pageSize: number;
}
