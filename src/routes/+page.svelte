<script lang="ts">
	import { apiRequest } from '$lib/api/client';
	import { API_ENDPOINTS } from '$lib/api/endpoints';
	import MapSidebar from '$lib/components/custom/map-sidebar.svelte';
	import MapDisplay from '$lib/components/custom/map-display.svelte';
	import type { RectangleBounds } from '$lib/types/rectangle-bounds';
	import { toast } from 'svelte-sonner';

	// Variable to hold the rectangle
	let rectangleDim: RectangleBounds | null = $state(null);

	function rectangleCallback(bounds: RectangleBounds | null) {
		if (bounds) {
			rectangleDim = bounds;
		}
	}

	// This calls the backend with the selected region to generate the files.
	async function callBackend() {
		if (rectangleDim == null) {
			toast.error('No region selected');
			return;
		}

		try {
			const requestBody = {
				southWestLat: rectangleDim.south,
				southWestLon: rectangleDim.west,
				northEastLat: rectangleDim.north,
				northEastLon: rectangleDim.east
			};
			const response: Response = await apiRequest(API_ENDPOINTS.DOWNLOAD_MAP, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				const errorData = await response.json(); // Or response.text() if the error is not JSON
				toast.error(`Download failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
				return;
			}

			const blob = await response.blob();
			// Create a temporary URL for the Blob
			const url = window.URL.createObjectURL(blob);

			// Create a link element to trigger the download
			const a = document.createElement('a');
			a.href = url;

			// Extract filename from Content-Disposition header if available
			const contentDisposition = response.headers.get('Content-Disposition');
			let filename = 'lageplan.zip'; // Default filename
			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="(.+)"/);
				if (filenameMatch && filenameMatch.length > 1) {
					filename = filenameMatch[1];
				}
			}
			a.download = filename;

			// Append the link to the body
			document.body.appendChild(a);
			// Programmatically click the link to trigger the download
			a.click();

			// Clean up: remove the link and revoke the object URL
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			toast.error('Failed to initiate download');
			console.error('Download error:', error);
		}
	}
</script>

<div class="flex h-full flex-row">
	<div class="w-96">
		<MapSidebar
			width={rectangleDim?.widthKm ?? 0}
			height={rectangleDim?.heightKm ?? 0}
			buttonCallback={callBackend}
		/>
	</div>
	<div class="flex-1 p-2">
		<MapDisplay {rectangleCallback} />
	</div>
</div>