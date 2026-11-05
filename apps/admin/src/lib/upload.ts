export interface UploadedMedia {
	id: string;
	key: string;
	url: string;
	mime: string;
	size: number;
	folder: string;
	original_name: string | null;
	created_at: string;
}
