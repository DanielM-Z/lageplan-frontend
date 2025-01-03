export interface DownloadRequestBoxDef {
	southWestLat: number;
	southWestLon: number;
	northEastLat: number;
	northEastLon: number;
}

export interface DownloadRequestSettingsDef {
	dxf: boolean;
	buildings_3d: boolean;
	aerial_view: boolean;
	area_txt: boolean;
}

// This is the json-payloud /download_map/ expects
export interface DownloadRequestDef {
	settings_req: DownloadRequestSettingsDef;
	box_req: DownloadRequestBoxDef;
}

export const API_ENDPOINTS = {
	ROOT: '/',
	DOWNLOAD_MAP: '/download_map/'
	// DELETE_ITEM: (id: string) => `/items/${id}`,
};
